import { Chat } from "@/types";

const users = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    attachment: "https://picsum.photos/seed/alice/100", // Dummy image
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    attachment: "https://picsum.photos/seed/bob/100", // Dummy image
  },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    attachment: "https://picsum.photos/seed/charlie/100", // Dummy image
  },
  {
    id: "4",
    name: "Diana",
    email: "diana@example.com",
    attachment: "https://picsum.photos/seed/diana/100", // Dummy image
  },
  {
    id: "5",
    name: "Eve",
    email: "eve@example.com",
    attachment: "https://picsum.photos/seed/eve/100", // Dummy image
  },
  {
    id: "6",
    name: "Frank",
    email: "frank@example.com",
    attachment: "https://picsum.photos/seed/frank/100", // Dummy image
  },
  {
    id: "7",
    name: "Grace",
    email: "grace@example.com",
    attachment: "https://picsum.photos/seed/grace/100", // Dummy image
  },
  {
    id: "8",
    name: "Hank",
    email: "hank@example.com",
    attachment: "https://picsum.photos/seed/hank/100", // Dummy image
  },
  {
    id: "9",
    name: "Ivy",
    email: "ivy@example.com",
    attachment: "https://picsum.photos/seed/ivy/100", // Dummy image
  },
  {
    id: "10",
    name: "Jack",
    email: "jack@example.com",
    attachment: "https://picsum.photos/seed/jack/100", // Dummy image
  },
];

const generateChats = (): Chat[] => {
  const chats: Chat[] = [];

  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const isIndicator = Math.random() > 0.5;
    const chat: Chat = {
      id: `${i + 1}`,
      createdAt: new Date(),
      roomId: "room1",
      type: isIndicator ? "indicator" : "message",
      message: isIndicator
        ? `${randomUser.name} joined the room`
        : `This is a message from ${randomUser.name}`,
      createdBy: {
        id: randomUser.id,
        name: randomUser.name,
        email: randomUser.email,
        attachment: randomUser.attachment,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    chats.push(chat);
  }

  return chats;
};

export const chats = generateChats();
