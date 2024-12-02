import { database as db } from "..";
import { StudyRoomTable } from "../schema";
import { v4 as uuidV4 } from "uuid";

(async () => {
    try {
        console.log("Starting database seeding...");

        const createdBy = "112999052731055780618";

        const attachments = [
            "https://img.freepik.com/free-vector/gradient-lo-fi-illustrations_52683-84144.jpg",
            "https://tinyurl.com/44hpk3wb",
            "https://i.scdn.co/image/ab67616d0000b273f20d7540e71d73e025cade8e",
            "https://thumbs.dreamstime.com/b/cozy-colorful-lofi-study-desk-set-empty-interior-messy-jungle-anime-manga-style-d-cor-327529058.jpg",
            "https://images5.alphacoders.com/134/1344548.png",
        ];

        await db.insert(StudyRoomTable).values([
            {
                id: uuidV4(),
                name: "Town of Bears 🐻 ⚔️ 🎯 🦊",
                description: "Join our focused study session and boost your productivity!",
                attachment: attachments[0],
                createdBy,
            },
            {
                id: uuidV4(),
                name: "Galaxy of Scholars 🌌 ✨ 📚 🚀",
                description: "Explore the universe of knowledge with our scholarly group.",
                attachment: attachments[1],
                createdBy,
            },
            {
                id: uuidV4(),
                name: "Mystic Library 📖 🔮 🌠 🦉",
                description: "Dive into ancient texts and modern topics in our library.",
                attachment: attachments[2],
                createdBy,
            },
            {
                id: uuidV4(),
                name: "Lofi Lounge 🎶 ☕ 🎨 🌿",
                description: "Relax and study in a calm, lofi-inspired lounge.",
                attachment: attachments[3],
                createdBy,
            },
            {
                id: uuidV4(),
                name: "Zen Zone 🕉️ 🌸 🍵 🎋",
                description: "Achieve mindfulness and productivity in the Zen Zone.",
                attachment: attachments[4],
                createdBy,
            },
        ]);

        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Error while seeding the database:", error);
    } finally {
        process.exit();
    }
})();
