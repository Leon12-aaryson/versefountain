ALTER TABLE "user_poems" DROP CONSTRAINT "user_poems_user_id_poem_id_pk";--> statement-breakpoint
ALTER TABLE "user_poems" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_poems_user_id_poem_id_index" ON "user_poems" USING btree ("user_id","poem_id");