
PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade REAL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id),
    CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100))
);

-- Sample data: 3 students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Amina Yusuf', 'amina@example.com'),
(2, 'Noah Smith', 'noah@example.com'),
(3, 'Sofia Demir', 'sofia@example.com');

-- Sample data: 3 courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Mathematics'),
(2, 'Database Systems'),
(3, 'Web Development');

-- Sample data: 5 enrolments
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 85),
(2, 1, 2, 90),
(3, 2, 1, 78),
(4, 2, 3, 88),
(5, 1, 3, 92);

-- QUERY 1: All courses for one student, by name
SELECT s.name, c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Amina Yusuf';

-- QUERY 2: All students enrolled on one course
SELECT s.name, c.course_name
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE c.course_name = 'Mathematics';

-- QUERY 3: Number of students per course, including courses with zero
SELECT c.course_name, COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- QUERY 4: Students who have no enrolments
SELECT s.student_id, s.name
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 95
WHERE student_id = 1 AND course_id = 2;

SELECT s.name, c.course_name, e.grade
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.student_id = 1 AND c.course_id = 2;