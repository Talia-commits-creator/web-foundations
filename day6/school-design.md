School Database Design

Tables

- Students: Stores each student's ID, name and email. The student ID is the primary key, and the email must be unique.
- Courses: Stores each course's ID and name. The course ID is the primary key.
- Enrolments: Records which student takes which course and the student's grade. It has its own primary key and foreign keys referencing the students and courses tables. A student cannot enrol in the same course twice.

Relationships

The relationship between students and enrolments is one-to-many because one student can have multiple enrolments, while each enrolment belongs to one student. Similarly, the relationship between courses and enrolments is one-to-many because one course can have multiple enrolments, while each enrolment refers to one course.

Students and courses have a many-to-many relationship: a student can take multiple courses, and a course can have multiple students. The enrolments table acts as a join table that resolves this relationship. It also stores the grade associated with each student's enrolment.

Index

I would add an index on `enrolments.course_id` to speed up searches for students enrolled in a particular course and help queries that join enrolments to courses. The index uses additional storage and may slightly slow down writes.

sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

SQL or NoSQL?

I would choose a relational SQL database such as SQLite for this school system. The data has clear relationships between students, courses and enrolments, and SQL supports primary keys, foreign keys, uniqueness constraints and joins to maintain data integrity. SQL is also suitable for counting enrolments and updating grades. A NoSQL database may be useful for flexible or less structured data, but a relational database is a better fit for this system's structured data and relationships.
