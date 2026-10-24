QuickNotes

QuickNotes is a simple note-taking web application prototype built with HTML, CSS, and JavaScript. It uses the JSONPlaceholder practice API to demonstrate loading, creating, and deleting notes.

Features

- Load up to 10 notes from the practice API.
- Create notes with a required title and an optional body.
- Delete notes from the displayed list.
- Show loading, success, error, and empty states.
- Validate note titles and disable buttons while requests are running.
- Display user-provided text safely using `textContent`.

How to Run

1. Clone or download this repository.
2. Open the root `index.html` file in a browser, or use the VS Code Live Server extension.
3. Select Load notes to retrieve practice posts.
4. Enter a title and optional body, then select Create note.
5. Select Delete note to remove a note from the displayed list.

An internet connection is required to access JSONPlaceholder.

Note: JSONPlaceholder simulates POST and DELETE requests. Changes are not permanently stored on its server. This is an unofficial learning prototype, not a production note-taking service.

Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

What I Learned

- How to use the Fetch API and `async`/`await` to make HTTP requests.
- How to handle HTTP errors, loading states, and request failures.
- How REST API endpoints use GET, POST, PUT, and DELETE.
- How primary keys, foreign keys, and JOIN queries organize relational data.
- How caching, load balancing, read replicas, and background queues support scalability.
- Why user-provided content should be rendered safely using `textContent`.
