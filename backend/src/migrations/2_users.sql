CREATE TABLE New_SnakeScores (
    name TEXT NOT NULL,
    score INTEGER NOT NULL
);

INSERT INTO New_SnakeScores SELECT * FROM SnakeScores;
DROP TABLE SnakeScores;
ALTER TABLE New_SnakeScores RENAME TO SnakeScores;
