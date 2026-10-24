QuickNotes API Design

1.  Overview

QuickNotes is a note-taking application. Its REST API allows users to create, read, update, and delete notes and manage tags.

Base URL: `/api/v1`

2.  Endpoints

| Method | Endpoint           | Description                                   | Success Status |
| ------ | ------------------ | --------------------------------------------- | -------------- |
| GET    | `/notes`           | Retrieve all notes for the authenticated user | 200 OK         |
| GET    | `/notes/{id}`      | Retrieve one note by ID                       | 200 OK         |
| POST   | `/notes`           | Create a new note                             | 201 Created    |
| PUT    | `/notes/{id}`      | Replace an existing note                      | 200 OK         |
| DELETE | `/notes/{id}`      | Delete a note                                 | 204 No Content |
| GET    | `/tags`            | Retrieve the user's tags                      | 200 OK         |
| POST   | `/notes/{id}/tags` | Add a tag to a note                           | 200 OK         |

3.  Example Requests and Responses

Create a note

Request: POST /api/v1/notes

{
"title": "Study plan",
"body": "Review calculus and statistics",
"tagIds": [1, 2]
}

Response: 201 Created

{
"id": 101,
"title": "Study plan",
"body": "Review calculus and statistics",
"createdAt": "2026-10-24T09:00:00Z",
"updatedAt": "2026-10-24T09:00:00Z"
}

List notes

Request: GET /api/v1/notes?limit=10&page=1

Response: 200 OK

{
"notes": [
{
"id": 101,
"title": "Study plan",
"body": "Review calculus and statistics"
}
],
"page": 1,
"limit": 10,
"total": 1
}

4.  Error Handling

Errors use a consistent JSON response format.

{
"error": {
"code": "VALIDATION_ERROR",
"message": "The title is required."
}
}

| Status                    | Meaning                                    | Example                             |
| ------------------------- | ------------------------------------------ | ----------------------------------- |
| 400 Bad Request           | Invalid input or missing required fields   | Title is empty                      |
| 401 Unauthorized          | Authentication is missing or invalid       | No valid access token               |
| 403 Forbidden             | User lacks permission to access a resource | Attempt to edit another user's note |
| 404 Not Found             | Requested resource does not exist          | Note ID 999 does not exist          |
| 500 Internal Server Error | Unexpected server-side failure             | Database operation fails            |

5.  Validation and Security

- Note titles are required and limited to 100 characters.
- Users can access only resources they are authorized to use.
- The API validates request bodies before saving data.
- Authentication is required for private note operations.
- Errors must not expose passwords, access tokens, or internal server details.

6.  Pagination

The notes endpoint supports `limit` and `page` query parameters. Pagination prevents the server from returning every note in one response and helps maintain performance as the number of notes grows.

7.  Practice API Note

The current browser prototype uses JSONPlaceholder at `https://jsonplaceholder.typicode.com/posts` to practise GET, POST, and DELETE requests. The endpoints documented above describe the proposed QuickNotes API, not an already deployed backend.
