import http from "http"
import proxyServer from "http-proxy";
import { redis } from "./utils/redis";
const proxy = proxyServer.createProxyServer({});
const server = http.createServer(async (req, res) => {
    const subdomain = req.headers.host?.split('.')[0];
    if (!subdomain) {
        return;
    }
    const port = await redis.get(subdomain);
    if (!port) {
        return;
    }
    proxy.web(req, res, { target: 'http://localhost:' + port });
})