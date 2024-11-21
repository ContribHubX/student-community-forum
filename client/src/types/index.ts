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
}>;

export type Thread = Entity<{
  title: string;
  content: string;
  attachment: string;
  createdBy: User;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;

  communityId: string | null;
  topicId: string | null;
  questionId: string | null;
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
  threadId: string;
}>;

export type ReactionType = "LIKE" | "DISLIKE";

export type CommunityWithMembers = Community & {
  members: [
    {
      joinedAt: Date;
      user: User;
    },
  ];
};

export type Topic = Entity<{
  name: string;
  attachment: string;
  createdBy: User | null;
  followerCount: number;
}>;

export type Question = Entity<{
  name: string;
  title: string;
  content: string;
  createdBy: User;
}>;

export type PendingQuestionRequest = {
  question: Question,
  requestedBy: User,
  requestedTo: User
}
