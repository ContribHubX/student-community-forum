import { database as db } from "..";
import { QuestionTable } from "../schema";


const createdBy = "112999052731055780618";

(async () => {
    try {
        console.log("Starting database seeding...");

        await db.insert(QuestionTable).values([
            {
              title: "What is TypeScript?",
              content: "Can someone explain what TypeScript is and how it differs from JavaScript?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Choosing Between React and Angular",
              content: "What are the pros and cons of React and Angular for frontend development?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Optimizing Node.js Applications",
              content: "What are the best practices for improving the performance of a Node.js application?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "How to Start with Tailwind CSS",
              content: "I am new to Tailwind CSS. Can someone guide me on how to get started?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Understanding Async/Await",
              content: "How does async/await work in JavaScript? Can you provide examples?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Best Practices for Database Design",
              content: "What are the essential tips for designing a scalable and efficient database schema?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Git Branching Strategies",
              content: "What are some effective branching strategies for working in a team using Git?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "REST vs GraphQL",
              content: "What are the differences between REST APIs and GraphQL, and when should you use each?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "OAuth 2.0 vs JWT",
              content: "What are the differences between OAuth 2.0 and JWT, and how do they complement each other?",
              createdBy: createdBy,
              topicId: null,
            },
            {
              title: "Should I Use a Framework?",
              content: "When is it better to use a JavaScript framework, and when should you stick to vanilla JavaScript?",
              createdBy: createdBy,
              topicId: null,
            },
          ]);
          

        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Error while seeding the database:", error);
    } finally {
        process.exit();
    }
})();
