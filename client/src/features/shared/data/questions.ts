import { Question } from "@/types";

export const sampleQuestions: Question[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "What is TypeScript?",
    title: "Understanding TypeScript Basics",
    content:
      "Can someone explain what TypeScript is and how it differs from JavaScript?",
    createdBy: {
      id: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attachment: "profile-pic-alice.png",
    },
  },
  {
    id: "2",
    createdAt: new Date(),
    name: "React vs Angular",
    title: "Choosing Between React and Angular",
    content:
      "What are the pros and cons of React and Angular for frontend development?",
    createdBy: {
      id: "u2",
      createdAt: new Date(),
      name: "Bob Smith",
      email: "bob.smith@example.com",
      attachment: "profile-pic-bob.png",
    },
  },
  {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Node.js Performance",
    title: "Optimizing Node.js Applications",
    content:
      "What are the best practices for improving the performance of a Node.js application?",
    createdBy: {
      id: "u3",
      createdAt: new Date(),
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      attachment: "profile-pic-charlie.png",
    },
  },
  {
    id: "4",
    createdAt: new Date(),
    name: "Tailwind CSS Basics",
    title: "How to Start with Tailwind CSS",
    content:
      "I am new to Tailwind CSS. Can someone guide me on how to get started?",
    createdBy: {
      id: "u4",
      createdAt: new Date(),
      name: "Diana Ross",
      email: "diana.ross@example.com",
      attachment: "profile-pic-diana.png",
    },
  },
  {
    id: "5",
    createdAt: new Date(),
    name: "Async/Await in JavaScript",
    title: "Understanding Async/Await",
    content:
      "How does async/await work in JavaScript? Can you provide examples?",
    createdBy: {
      id: "u5",
      createdAt: new Date(),
      name: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      attachment: "profile-pic-ethan.png",
    },
  },
  {
    id: "6",
    createdAt: new Date(),
    name: "Database Design",
    title: "Best Practices for Database Design",
    content:
      "What are the essential tips for designing a scalable and efficient database schema?",
    createdBy: {
      id: "u6",
      createdAt: new Date(),
      name: "Fiona Gallagher",
      email: "fiona.gallagher@example.com",
      attachment: "profile-pic-fiona.png",
    },
  },
  {
    id: "7",
    createdAt: new Date(),
    name: "Version Control",
    title: "Git Branching Strategies",
    content:
      "What are some effective branching strategies for working in a team using Git?",
    createdBy: {
      id: "u7",
      createdAt: new Date(),
      name: "George Clooney",
      email: "george.clooney@example.com",
      attachment: "profile-pic-george.png",
    },
  },
  {
    id: "8",
    createdAt: new Date(),
    name: "APIs and Microservices",
    title: "REST vs GraphQL",
    content:
      "What are the differences between REST APIs and GraphQL, and when should you use each?",
    createdBy: {
      id: "u8",
      createdAt: new Date(),
      name: "Hannah Williams",
      email: "hannah.williams@example.com",
      attachment: "profile-pic-hannah.png",
    },
  },
  {
    id: "9",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "Secure Authentication",
    title: "OAuth 2.0 vs JWT",
    content:
      "What are the differences between OAuth 2.0 and JWT, and how do they complement each other?",
    createdBy: {
      id: "u9",
      createdAt: new Date(),
      name: "Isaac Newton",
      email: "isaac.newton@example.com",
      attachment: "profile-pic-isaac.png",
    },
  },
  {
    id: "10",
    createdAt: new Date(),
    name: "JavaScript Frameworks",
    title: "Should I Use a Framework?",
    content:
      "When is it better to use a JavaScript framework, and when should you stick to vanilla JavaScript?",
    createdBy: {
      id: "u10",
      createdAt: new Date(),
      name: "Jane Austen",
      email: "jane.austen@example.com",
      attachment: "profile-pic-jane.png",
    },
  },
];