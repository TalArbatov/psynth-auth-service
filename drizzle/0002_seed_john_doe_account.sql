INSERT INTO "accounts" (
	"id",
	"username",
	"email",
	"active_flag",
	"created_at",
	"updated_at"
) VALUES (
	'account-2',
	'John Doe',
	'shephurai@gmail',
	true,
	now(),
	now()
)
ON CONFLICT ("email") DO UPDATE
SET
	"username" = EXCLUDED."username",
	"active_flag" = EXCLUDED."active_flag",
	"updated_at" = now();
