CREATE TABLE "accounts" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"username" varchar(128),
	"email" varchar(254),
	"password_hash" varchar(128),
	"active_flag" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "login_sessions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(16) NOT NULL,
	"ip" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "presets" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"account_id" varchar(16) NOT NULL,
	"ip" varchar(45),
	"data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "login_sessions" ADD CONSTRAINT "login_sessions_user_id_accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presets" ADD CONSTRAINT "presets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_login_sessions_user_id" ON "login_sessions" USING btree ("user_id");