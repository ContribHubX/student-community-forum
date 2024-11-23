CREATE TABLE `user_communities` (
	`user_id` varchar(255) NOT NULL,
	`community_id` varchar(255) NOT NULL,
	`joined_at` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	`thread_id` varchar(255) NOT NULL,
	`parent_id` varchar(255),
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` varchar(255) NOT NULL,
	`message` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`entity_id` varchar(255) NOT NULL,
	`entity_type` enum('thread','task') NOT NULL,
	`type` enum('like','dislike','comment','reply') NOT NULL,
	`link` varchar(255) NOT NULL,
	`is_read` boolean,
	`created_by` varchar(255) NOT NULL,
	`receive_by` varchar(255) NOT NULL,
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_followers` (
	`follower_id` varchar(255) NOT NULL,
	`topic_id` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` varchar(255) NOT NULL,
	`name` varchar(50) NOT NULL,
	`attachment` text,
	`created_at` timestamp DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_request` (
	`id` varchar(255) NOT NULL,
	`question_id` varchar(255) NOT NULL,
	`requested_by` varchar(255) NOT NULL,
	`requested_to` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `question_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` varchar(255) NOT NULL,
	`title` varchar(100) NOT NULL,
	`content` text,
	`created_at` timestamp DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	`topic_id` varchar(255),
	CONSTRAINT `question_id` PRIMARY KEY(`id`),
	CONSTRAINT `question_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
ALTER TABLE `community` RENAME COLUMN `profile_picture` TO `icon`;--> statement-breakpoint
ALTER TABLE `user` DROP INDEX `user_email_unique`;--> statement-breakpoint
ALTER TABLE `user` ADD `password` text;--> statement-breakpoint
ALTER TABLE `user` ADD `provider` enum('GOOGLE','GITHUB','LOCAL') DEFAULT 'LOCAL' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `updatedAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `thread` ADD `topic_id` varchar(255);--> statement-breakpoint
ALTER TABLE `thread` ADD `question_id` varchar(255);--> statement-breakpoint
ALTER TABLE `user_communities` ADD CONSTRAINT `user_communities_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_communities` ADD CONSTRAINT `user_communities_community_id_community_id_fk` FOREIGN KEY (`community_id`) REFERENCES `community`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_thread_id_thread_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `thread`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_parent_id_comment_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `comment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_receive_by_user_id_fk` FOREIGN KEY (`receive_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topic_followers` ADD CONSTRAINT `topic_followers_follower_id_user_id_fk` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topic_followers` ADD CONSTRAINT `topic_followers_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topics` ADD CONSTRAINT `topics_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_request` ADD CONSTRAINT `question_request_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_request` ADD CONSTRAINT `question_request_requested_by_user_id_fk` FOREIGN KEY (`requested_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question_request` ADD CONSTRAINT `question_request_requested_to_user_id_fk` FOREIGN KEY (`requested_to`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `question` ADD CONSTRAINT `question_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thread` ADD CONSTRAINT `thread_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thread` ADD CONSTRAINT `thread_question_id_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE no action ON UPDATE no action;