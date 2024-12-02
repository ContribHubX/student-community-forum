import { Todo } from "@/types"; // Assuming Todo and User are imported from their respective files

export const tasks: Todo[] = [
  {
    id: "1",
    name: "Complete the study material",
    isDone: false,
    createdBy: {
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-05"),
        name: "John Doe",
        email: "john.doe@example.com",
        attachment:
          "https://staticg.sportskeeda.com/editor/2022/04/92327-16488770433052-1920.jpg",
    },
    createdAt: new Date("2024-11-01T10:00:00Z"),
    updatedAt: new Date("2024-11-01T12:00:00Z"),
  },
  {
    id: "2",
    name: "Finish homework assignment",
    isDone: false,
    createdBy: {
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-05"),
        name: "John Doe",
        email: "john.doe@example.com",
        attachment:
          "https://staticg.sportskeeda.com/editor/2022/04/92327-16488770433052-1920.jpg",
    },
    createdAt: new Date("2024-11-02T09:30:00Z"),
    updatedAt: new Date("2024-11-02T11:00:00Z"),
  },
  {
    id: "3",
    name: "Attend study group session",
    isDone: true,
    createdBy: {
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-05"),
        name: "John Doe",
        email: "john.doe@example.com",
        attachment:
          "https://staticg.sportskeeda.com/editor/2022/04/92327-16488770433052-1920.jpg",
    },
    createdAt: new Date("2024-11-03T14:00:00Z"),
    updatedAt: new Date("2024-11-03T16:30:00Z"),
  },
  {
    id: "4",
    name: "Prepare presentation slides",
    isDone: false,
    createdBy: {
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-05"),
        name: "John Doe",
        email: "john.doe@example.com",
        attachment:
          "https://staticg.sportskeeda.com/editor/2022/04/92327-16488770433052-1920.jpg",
    },
    createdAt: new Date("2024-11-04T08:00:00Z"),
    updatedAt: new Date("2024-11-04T10:00:00Z"),
  },
  {
    id: "5",
    name: "Review code for project",
    isDone: true,
    createdBy: {
        id: "1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-05"),
        name: "John Doe",
        email: "john.doe@example.com",
        attachment:
          "https://staticg.sportskeeda.com/editor/2022/04/92327-16488770433052-1920.jpg",
    },
    createdAt: new Date("2024-11-05T15:30:00Z"),
    updatedAt: new Date("2024-11-05T18:00:00Z"),
  },
];


