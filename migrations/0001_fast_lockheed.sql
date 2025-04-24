CREATE TABLE "poem_comment_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"reaction" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD',
	"status" text NOT NULL,
	"paddle_payment_id" text,
	"paddle_transaction_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"refund_reason" text
);
--> statement-breakpoint
CREATE TABLE "poem_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"poem_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "poet_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"poet_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_chat_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "approved" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "poems" ALTER COLUMN "approved" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_by_id" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" text DEFAULT 'general';--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "payment_id" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "is_refunded" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "poem_comment_reactions" ADD CONSTRAINT "poem_comment_reactions_comment_id_poem_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."poem_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poem_comment_reactions" ADD CONSTRAINT "poem_comment_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poem_comments" ADD CONSTRAINT "poem_comments_poem_id_poems_id_fk" FOREIGN KEY ("poem_id") REFERENCES "public"."poems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poem_comments" ADD CONSTRAINT "poem_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poet_followers" ADD CONSTRAINT "poet_followers_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poet_followers" ADD CONSTRAINT "poet_followers_poet_id_users_id_fk" FOREIGN KEY ("poet_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_chat_rooms" ADD CONSTRAINT "user_chat_rooms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_chat_rooms" ADD CONSTRAINT "user_chat_rooms_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "poet_followers_follower_id_poet_id_index" ON "poet_followers" USING btree ("follower_id","poet_id");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;