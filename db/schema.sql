-- db/schema.sql
-- A tiny schema for the debugging lab.

DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, body) VALUES
('Hello, world', 'Your first post in the debug lab.'),
('Errors happen', 'This post exists so the UI has something to render.'),
('Logging ≠ handling', 'Logs help developers; handling helps users.');
