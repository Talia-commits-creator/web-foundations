Library Books REST API

1. List All Books

- Method: GET
- Path: /books
- Description: Retrieves a list of all books in the library.
- Success Status Code: 200 OK

2. Get One Book

- Method: GET
- Path: /books/42
- Description: Retrieves the book with ID 42.
- Success Status Code: 200 OK

3. Create a Book

- Method: POST
- Path: /books
- Description: Adds a new book to the library.
- Example Request Body:

{
"title": "Introduction to Algorithms",
"author": "Thomas H. Cormen",
"year": 2009
}

- Success Status Code: 201 Created

4.  Update a Book

- Method: PUT
- Path: /books/42
- Description: Replaces the details of the book with ID 42.
- Example Request Body:

{
"title": "Introduction to Algorithms",
"author": "Thomas H. Cormen",
"year": 2022
}

- Success Status Code: 200 OK

5. Delete a Book

- Method: DELETE
- Path: /books/42
- Description: Deletes the book with ID 42.
- Success Status Code: 204 No Content

6. List Books by Author

- Method: GET
- Path: /books?author=Thomas%20H.%20Cormen
- Description: Retrieves books written by Thomas H. Cormen using a query parameter.
- Success Status Code: 200 OK

7.  Error Codes

400 Bad Request

- Description: The request contains invalid data.
- Example: A client attempts to create a book without a required title.

404 Not Found

- Description: The requested resource does not exist.
- Example: A client requests `/books/999` when no book with ID 999 exists.
