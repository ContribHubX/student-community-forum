CREATE TABLE `thread_reaction` (
	`id` varchar(255) NOT NULL,
	`type` enum('LIKE','DISLIKE') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`user_id` varchar(255) NOT NULL,
	`thread_id` varchar(255) NOT NULL,
	CONSTRAINT `thread_reaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `thread_reaction` ADD CONSTRAINT `thread_reaction_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thread_reaction` ADD CONSTRAINT `thread_reaction_thread_id_thread_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `thread`(`id`) ON DELETE no action ON UPDATE no action;