import { database as db } from "..";
import { TopicTable } from "../schema";

(async () => {
    try {
        console.log("Starting database seeding...");

        await db.insert(TopicTable).values([
            {
                name: "Web Development",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024502/9602bc4b-cfc4-410e-b291-611d478c9d6a_yymstn.png",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Artificial Intelligence",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024668/artificial-intelligence-new-technology-science-futuristic-abstract-human-brain-ai-technology-cpu-central-processor-unit-chipset-big-data-machine-learning-cyber-mind-domination-generative-ai-scaled-1-1500x1000_ujm28b.jpg",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Machine Learning",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1731891204/topics/custom_id_1731891202343.jpg",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Blockchain",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024711/blockchain-uses-cryptocurrency_j9pabt.jpg",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Cloud Computing",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024751/1708394467259_mlbv8p.png",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Cybersecurity",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024931/cybersecurity-coverage-2_yxyv4p.jpg",
                createdBy: "112999052731055780618",
            },
            {
                                name: "Data Science",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024968/datascience-pdusit-stock_uq3bat.jpg",
                createdBy: "112999052731055780618",
            },
            {
                                name: "DevOps",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732024995/1_EBXc9eJ1YRFLtkNI_djaAw_jskq7l.png",
                createdBy: "112999052731055780618",
            },
            {
                                name: "UI/UX Design",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732025021/c00bce58c817ec3a16945711111641d37320ae67-2240x1260_v6g98c.png",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "Mobile Development",
                attachment: "https://picsum.photos/300/200?random=10",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "Quantum Computing",
                attachment: "https://picsum.photos/300/200?random=11",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "Game Development",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732025035/the_complete_guide_to_mobile_app_development_2021_ded2abd1b1_wjiwin.png",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "AR/VR",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732025082/filters_quality_75_gulapu.jpg",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "Internet of Things",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732025091/what-is-the-internet-of-things-iot_bqk2t4.png",
                createdBy: "112999052731055780618",
            },
            {
                
                name: "Big Data",
                attachment: "https://res.cloudinary.com/dt0wmf7iy/image/upload/v1732025125/1692816749106_xhohpw.png",
                createdBy: "112999052731055780618",
            },
        ]);

        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Error while seeding the database:", error);
    } finally {
        process.exit();
    }
})();