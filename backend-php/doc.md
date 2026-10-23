# Dokumentation

Projektet skapat med Claude 2026-10.

https://claude.ai/chat/224ad7e9-d3de-4657-b1b0-8917d0681bb6

```sql
-- MySQL-tabeller

CREATE TABLE klasspuls_sessions (
    sid VARCHAR(16) PRIMARY KEY,
    teacher_id VARCHAR(64) NOT NULL UNIQUE,
    question_active TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE klasspuls_answers (
    sid VARCHAR(16) NOT NULL,
    uid VARCHAR(64) NOT NULL,
    value INT NOT NULL,
    PRIMARY KEY (sid, uid),
    FOREIGN KEY (sid) REFERENCES klasspuls_sessions(sid) ON DELETE CASCADE
);
```

