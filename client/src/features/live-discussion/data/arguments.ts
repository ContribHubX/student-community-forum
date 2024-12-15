import { Argument, ArgumentTag, User } from "@/types";

export const initialUsers: User[] = [
    {
      id: '1',
      name: 'StudyGuru',
      email: 'studyguru@example.com',
      attachment: '/placeholder.svg?height=32&width=32',
      provider: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'CSNewbie',
      email: 'csnewbie@example.com',
      attachment: '/placeholder.svg?height=32&width=32',
      provider: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'CurrentUser',
      email: 'currentuser@example.com',
      attachment: '/placeholder.svg?height=32&width=32',
      provider: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
export const initialArguments: Argument[] = [
    {
      id: 'test1',
      content: 'Does anyone have tips for managing time effectively during exams?',
      createdBy: initialUsers[0],
      likeCount: 5,
      dislikeCount: 2,
      position: { x: 100, y: 100 },
      tags: [
        { id: 't1', name: 'Study Tips', argumentId: '1', createdAt: new Date(), updatedAt: new Date() },
        { id: 't2', name: 'Exams', argumentId: '1', createdAt: new Date(), updatedAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 300000),
      updatedAt: new Date(Date.now() - 300000),
      communityId: "123"
    },
    {
      id: 'test2',
      content: "I'm looking for study partners for the upcoming Computer Science midterm. Anyone interested?",
      createdBy: initialUsers[1],
      likeCount: 3,
      dislikeCount: 0,
      position: { x: 400, y: 200 },
      tags: [
        { id: 't3', name: 'Computer Science', argumentId: '2', createdAt: new Date(), updatedAt: new Date() },
        { id: 't4', name: 'Study Group', argumentId: '2', createdAt: new Date(), updatedAt: new Date() }
      ],
      createdAt: new Date(Date.now() - 240000),
      updatedAt: new Date(Date.now() - 240000),
       communityId: "123"
    }
  ];
  
export const popularTags: ArgumentTag[] = [
    { id: 't1', name: 'Study Tips', argumentId: '', createdAt: new Date(), updatedAt: new Date() },
    { id: 't2', name: 'Exams', argumentId: '', createdAt: new Date(), updatedAt: new Date() },
    { id: 't3', name: 'Computer Science', argumentId: '', createdAt: new Date(), updatedAt: new Date() },
    { id: 't4', name: 'Study Group', argumentId: '', createdAt: new Date(), updatedAt: new Date() },
    { id: 't5', name: 'Projects', argumentId: '', createdAt: new Date(), updatedAt: new Date() },
    { id: 't6', name: 'Internships', argumentId: '', createdAt: new Date(), updatedAt: new Date() }
];
  