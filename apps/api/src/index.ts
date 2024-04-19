import { app } from "./app";
import util from "util";
import { exec } from "child_process";
import { Server } from "socket.io";
import * as http from "http";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { s3 } from "./utils/s3";
import { createContainer, getDirectory } from "./utils/containerUtils";
//last request map stores the tag : last request time
const lastRequestMap = new Map<string, number>();
const execAsync = util.promisify(exec);

//set interval to check for idle containers
// setInterval(() => {
//   lastRequestMap.forEach(async (time, tag) => {
//     if (Date.now() - time > 30000) {
//       await execAsync(`docker stop ${tag}`);
//       await execAsync(`docker rm ${tag}`);
//       lastRequestMap.delete(tag);
//       console.log(`Container with tag ${tag} stopped and removed`)
//     }
//   });
// }, 10000);

function bootstrap() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
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

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("getContainer", async (tag: string) => {
      lastRequestMap.set(tag, Date.now());
      const appPort = await createContainer(tag)
      console.log(appPort,"appport")
      socket.emit("containerCreated", appPort)
    })

    socket.on("getDirectory", async (tag: string) => {
      lastRequestMap.set(tag, Date.now());
      const directory = await getDirectory(tag)
      console.log(directory)
      socket.emit("directory", directory)
    })
    socket.on("getFileContent", async (tag: string, file: string) => {
      lastRequestMap.set(tag, Date.now());
      const { stdout: content } = await execAsync(`docker exec ${tag} cat /app/${file}`);
      socket.emit("fileContent", content)
    })
    socket.on("saveFile", async (tag: string, file: string, content: string) => {
      lastRequestMap.set(tag, Date.now());
      await execAsync(`docker exec ${tag} sh -c "echo '${content}' > /app/${file}"`);
      const params = {
        Bucket: "bytepad",
        Key: `playgrounds/${tag}/${file}`,
        Body: content
      }
      await s3.putObject(params).promise()
    })
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
