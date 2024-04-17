import express, { Application, Request, Response } from 'express';
import dockerode from 'dockerode';

const app: Application = express();
const docker = new dockerode()
const port = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});