import { Service } from "typedi";
import KanbanRoom from "./kanban-room";
import { KanbanClientOption, StudyRoomClient } from "@/types";
import StudyRoom from "./study-room";

@Service()
class RoomManager {
    private kanbanRooms: KanbanRoom[];
    private studyRooms: StudyRoom[];
    
    constructor() { 
        this.kanbanRooms = [];
        this.studyRooms = [];
    }

     /**
     * Adds a client to a kanban room, creating the room if it doesn't exist.
     * 
     * @param data - {KanbanClientOption}
     */
    joinKanban(data: KanbanClientOption) {
        const existingRoom = this.kanbanRooms.find(room => room.id === data.boardId);

        if (!existingRoom) {
            const newRoom = new KanbanRoom(data.boardId);
            newRoom.connect(data);
            this.kanbanRooms.push(newRoom);
            return;
        } 

        existingRoom.connect(data);
    }

    /**
     * Adds a client to a kanban room, creating the room if it doesn't exist.
     * 
     * @param data - {StudyRoomClient}
     */
    joinStudyRoom(data: StudyRoomClient) {
        const existingRoom = this.studyRooms.find(room => room.id === data.room.id); 

        if (!existingRoom) {
            const newRoom = new StudyRoom(data.room.id, data.room);
            newRoom.connect(data);
            this.studyRooms.push(newRoom);
            return;
        } 

        existingRoom.connect(data);
    }

}

export default RoomManager;