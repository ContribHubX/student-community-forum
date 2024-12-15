export type BaseEntity = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Entity<T> = BaseEntity & T;

export type User = Entity<{
  name: string;
  email: string;
  attachment: string;
  provider?: string;
}>;

export type Thread = Entity<{
  title: string;
  content: string;
  attachment: string;
  createdBy: User;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isSaved: boolean;
  tags?: Tag[];
  communityId: string | null;
  topicId: string | null;
  questionId: string | null;
}>;

export type Tag = Entity<{
  name: string;
  threadId: string;
}>;

export type Comment = Entity<{
  content: string;
  parentId: string | null;
  createdAt: Date;
  createdBy: User;
  threadId: string;
  replies: Comment[];
}>;

export type Community = Entity<{
  name: string;
  description: string;
  banner: string;
  icon: string;
  createdBy: User;
}>;

export type Reaction = Entity<{
  type: ReactionType;
  userId: string;
  thread: Thread;
}>;

export type ReactionType = "LIKE" | "DISLIKE";

export type CommunityWithMembers = Community & {
  members: [
    {
      joinedAt: Date;
      user: User;
    },
  ];
  // members: User[]
};

export type CommunityTab = "Threads" | "Events" | "Members" | "Media";

export type CommunityEvent = Entity<{
  name: string;
  eventDate: Date;
  tags: CommunityEventTag[];
  communityId: string;
}>;

export type CommunityEventTag = Entity<{
  name: string;
  communityEventId: string;
}>

export type Topic = Entity<{
  name: string;
  attachment: string;
  createdBy: User | null;
  followerCount: number;
}>;

export type TopicUserFollow = {
  user: User;
  topicId: string;
};

export type Question = Entity<{
  name: string;
  title: string;
  content: string;
  threads: Thread[];
  topic: Topic;
  createdBy: User;
}>;

export type QuestionVoteStats = {
  upvoteCount: number;
  downvoteCount: number;
  userVote: "up" | "down";
};

export type QuestionVote = {
  userId: string;
  questionId: string;
  vote: "up" | "down";
};

export type PendingQuestionRequest = {
  question: Question;
  requestedBy: User;
  requestedTo: User;
};

export type Board = Entity<{
  id: string;
  name: string;
  status: BoardStatus;
  createdBy: User;
  members: User[];
}>;

export type BoardStatus = "active" | "finished" | "archived";

export type Task = Entity<{
  id: string;
  name: string;
  description: string;
  attachment: string | undefined;
  status: TaskStatusType;
  sequence: number;
  createdAt: Date;
  createdBy: User;
  assignees: User[];
  boardId: string;
}>;

export type TaskStatusType = "todo" | "doing" | "finished";

export type CursorPosition = {
  x: number;
  y: number;
};

export type BoardState = {
  user: User;
  position: CursorPosition;
  color: number;
};

export type Notification = Entity<{
  message: string;
  entityId: string;
  entityType: NotificationEntityType;
  type: NotificationType;
  link: string;
  isRead: boolean;
  createdBy: User;
  receiveBy: string;
}>;

export type ThreadNotificationType = "like" | "dislike" | "comment" | "reply";

export type TaskNotificationType = "assigned" | "updated" | "completed";

export type QuestionRequestNotificationType = "request";

export type NotificationEntityType = "task" | "thread" | "question";

export type NotificationType = ThreadNotificationType &
  TaskNotificationType &
  QuestionRequestNotificationType;

export type StudyRoom = Entity<{
  name: string;
  description: string;
  attachment: string;
  createdBy: User;
}>;

export type Todo = Entity<{
  name: string;
  isDone: boolean;
  createdBy: User;
}>;

export type Chat = Entity<{
  message: string;
  type: ChatType;
  roomId: string;
  createdBy: User;
}>;

export type ChatType = "message" | "indicator";

export type RoomState = {
  users: User[];
  room: StudyRoom;
  video: VideoType;
  timer: GroupTimerState;
};

export type VideoType = {
  id: string;
  title: string;
  thumbnail: string;
  state: number;
  time: number;
};

export type GroupTimerState = {
  state: "break" | "focus";
  time: number;
  formattedTime: string;
};

export type GlobalEventState = {
  emittedBy: string;
  type: "thread" | "topic" | "question";
};

export type Argument = Entity<{
  content: string;
  createdBy: User;
  likeCount: number;
  dislikeCount: number;
  position: { x: number, y: number };
  tags: ArgumentTag[];
  communityId: string;
}>

export type ArgumentTag = Entity<{
  name: string; 
  argumentId: string;
}>

export type DiscussionState = {
  community: Community;
  arguments: Argument[];
  currentArgument: Argument | undefined; 
  currentArgumentModified: Argument | undefined;
  users: User[];  
}