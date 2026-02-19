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
	"account_id" varchar(16) NOT NULL,
	"ip" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
)
--> statement-breakpoint
ALTER TABLE "login_sessions" ADD CONSTRAINT "login_sessions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_login_sessions_account_id" ON "login_sessions" USING btree ("account_id");