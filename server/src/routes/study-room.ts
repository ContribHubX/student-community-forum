import { Router } from "express";
import studyRoomController from "@/api/study-room";
import { verifyAuth } from "@/api/middleware";
import { validateRequest } from "@/api/middleware";
import {
    createStudyRoomSchema,
    createTodoSchema,
    updateTodoSchema,
    createChatSchema,
} from "@/libs/validators/study-room-validator";

const router = Router();

export default (app: Router) => {
    app.use("/study-room", router);
    
    // Todo Routes
    router.post("/todo", verifyAuth, validateRequest(createTodoSchema), studyRoomController.createTodoHandler);
    router.put("/todo", verifyAuth, validateRequest(updateTodoSchema), studyRoomController.updateTodoHandler);
    router.get("/todo", verifyAuth, studyRoomController.getAllTodosHandler);

    // Study Room Routes
    router.post("/", verifyAuth, validateRequest(createStudyRoomSchema), studyRoomController.createRoomHandler);
    router.get("/:roomId", verifyAuth, studyRoomController.getRoomByIdHandler);
    router.get("/", verifyAuth, studyRoomController.getAllRoomsHandler);
    
    // Chat Routes
    router.post("/chat", verifyAuth, validateRequest(createChatSchema), studyRoomController.createChatHandler);
    router.get("/:roomId/chats", verifyAuth, studyRoomController.getAllChatsHandler);
};
