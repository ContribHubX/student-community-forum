import { Service } from "typedi";
import Room from "./room";
import { KanbanClientOption } from "@/types";

@Service()
class KanbanRoomManager {
    private rooms: Room[];
    
    constructor() { this.rooms = [] }

     /**
     * Adds a client to a room, creating the room if it doesn't exist.
     * 
     * @param data - {KanbanClientOption}
     */
    join(data: KanbanClientOption) {
        const existingRoom = this.rooms.find(room => room.id === data.boardId);

        if (!existingRoom) {
            const newRoom = new Room(data.boardId);
            newRoom.connect(data);
            this.rooms.push(newRoom);
            return;
        } 

        existingRoom.connect(data);
    }

}

export default KanbanRoomManager;