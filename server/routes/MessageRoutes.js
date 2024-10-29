import { Router } from "express";
import { addMessage, getMessages,addImageMessage } from "../controllers/MessageController.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

//const uploadImage = multer({ dest: "uploads/images" });

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", upload.single("image"),addImageMessage);
export default router;
