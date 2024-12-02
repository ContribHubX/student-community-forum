
--> statement-breakpoint
CREATE TABLE `study_room` (
	`id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`is_done` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `study_room_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_room_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `study_room` ADD CONSTRAINT `study_room_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;