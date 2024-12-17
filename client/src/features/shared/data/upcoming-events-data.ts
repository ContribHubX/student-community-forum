// import csps from "@/assets/sidebar/csps-logo.png";
// import uc from "@/assets/sidebar/groups/uc.svg";


const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


export default [
  {
    id: generateId(),
    name: "Intramurals 2024",
    eventDate: new Date(2024, 1, 7), // Note: Months are 0-indexed in JS Date
    communityId: generateId(),
    tags: [
      { id: generateId(), name: "university", communityEventId: generateId() },
      { id: generateId(), name: "intrams", communityEventId: generateId() },
      { id: generateId(), name: "cebu", communityEventId: generateId() },
    ],
  },
  {
    id: generateId(),
    name: "Acquaintance 2024",
    eventDate: new Date(2024, 1, 3),
    communityId: generateId(),
    tags: [
      { id: generateId(), name: "university", communityEventId: generateId() },
      { id: generateId(), name: "acquaintance", communityEventId: generateId() },
      { id: generateId(), name: "seaside", communityEventId: generateId() },
    ],
  },
  {
    id: generateId(),
    name: "Halloween 2024",
    eventDate: new Date(2024, 1, 5),
    communityId: generateId(),
    tags: [
      { id: generateId(), name: "university", communityEventId: generateId() },
      { id: generateId(), name: "halloween", communityEventId: generateId() },
      { id: generateId(), name: "seaside", communityEventId: generateId() },
    ],
  },
];