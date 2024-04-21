import http from "http";
import proxyServer from "http-proxy";
import { redis } from "./utils/redis";
import { env } from "./config";

const proxy = proxyServer.createProxyServer({});
const server = http.createServer(async (req, res) => {
    console.log("request")
    console.log(req.headers)
    const host = req.headers.host;
    if (host === 'hosenur.cloud') {
        console.log("Request to API")
        proxy.web(req, res, { target: 'http://10.122.16.2:8080' });
    }
    if (req.headers.host?.split('.')[1] === 'hosenur' && req.headers.host?.split('.').length === 3) {
        const tag = req.headers.host?.split('.')[0];
        const data = await redis.get(tag);
        const port = JSON.parse(data || '{}').port;
        if (!port) {
            return;
        }
        console.log(tag)
        console.log("Request to Proxy")
        console.log("Forwarding to", "http://10.122.16.2:"+port);
        proxy.web(req, res, { target: 'http://10.122.16.2:'+port });
    }
});

// Middleware to enable CORS
server.on('request', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to specific origins if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
});

server.listen(env.APP_PORT, () => {
    console.log("Proxy server is running on port", env.APP_PORT);
});
