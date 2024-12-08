import { Router } from "express";
import { MessagesController } from "../controllers/messages-controllers.js";
export const messagesRoutes = Router();
const messagesController = new MessagesController();
messagesRoutes.get("/", messagesController.getMessages);
messagesRoutes.get("/:id", messagesController.getMessage);
messagesRoutes.post("/", messagesController.createMessage);
messagesRoutes.put("/:id", messagesController.updateMessage);
messagesRoutes.delete("/:id", messagesController.deleteMessage);
