let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

console.log(searchNotes("JavaScript")); // Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("xyz")); // Expected: []

function longestNote() {
  if (notes.length === 0) return null;

  let longest = notes[0];

  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

console.log(longestNote()); // Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

notes = [];
console.log(longestNote()); // Expected: null

notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }

notes = [];
console.log(countByCategory()); // Expected: {}

notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [];
console.log(getSummary()); // Expected: "0 notes: 0 personal, 0 work, 0 study."

notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function isDuplicate(text) {
  return notes.some(
    (note) => note.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
}

console.log(isDuplicate("Call mum")); // Expected: true
console.log(isDuplicate("  call mum  ")); // Expected: true

function addNote(text, category) {
  const cleaned = text.trim();

  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("Note rejected: must be 1-200 characters.");
    return false;
  }

  if (isDuplicate(cleaned)) {
    console.log("Note rejected: duplicate note.");
    return false;
  }

  if (category !== "personal" && category !== "work" && category !== "study") {
    console.log("Note rejected: invalid category.");
    return false;
  }

  notes.push({
    id: Date.now(),
    text: cleaned,
    category: category,
  });

  return true;
}

console.log(addNote("Finish the project", "work")); // Expected: true
console.log(addNote("Call mum", "personal")); // Expected: false