# Effort API

POST /effort

Request JSON:

- `student_name` (string, optional)
- `subject` (string, optional)
- `question` (string)
- `answer` (string)

Response JSON:

- `score` (number) — 0-100 effort score
- `level` (string) — one of `LOW`, `MEDIUM`, `HIGH`

Behavior:
- The server will attempt to use the configured Groq model (if `GROQ_API_KEY` is set) to evaluate effort; otherwise it uses a simple heuristic.
- The attempt is persisted to the local SQLite DB `student_data.db` in the `attempts` table.
