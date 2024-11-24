import { Task } from "@/types";

const tasks: Task[] = [
  {
    id: "1",
    name: "Implement user authentication",
    description: "Set up authentication using OAuth for the platform.",
    attachment: "auth-docs.pdf",
    status: "todo",
    createdAt: new Date("2024-01-15"),
    createdBy: {
      id: "101",
      name: "Alice Smith",
      email: "alice@example.com",
      attachment: "profile-pic-alice.png",
    },
    assingnees: [
      {
        id: "102",
        name: "Bob Johnson",
        email: "bob@example.com",
        attachment: "profile-pic-bob.png",
      },
    ],
    sequence: 1, // assigned manually
  },
  {
    id: "2",
    name: "Design homepage layout",
    description: "Create a wireframe for the homepage layout.",
    attachment: "homepage-sketch.jpg",
    status: "doing",
    createdAt: new Date("2024-01-12"),
    createdBy: {
      id: "103",
      name: "Carol Danvers",
      email: "carol@example.com",
      attachment: "profile-pic-carol.png",
    },
    assingnees: [
      {
        id: "104",
        name: "Dave Richards",
        email: "dave@example.com",
        attachment: "profile-pic-dave.png",
      },
    ],
    sequence: 1, // assigned manually
  },
  {
    id: "3",
    name: "Develop notification service",
    description: "Build the notification service for real-time updates.",
    attachment: "service-design.pdf",
    status: "finished",
    createdAt: new Date("2024-01-05"),
    createdBy: {
      id: "105",
      name: "Eve Taylor",
      email: "eve@example.com",
      attachment: "profile-pic-eve.png",
    },
    assingnees: [
      {
        id: "106",
        name: "Frank Castle",
        email: "frank@example.com",
        attachment: "profile-pic-frank.png",
      },
    ],
    sequence: 1, // assigned manually
  },
  {
    id: "4",
    name: "Set up CI/CD pipeline",
    description: "Configure CI/CD for the application.",
    attachment: "ci-cd-pipeline.yaml",
    status: "todo",
    createdAt: new Date("2024-01-10"),
    createdBy: {
      id: "107",
      name: "Grace Hopper",
      email: "grace@example.com",
      attachment: "profile-pic-grace.png",
    },
    assingnees: [
      {
        id: "108",
        name: "Hank Pym",
        email: "hank@example.com",
        attachment: "profile-pic-hank.png",
      },
    ],
    sequence: 2, // assigned manually
  },
  {
    id: "5",
    name: "Write unit tests",
    description: "Add unit tests for the user module.",
    attachment: "unit-tests.md",
    status: "doing",
    createdAt: new Date("2024-01-07"),
    createdBy: {
      id: "109",
      name: "Ivy Wilson",
      email: "ivy@example.com",
      attachment: "profile-pic-ivy.png",
    },
    assingnees: [
      {
        id: "110",
        name: "Jake Blake",
        email: "jake@example.com",
        attachment: "profile-pic-jake.png",
      },
    ],
    sequence: 2, // assigned manually
  },
  {
    id: "6",
    name: "Create API documentation",
    description: "Document all API endpoints.",
    attachment: "api-docs.json",
    status: "finished",
    createdAt: new Date("2024-01-02"),
    createdBy: {
      id: "111",
      name: "Kara Stevens",
      email: "kara@example.com",
      attachment: "profile-pic-kara.png",
    },
    assingnees: [],
    sequence: 2, // assigned manually
  },
  {
    id: "7",
    name: "Optimize database queries",
    description: "Improve the performance of database queries.",
    attachment: "query-optimization.sql",
    status: "doing",
    createdAt: new Date("2024-01-08"),
    createdBy: {
      id: "112",
      name: "Leo Thomas",
      email: "leo@example.com",
      attachment: "profile-pic-leo.png",
    },
    assingnees: [
      {
        id: "113",
        name: "Mia Wallace",
        email: "mia@example.com",
        attachment: "profile-pic-mia.png",
      },
    ],
    sequence: 3, // assigned manually
  },
  {
    id: "8",
    name: "Implement dark mode",
    description: "Add dark mode to the application.",
    attachment: "dark-mode-design.png",
    status: "todo",
    createdAt: new Date("2024-01-14"),
    createdBy: {
      id: "114",
      name: "Nina Rose",
      email: "nina@example.com",
      attachment: "profile-pic-nina.png",
    },
    assingnees: [
      {
        id: "115",
        name: "Oscar Reed",
        email: "oscar@example.com",
        attachment: "profile-pic-oscar.png",
      },
    ],
    sequence: 3, // assigned manually
  },
  {
    id: "9",
    name: "Fix login issues",
    description: "Resolve bugs in the login process.",
    attachment: "bug-report.pdf",
    status: "finished",
    createdAt: new Date("2024-01-01"),
    createdBy: {
      id: "116",
      name: "Paula Adams",
      email: "paula@example.com",
      attachment: "profile-pic-paula.png",
    },
    assingnees: [],
    sequence: 3, // assigned manually
  },
  {
    id: "10",
    name: "Add search functionality",
    description: "Implement a search bar for the dashboard.",
    attachment: "search-feature.spec",
    status: "doing",
    createdAt: new Date("2024-01-09"),
    createdBy: {
      id: "117",
      name: "Quincy Brown",
      email: "quincy@example.com",
      attachment: "profile-pic-quincy.png",
    },
    assingnees: [],
    sequence: 4, // assigned manually
  },
  {
    id: "11",
    name: "Design 404 page",
    description: "Create a custom 404 error page.",
    attachment: "404-design.png",
    status: "todo",
    createdAt: new Date("2024-01-13"),
    createdBy: {
      id: "118",
      name: "Rachel Green",
      email: "rachel@example.com",
      attachment: "profile-pic-rachel.png",
    },
    assingnees: [],
    sequence: 4, // assigned manually
  },
  {
    id: "12",
    name: "Setup project repository",
    description: "Initialize the project repository on GitHub.",
    attachment: "repo-setup.md",
    status: "finished",
    createdAt: new Date("2024-01-01"),
    createdBy: {
      id: "119",
      name: "Steve Rogers",
      email: "steve@example.com",
      attachment: "profile-pic-steve.png",
    },
    assingnees: [],
    sequence: 4, // assigned manually
  },
  {
    id: "13",
    name: "Conduct user testing",
    description: "Gather user feedback on the beta version.",
    attachment: "user-feedback.xlsx",
    status: "todo",
    createdAt: new Date("2024-01-11"),
    createdBy: {
      id: "120",
      name: "Tony Stark",
      email: "tony@example.com",
      attachment: "profile-pic-tony.png",
    },
    assingnees: [],
    sequence: 5, // assigned manually
  },
  {
    id: "14",
    name: "Create onboarding guide",
    description: "Develop an onboarding guide for new users.",
    attachment: "onboarding-guide.pdf",
    status: "doing",
    createdAt: new Date("2024-01-06"),
    createdBy: {
      id: "121",
      name: "Uma Thurman",
      email: "uma@example.com",
      attachment: "profile-pic-uma.png",
    },
    assingnees: [],
    sequence: 5, // assigned manually
  },
  {
    id: "15",
    name: "Deploy application",
    description: "Deploy the application to the production server.",
    attachment: "deployment-steps.txt",
    status: "todo",
    createdAt: new Date("2024-01-16"),
    createdBy: {
      id: "122",
      name: "Victor Hugo",
      email: "victor@example.com",
      attachment: "profile-pic-victor.png",
    },
    assingnees: [],
    sequence: 6, // assigned manually
  },
];

export default tasks;
