QuickNotes Data Model

1.  Overview

QuickNotes uses a relational database to store users, notes, tags, and the relationships between notes and tags. Primary keys uniquely identify records, while foreign keys maintain relationships between tables.

2.  Tables and Columns

Users

| Column     | Type         | Constraint       |
| ---------- | ------------ | ---------------- |
| id         | INTEGER      | Primary key      |
| name       | VARCHAR(100) | NOT NULL         |
| email      | VARCHAR(255) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP    | NOT NULL         |

Notes

| Column     | Type         | Constraint                        |
| ---------- | ------------ | --------------------------------- |
| id         | INTEGER      | Primary key                       |
| user_id    | INTEGER      | NOT NULL, foreign key to users.id |
| title      | VARCHAR(100) | NOT NULL                          |
| body       | TEXT         | NOT NULL                          |
| created_at | TIMESTAMP    | NOT NULL                          |
| updated_at | TIMESTAMP    | NOT NULL                          |

Tags

| Column  | Type        | Constraint                        |
| ------- | ----------- | --------------------------------- |
| id      | INTEGER     | Primary key                       |
| user_id | INTEGER     | NOT NULL, foreign key to users.id |
| name    | VARCHAR(50) | NOT NULL                          |

Note_Tags

| Column  | Type    | Constraint                                     |
| ------- | ------- | ---------------------------------------------- |
| note_id | INTEGER | Primary key component, foreign key to notes.id |
| tag_id  | INTEGER | Primary key component, foreign key to tags.id  |

The composite primary key `(note_id, tag_id)` prevents the same tag from being assigned to the same note more than once.

3.  Relationships

- Users to Notes: One-to-many. One user can create many notes, but each note belongs to one user.
- Users to Tags: One-to-many. One user can create many tags, but each tag belongs to one user.
- Notes to Tags: Many-to-many. A note can have multiple tags, and a tag can be used on multiple notes. The `note_tags` junction table implements this relationship.

4.  SQL Table Creation

CREATE TABLE users (
id INTEGER PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
id INTEGER PRIMARY KEY,
user_id INTEGER NOT NULL,
title VARCHAR(100) NOT NULL,
body TEXT NOT NULL DEFAULT '',
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
id INTEGER PRIMARY KEY,
user_id INTEGER NOT NULL,
name VARCHAR(50) NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id),
UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
note_id INTEGER NOT NULL,
tag_id INTEGER NOT NULL,
PRIMARY KEY (note_id, tag_id),
FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

5.  Example SQL Queries

Query 1: Get all notes belonging to a user

SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;

Query 2: Find a note and its tags using JOIN

SELECT notes.title, tags.name AS tag_name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON tags.id = note_tags.tag_id
WHERE notes.id = 1;

Query 3: Count notes for each user

SELECT users.name, COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;

6.  Index

CREATE INDEX idx_notes_user_updated
ON notes(user_id, updated_at);

This index helps queries that filter notes by user and sort them by their most recent update, which is a common operation in QuickNotes.

7. SQL vs NoSQL

A relational SQL database is a good fit for QuickNotes because users, notes, and tags have clear relationships and need data consistency. Foreign keys and transactions help protect data integrity. A NoSQL database can be useful for flexible or rapidly changing data models and certain high-scale access patterns, but relationships and constraints may require more application-level work. For this application, SQL is a straightforward starting choice.
