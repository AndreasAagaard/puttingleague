CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE IF NOT EXISTS "players" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"round_id"	INTEGER NOT NULL,
	"dateCreated"	TEXT NOT NULL DEFAULT 'datetime()',
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("round_id") REFERENCES "rounds"("id")
);
CREATE TABLE IF NOT EXISTS "scores" (
	"id"	INTEGER NOT NULL UNIQUE,
	"station_number"	INTEGER NOT NULL,
	"score"	INTEGER NOT NULL DEFAULT 0,
	"player_id"	INTEGER NOT NULL,
	"attempt"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("player_id") REFERENCES ""
);
CREATE TABLE IF NOT EXISTS "rounds" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"active"	TEXT NOT NULL DEFAULT 'Active' CHECK("active" IN ("Active", "Inactive")),
	"stations"	INT NOT NULL,
	"stations_rounds"	INT NOT NULL,
	"stations_putts"	INT NOT NULL,
	"dateCreated"	TEXT NOT NULL DEFAULT 'datetime()',
	PRIMARY KEY("id" AUTOINCREMENT)
);
