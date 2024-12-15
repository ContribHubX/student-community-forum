import { Service } from "typedi";
import KanbanRoom from "./kanban-room";
import { DiscussionClientOption, KanbanClientOption, StudyRoomClient } from "@/types";
import StudyRoom from "./study-room";
import DiscussionRoom from "./discussion-room";

@Service()
class RoomManager {
    private kanbanRooms: KanbanRoom[];
    private studyRooms: StudyRoom[];
    private discussionRooms: DiscussionRoom[];

    constructor() { 
        this.kanbanRooms = [];
        this.studyRooms = [];
        this.discussionRooms = [];
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

    /**
     * Adds a client to a discussion room, creating the room if it doesn't exist.
     * 
     * @param data - {DiscussionClientOption}
     */
    joinDiscussionRoom(data: DiscussionClientOption) {
        const existingRoom = this.discussionRooms.find(room => room.details.id === data.community.id);
    
        if (!existingRoom) {
            const newRoom = new DiscussionRoom(data.community);
            newRoom.connect(data);
            this.discussionRooms.push(newRoom);
            return;
        } 

        existingRoom.connect(data);
    }

}

export default RoomManager;