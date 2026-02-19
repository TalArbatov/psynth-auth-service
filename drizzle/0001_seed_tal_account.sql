INSERT INTO "accounts" (
	"id",
	"username",
	"email",
	"password_hash",
	"active_flag",
	"created_at",
	"updated_at"
) VALUES (
	'account-1',
	'Tal Arbetov',
	'talarbatov98@gmail.com',
	'$2b$10$Z2E0M97/ABwuX78tvnGB5.Na.XX4pWoxsWum.NSLJwcHckuddChAC',
	true,
	now(),
	now()
)
ON CONFLICT ("email") DO UPDATE
SET
	"username" = EXCLUDED."username",
	"password_hash" = EXCLUDED."password_hash",
	"active_flag" = EXCLUDED."active_flag",
	"updated_at" = now();
