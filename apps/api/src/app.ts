import express, { Application, Request, Response } from 'express';
import dockerode from 'dockerode';

const app: Application = express();
const docker = new dockerode()
const port = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});
app.post("/create-playground", (req: Request, res: Response) => {
    //create a sample nodejs container
    docker.createContainer({
        Image: "node:14",
        Cmd: ["node", "-e", "setInterval(() => console.log('Hello, world!'), 1000)"],
        name: "nodejs-container"
    }).then((container) => {
        container.start();
        res.send("Container created successfully");
    }).catch((err) => {
        console.log(err)
        res.send("Error creating container");
    })

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});