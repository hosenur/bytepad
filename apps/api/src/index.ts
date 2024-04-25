import { createContainer, getDirectory, getFile, saveFile, syncFile } from "@/utils/containerUtils";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import * as http from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { clearPlayground } from "./utils/playgroundUtils";
import { redis } from "./utils/redis";
import { checkTag } from "./utils/helpers";
import fs from "fs-extra"
// Checks for idle container and removes them if last request was more than 20 minutes ago
async function stopIdleContainers() {
  const keys = await redis.keys("*");
  if (!keys) return;
  await Promise.all(keys.map(async (key) => {
    const containerInfo = await redis.get(key);
    const { lastRequest, port } = JSON.parse(containerInfo || "{}");
    console.log(`Last request from ${key} was: ${(Date.now() - lastRequest) / 1000 / 60} minues before`);
    if (Date.now() - lastRequest > 20 * 60 * 1000) {
      await clearPlayground(key);
    }
  }));

}

setInterval(async () => {
  await stopIdleContainers();
}, 10000);


function bootstrap() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*"
    },
    transports: ["websocket", "polling"]
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const isValid = ClerkExpressWithAuth({
      signInUrl: "/login",
    });
    if (!isValid) {
      return next(new Error("Authentication error"));
    }
    next();
  });

  io.on("connection", async (socket) => {
    const tag = socket.handshake.query.tag as string;
    if (!tag) {
      socket.disconnect();
      return;
    }
    const exists = await checkTag(tag);
    
    if (!exists) {
      const port = await createContainer(tag);
      socket.emit("containerCreated", port);
    }



    const contents = await getDirectory(`./tmp/${tag}`, "");
    socket.emit("directory", contents);

    fs.watch(`./tmp/${tag}`, async () => {
      const contents = await getDirectory(`./tmp/${tag}`, "");
      socket.emit("directory", contents);
    })
    

    socket.on("getDirectory", async (dir: string, callback) => {
      const dirPath = `./tmp/${tag}/${dir}`;
      const contents = await getDirectory(dirPath, dir);
      callback(contents);
    });

    socket.on("getFile", async ({ path: filePath }: { path: string }, callback) => {
      const fullPath = `./tmp/${tag}${filePath}`;
      const data = await getFile(fullPath, tag);
      callback(data);
    })

    socket.on("saveFile", async ({ path: filePath, content }: { path: string, content: string, tag: string }) => {
      const fullPath = `./tmp/${tag}${filePath}`;
      await saveFile(fullPath, content, tag);
      await syncFile(tag, fullPath, content);
    });



    socket.on("disconnect", (socket) => {
      console.log("user disconnected", socket);
      console.log("user disconnected");
    });

  });


  server.listen(app.get("port"), () => {
    console.log(
      `Server is running at http://${app.get("host")}:${app.get("port")}`
    );
  });
}

bootstrap();

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
