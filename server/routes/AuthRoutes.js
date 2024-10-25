import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onboardUser,
} from "../controllers/AuthController.js";

const router = new Router();

router.post("/checkUser", checkUser);
router.post("/onboardUser", onboardUser);
router.get("/get-contacts", getAllUsers);

export default router;
