import { Request, Response } from "express";

const getMyPlaygrounds = async (req: Request, res: Response) => {
    res.send('Hello from playgrounds');
}
export { getMyPlaygrounds };