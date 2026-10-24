
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

let notes = [];
let activeRequests = 0;

// Reusable function for sending API requests.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Show status messages accessibly.
function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

// Disable buttons while a request is running.
function setRequestState(isLoading) {
  activeRequests += isLoading ? 1 : -1;

  document.querySelectorAll("button").forEach((button) => {
    button.disabled = activeRequests > 0;
  });
}

// Display notes using textContent to prevent HTML injection.
function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No notes yet. Load or create a note to get started.";
    notesList.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete note";
    deleteButton.disabled = activeRequests > 0;
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    item.append(title, body, deleteButton);
    notesList.appendChild(item);
  });
}

// GET: Load the latest 10 practice posts.
async function loadNotes() {
  setRequestState(true);
  showStatus("Loading notes...");

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notes = data;
    renderNotes();

    showStatus(`Loaded ${notes.length} notes successfully.`, "success");
  } catch (error) {
    showStatus(`Could not load notes: ${error.message}`, "error");
  } finally {
    setRequestState(false);
  }
}

// POST: Create a new note.
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a note title.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    titleInput.focus();
    return;
  }

  setRequestState(true);
  showStatus("Creating note...");

  try {
    const newNote = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    notes.unshift(newNote);
    renderNotes();
    noteForm.reset();

    showStatus("Note created successfully.", "success");
  } catch (error) {
    showStatus(`Could not create note: ${error.message}`, "error");
  } finally {
    setRequestState(false);
    renderNotes();
  }
}

// DELETE: Remove a note.
async function deleteNote(id) {
  setRequestState(true);
  showStatus("Deleting note...");

  try {
    await request(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    notes = notes.filter((note) => note.id !== id);
    renderNotes();

    showStatus("Note deleted successfully.", "success");
  } catch (error) {
    showStatus(`Could not delete note: ${error.message}`, "error");
  } finally {
    setRequestState(false);
    renderNotes();
  }
}

// Connect the buttons and form to their functions.
loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

// Display the initial empty state.
renderNotes();
