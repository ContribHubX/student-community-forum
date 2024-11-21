import { database as db } from "..";
import { QuestionTable } from "../schema";

(async () => {
    try {
        console.log("Starting database seeding...");

        await db.insert(QuestionTable).values([
            {
              title: "What is TypeScript?",
              content: "Can someone explain what TypeScript is and how it differs from JavaScript?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Choosing Between React and Angular",
              content: "What are the pros and cons of React and Angular for frontend development?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Optimizing Node.js Applications",
              content: "What are the best practices for improving the performance of a Node.js application?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "How to Start with Tailwind CSS",
              content: "I am new to Tailwind CSS. Can someone guide me on how to get started?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Understanding Async/Await",
              content: "How does async/await work in JavaScript? Can you provide examples?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Best Practices for Database Design",
              content: "What are the essential tips for designing a scalable and efficient database schema?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Git Branching Strategies",
              content: "What are some effective branching strategies for working in a team using Git?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "REST vs GraphQL",
              content: "What are the differences between REST APIs and GraphQL, and when should you use each?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "OAuth 2.0 vs JWT",
              content: "What are the differences between OAuth 2.0 and JWT, and how do they complement each other?",
              createdBy: "112999052731055780618",
              topicId: null,
            },
            {
              title: "Should I Use a Framework?",
              content: "When is it better to use a JavaScript framework, and when should you stick to vanilla JavaScript?",
              createdBy: "112999052731055780618",
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
