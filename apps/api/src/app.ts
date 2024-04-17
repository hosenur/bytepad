import express, { Application, Request, Response } from 'express';
import playgroundRouter from "@/routes/playgroundRouter"
const app: Application = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/playgrounds", playgroundRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
