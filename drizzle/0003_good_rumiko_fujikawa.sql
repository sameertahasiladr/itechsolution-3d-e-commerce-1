CREATE TABLE `product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`public_id` text NOT NULL,
	`display_order` integer DEFAULT 0,
	`is_primary` integer DEFAULT false,
	`width` integer,
	`height` integer,
	`format` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
