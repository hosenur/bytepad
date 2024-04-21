import http from "http"
import proxyServer from "http-proxy";
import { redis } from "./utils/redis";
import { env } from "./config";

const proxy = proxyServer.createProxyServer({});
const server = http.createServer(async (req, res) => {
    console.log("request")
    const host = req.headers.host;
    if (host === 'hosenur.cloud') {
        console.log("Request to API")
        proxy.web(req, res, { target: 'http://10.122.16.2:8080' });
    }
    if (req.headers.host?.split('.')[1] === 'hosenur' && req.headers.host?.split('.').length === 3) {
        const tag = req.headers.host?.split('.')[0];
        const port = await redis.get(tag);
        if (!port) {
            return;
        }
        console.log("Request to Proxy")
        proxy.web(req, res, { target: 'http://10.122.16.2/'+port });
    }
})

server.listen(env.APP_PORT, () => {
    console.log("Proxy server is running on port 7070");
})
