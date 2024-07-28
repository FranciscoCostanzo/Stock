import { Router } from "express";
import { checkToken, login, register } from "../controllers/POST/authUsers.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/check-token", checkToken);

export default router;
