import { activeUser } from "../Controllers/auth.controller";
import { Router } from "express";
const router = Router();

router.get("/active/:token", activeUser);

export default router;
