const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const charCount = document.getElementById("char-count");
const warningMessage = document.getElementById("warning-message");
const clearButton = document.getElementById("clear-btn");
const themeButton = document.getElementById("theme-btn");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function updateCounts() {
  const characters = noteInput.value.length;

  charCount.textContent = `Characters: ${characters}`;

  if (characters > 200) {
    warningMessage.textContent = "Your note is too long!";
    warningMessage.classList.add("warning");
  } else {
    warningMessage.textContent = "";
    warningMessage.classList.remove("warning");
  }

  noteCount.textContent = `You have ${notes.length} ${
    notes.length === 1 ? "note" : "notes"
  }.`;
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "note";

    const span = document.createElement("span");
    span.textContent = note.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes();
      renderNotes();
      updateCounts();
    });

    li.appendChild(span);
    li.appendChild(deleteButton);
    notesList.appendChild(li);
  });

  updateCounts();
}

noteInput.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("quicknotes-draft", noteInput.value);
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (text.length < 1 || text.length > 200) return;

  notes.push({
    id: Date.now(),
    text: text,
  });

  saveNotes();
  noteInput.value = "";
  localStorage.removeItem("quicknotes-draft");
  renderNotes();
});

clearButton.addEventListener("click", () => {
  noteInput.value = "";
  notes = [];
  saveNotes();
  localStorage.removeItem("quicknotes-draft");
  renderNotes();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    noteInput.value = "";
    notes = [];
    saveNotes();
    localStorage.removeItem("quicknotes-draft");
    renderNotes();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  localStorage.setItem(
    "quicknotes-theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});

if (localStorage.getItem("quicknotes-theme") === "dark") {
  document.body.classList.add("dark-theme");
}

noteInput.value = localStorage.getItem("quicknotes-draft") || "";

renderNotes();