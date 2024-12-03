import { Chat } from "@/types";

const users = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    attachment: "alice.jpg",
  },
  { id: "2", name: "Bob", email: "bob@example.com", attachment: "bob.jpg" },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    attachment: "charlie.jpg",
  },
  {
    id: "4",
    name: "Diana",
    email: "diana@example.com",
    attachment: "diana.jpg",
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
