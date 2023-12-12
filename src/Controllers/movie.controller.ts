import CuevanaScrapingPuppeteer from "../utils/Scraping/Cuevana-puppeteer";
import { Request, Response } from "express";

export const getMovieByURL = async (req: Request, res: Response) => {
    if (!req.body.url) res.status(400).json({ message: "url is required" });
    console.log(req.body);
    const url = req.body.url;

    const data = await CuevanaScrapingPuppeteer(url);
    res.status(200).json(data);
};
