CREATE TABLE IF NOT EXISTS basic_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS searches (
    search TEXT NOT NULL,
    time_stamp DATETIME
);

CREATE TABLE IF NOT EXISTS orgs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL, 
    desc_ TEXT NOT NULL,
    phone TEXT NOT NULL, /*interpret as an int, and remove the "-" and "()"*/
    email TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS orgs_loc (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL, /*this just means the state (in the US)*/
    zip INT NOT NULL,
    address TEXT NOT NULL

/* there's a weird CREATE TABLE sqlite_sequence(name,seq); when you create it idk why lol