import { database as db } from "..";
import { CommunityTable } from "../schema";

const createdBy = "112999052731055780618";

(async () => {
    try {
        console.log("Starting database seeding...");

        await db.insert(CommunityTable).values([
            // {
            //     name: "Science Explorers",
            //     description: "A place for science students to share experiments, ideas, and discoveries.",
            //     banner: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            //     icon: "https://cdn-icons-png.flaticon.com/512/702/702867.png",
            //     createdBy: createdBy,
            // },
            // {
            //     name: "Literature Lovers",
            //     description: "Discuss your favorite books, authors, and literary theories.",
            //     banner: "https://images.pexels.com/photos/261806/pexels-photo-261806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            //     icon: "https://mycvcreator.com/administrator/postimages/65cbdbdba764a2.33205600.jpeg",
            //     createdBy: createdBy,
            // },
            // {
            //     name: "Coding Club",
            //     description: "Join the club to learn programming, share projects, and collaborate with others.",
            //     banner: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmUy-5_SPaLjnaXdCjUXJPGmSqDfjNlkVthAgUUXC1BmAnX9ftgdeF4StqGNtWBg-jMBbTXW2VirQhkJECTHPD5zsNxppflZJQYSEAc4cxsS_IS0gXvgs9jxMqiFW7RyVnVswBWKoLetHWpLqhiM757lCRb3thlUikY4xK1WYxxfFXeoC3Nmc4OTPuhQ/s1600/dev-wallpaper-for-pc.jpg",
            //     icon: "https://plus.unsplash.com/premium_photo-1720287601300-cf423c3d6760?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dnMlMjBjb2RlfGVufDB8fDB8fHww",
            //     createdBy: createdBy,
            // },
            // {
            //     name: "Art and Design",
            //     description: "A creative space for students passionate about art, design, and creativity.",
            //     banner: "https://i.pinimg.com/originals/9b/e8/20/9be8200b689aec0777ad54b7dfd2bd7a.jpg",
            //     icon: "https://i.pinimg.com/736x/08/15/90/081590538b4a0812bf13711370d327b1.jpg",
            //     createdBy: createdBy,
            // },
            // {
            //     name: "Music and Band",
            //     description: "Connect with other students who share a passion for music and performing arts.",
            //     banner: "https://images4.alphacoders.com/979/979304.jpg",
            //     icon: "https://c4.wallpaperflare.com/wallpaper/307/863/729/music-1920x1080-music-notes-music-notes-wallpaper-thumb.jpg",
            //     createdBy: createdBy,
            // },
            // {
            //     name: "History Buffs",
            //     description: "Dive into discussions about history, ancient cultures, and significant events.",
            //     banner: "https://4kwallpapers.com/images/wallpapers/ancient-3840x2160-15299.jpg",
            //     icon: "https://w0.peakpx.com/wallpaper/410/3/HD-wallpaper-wolf-pharaoh-art-ancient-egypt-u-16-9-background-egypt-8k.jpg",
            //     createdBy: createdBy,
            // },
            {
                name: "Fitness Enthusiasts",
                description: "A community for fitness lovers to share workout tips, nutrition plans, and fitness challenges.",
                banner: "https://images.pexels.com/photos/3763871/pexels-photo-3763871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                icon: "https://cdn-icons-png.flaticon.com/512/3459/3459548.png",
                createdBy: createdBy,
            },
        ]);

        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Error while seeding the database:", error);
    } finally {
        process.exit();
    }
})();
