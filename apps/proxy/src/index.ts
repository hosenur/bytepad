import http from "http"
import proxyServer from "http-proxy";
import { redis } from "./utils/redis";
const proxy = proxyServer.createProxyServer({});
const server = http.createServer(async (req, res) => {
    const host = req.headers.host;
    if (host === 'hosenur.cloud') {
        proxy.web(req, res, { target: 'http://10.122.0.2:8000' });
    }
    if (req.headers.host?.split('.')[1] === 'hosenur' && req.headers.host?.split('.').length === 3) {
        const tag = req.headers.host?.split('.')[0];
        const port = await redis.get(tag);
        if (!port) {
            return;
        }
        proxy.web(req, res, { target: 'http://10.122.0.2:' + port });
    }
})

server.listen(80, () => {
    console.log("Proxy server is running on port 80");
})
