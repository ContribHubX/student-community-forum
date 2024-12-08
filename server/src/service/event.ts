import { ICommunityEvent, ICommunityEventDto } from "@/domain/interfaces/ICommunity";
import CommunityEventRepository from "@/domain/repository/event";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";
import EventManager from "@/pubsub/event-manager";

/**
 * Service responsible for handling community event-related operations.
 */
@Service()
class CommunityEventService {
  @Inject(() => CommunityEventRepository)
  private communityEventRepo!: CommunityEventRepository;

  @Inject(() => EventManager)
  private eventManager!: EventManager;

  /**
   * Creates a new community event.
   *
   * @param {ICommunityEventDto} dto - The data transfer object containing the information to create a community event.
   * @returns {Promise<ICommunityEvent | undefined>} - The created community event object or undefined if an error occurs.
   * @throws {AppError} - Throws an error if the community event creation fails.
   */
  public async createCommunityEvent(dto: ICommunityEventDto): Promise<ICommunityEvent | undefined> {
    try {
      const event = await this.communityEventRepo.create(dto);
        
      if (!event) throw new AppError("Error creating event");

      this.eventManager.publishToMany<object>("community-event--new", { communityId: event.communityId });
      return event;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Create community event error");
    }
  }

//   /**
//    * Updates an existing community event.
//    *
//    * @param {ICommunityEventUpdateDto} dto - The data transfer object containing the information to update a community event.
//    * @returns {Promise<ICommunityEvent | undefined>} - The updated community event object or undefined if an error occurs.
//    * @throws {AppError} - Throws an error if the community event update fails.
//    */
//   public async updateCommunityEvent(dto: ICommunityEventUpdateDto): Promise<ICommunityEvent | undefined> {
//     try {
//       const event = await this.communityEventRepo.update(dto);
//       this.eventManager.publishToMany<ICommunityEvent>("community-event--updated", event);
//       return event;
//     } catch (error: any) {
//       if (error instanceof AppError) throw error;
//       throw new AppError("Update community event error");
//     }
//   }

  /**
   * Retrieves a community event by its ID.
   *
   * @param {string} eventId - The unique identifier of the community event to retrieve.
   * @returns {Promise<ICommunityEvent | undefined>} - The community event object with the given ID or undefined if not found.
   * @throws {AppError} - Throws an error if the retrieval of the community event fails.
   */
  public async getCommunityEventById(eventId: string): Promise<ICommunityEvent | undefined> {
    try {
      return await this.communityEventRepo.getById(eventId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting community event");
    }
  }

  /**
   * Retrieves all community events for a given community.
   *
   * @param {string} communityId - The ID of the community whose events need to be fetched.
   * @returns {Promise<ICommunityEvent[] | undefined>} - The array of community events or undefined if not found.
   * @throws {AppError} - Throws an error if the retrieval of community events fails.
   */
  public async getAllCommunityEvents(communityId: string): Promise<ICommunityEvent[] | undefined> {
    try {
      return await this.communityEventRepo.getEvents(communityId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting community events");
    }
  }
}

export default CommunityEventService;
