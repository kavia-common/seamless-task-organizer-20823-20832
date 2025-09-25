# seamless-task-organizer-20823-20832

Backend (to_do_backend)
- Express API with Swagger docs at /docs
- Endpoints:
  - GET /api/tasks
  - GET /api/tasks/{id}
  - POST /api/tasks
  - PUT /api/tasks/{id}
  - DELETE /api/tasks/{id}
  - POST /api/tasks/{id}/complete
  - POST /api/tasks/{id}/uncomplete

Environment variables
- See to_do_backend/.env.example for required DB variables (MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT).