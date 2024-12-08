import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { eq } from "drizzle-orm";
import { CommunityEventTable, CommunityEventTagsTable } from "@/database/schema";
import { ICommunityEvent, ICommunityEventDto, ICommunityEventTags } from "../interfaces/ICommunity";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";

@Service()
class CommunityEventRepository {
  private db: MySql2Database<typeof schema>;

  constructor() {
    this.db = Container.get("database");
  }

  /**
   * Adds a new community event with its tags as a transaction.
   *
   * @param dto Community event data.
   * @returns The created community event.
   */
  public create(dto: ICommunityEventDto): Promise<ICommunityEvent | undefined> {
    let event: any;

    return new Promise(async (resolve, reject) => {
      try {
        const eventResult = await this.db.transaction(async (tx) => {
          const eventResult = await tx
            .insert(CommunityEventTable)
            .values({
              name: dto.name,
              eventDate: new Date(dto.eventDate),
              createdBy: dto.createdBy,
              communityId: dto.communityId,
            })
            .$returningId();
  
          if (!eventResult[0]) {
            throw new AppError("Failed to create community event", 500);
          }
  
          event = eventResult[0];
  
          if (dto.tags && dto.tags.length > 0) {
            const tagValues = dto.tags.map((tag: ICommunityEventTags) => ({
              name: tag as unknown as string,
              communityEventId: event.id,
            }));
  
            await tx.insert(CommunityEventTagsTable).values(tagValues);
          }
  
        });
        
        const createdEvent = await this.getById(event.id);
        resolve(createdEvent);
      } catch (error: any) {
        // Reject the promise with the error
        reject(new AppError(error.message || "Transaction failed", error.status || 500));
      }
    });
  }
  

  
  /**
   * Fetches all community events for a given community ID, including their tags.
   *
   * @param communityId Community ID.
   * @returns An array of community events.
   */
  public async getEvents(communityId: string): Promise<ICommunityEvent[]> {
    try {
      const events = await this.db.query.CommunityEventTable.findMany({
        where: eq(CommunityEventTable.communityId, communityId),
        with: {
          tags: true,
          createdBy: true,
        },
      });

      return events as unknown as ICommunityEvent[];
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch community events", error.status || 500);
    }
  }

  /**
   * Fetches a community event by ID, including its tags.
   *
   * @param eventId Event ID.
   * @param db Transactional database (optional).
   * @returns The community event or undefined.
   */
  public async getById(eventId: string): Promise<ICommunityEvent | undefined> {
    try {
      const result = await this.db.query.CommunityEventTable.findFirst({
        where: eq(CommunityEventTable.id, eventId),
        with: {
          tags: true,
          createdBy: true,
        },
      });

      if (!result) {
        throw new AppError("Community event not found", 404);
      }

      return result as unknown as ICommunityEvent;
    } catch (error: any) {
      throw new AppError(error.message || "Failed to fetch community event", error.status || 500);
    }
  }
}

export default CommunityEventRepository;
