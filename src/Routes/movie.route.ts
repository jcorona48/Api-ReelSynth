
import { Router } from "express";
import { getMovieByURL } from "../Controllers/movie.controller";
const router = Router();


router.get("/movie", getMovieByURL);


export default router;