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
}>;

export type Comment = Entity<{
  content: string;
  parentId: string | null;
  createdAt: Date;
  createdBy: User;
  replies: Comment[];
}>;

export type Community = Entity<{
  name: string;
  description: string;
  banner: string;
  icon: string;
  createdBy: User;
}>;

export type CommunityWithMembers = Community & {
  members: {
    joinedAt: Date;
    user: User;
  };
};
