CREATE TABLE `community` (
	`id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(255),
	`banner` varchar(255),
	`profile_picture` varchar(255),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `community_id` PRIMARY KEY(`id`),
	CONSTRAINT `community_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `thread` (
	`id` varchar(255),
	`title` varchar(50) NOT NULL,
	`content` varchar(255) NOT NULL,
	`attachment` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `thread_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
RENAME TABLE `users_table` TO `user`;--> statement-breakpoint
ALTER TABLE `user` DROP INDEX `users_table_email_unique`;--> statement-breakpoint
ALTER TABLE `user` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `community` ADD CONSTRAINT `community_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thread` ADD CONSTRAINT `thread_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thread` ADD CONSTRAINT `thread_id_community_id_fk` FOREIGN KEY (`id`) REFERENCES `community`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `age`;