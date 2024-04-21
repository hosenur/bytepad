import { checkTag, createContainer, getDirectory, getFile, saveFile } from "@/utils/containerUtils";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { exec } from "child_process";
import * as http from "http";
import { Server } from "socket.io";
import util from "util";
import { app } from "./app";
import { redis } from "./utils/redis";
import { clearPlayground } from "./utils/playgroundUtils";
const execAsync = util.promisify(exec);
async function stopIdleContainers() {
  console.log("Checking for idle containers");
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
}, 60000);


function bootstrap() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "https://www.bytepad.pro",
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

    const port = await createContainer(tag);
    socket.emit("containerCreated", port);
    const contents = await getDirectory(`./tmp/${tag}`, "");
    socket.emit("directory", contents);

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
