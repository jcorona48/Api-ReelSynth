import { Request, Response } from "express";
import User from "../Models/User.js";
import { verifyToken } from "../utils/Token.js";

export const activeUser = async (req: Request, res: Response) => {
    if (!req.params.token)
        res.status(400).json({ message: "token is required" });
    const token = req.params.token;
    const user = verifyToken(token);

    if (typeof user === "string") {
        res.status(400).json({ message: "token is invalid" });
        return;
    }

    if (user.status === "ACTIVE") {
        res.status(400).json({ message: "user is already active" });
        return;
    }

    const userFound = await User.findOneAndUpdate(user.id, {
        status: "ACTIVE",
    }).populate({
        path: "role country",
    });

    res.status(200).json(userFound);
};
