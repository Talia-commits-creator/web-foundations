SnapShare — Photo App Scaling Plan

1. Assumptions

- SnapShare has 10 million registered users.
- 10% of registered users are active daily.
- Each daily active user uploads 1 photo and views 50 feed pages per day.
- Each original photo is 2 MB, and each thumbnail is 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- Requests are spread evenly throughout the day for average estimates, and peak feed traffic is 5 times the average.
- Storage estimates use decimal units and exclude replication, backups, and additional metadata.

Daily active users (DAU):

10,000,000 × 10% = 1,000,000 daily active users.

2.  Traffic and Storage Estimates

Uploads per second

Daily uploads = 1,000,000 × 1 = 1,000,000 uploads.

Average uploads per second = 1,000,000 ÷ 86,400 = 11.57 uploads per second, or approximately 12.

Feed views per second

Daily feed views = 1,000,000 × 50 = 50,000,000 feed views.

Average feed views per second = 50,000,000 ÷ 86,400 = 578.7 feed views per second, or approximately 579.

Peak feed views per second = 578.7 × 5 = 2,893.5 feed views per second, or approximately 2,894.

Photo storage per year

Original photos per year = 1,000,000 × 365 = 365,000,000 photos.

Original photo storage = 365,000,000 × 2 MB = 730,000,000 MB = 730 TB per year.

Thumbnail storage = 365,000,000 × 50 KB = 18,250,000,000 KB = 18.25 TB per year.

Total original photo and thumbnail storage = 730 TB + 18.25 TB = 748.25 TB per year.

These estimates exclude backups, replicas, and other storage overhead.

3.  Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system because each active user views 50 feed pages daily but uploads only one photo. This creates approximately 50 feed views for every photo upload, so the architecture should prioritize fast feed delivery using a CDN, caching, load balancing, and database read replicas.

4.  Where Should Photos Be Stored?

Photo files should be stored in object storage, rather than directly inside the database. Image files are large, and object storage is designed to store and serve large files efficiently and cost-effectively. The database should store metadata, such as photo IDs, user IDs, captions, timestamps, and object storage keys or URLs.

5.  Architecture Diagram

text
USERS
|
v
+------------------+
| CDN |
| Cached images |
+------------------+
|
v
+------------------+
| Load Balancer |
+------------------+
|
v
+------------------+
| App Servers |
+------------------+
| | |
| | +------------------+
| | |
v v v
+----------+ +----------------+ +----------------+
| Cache | | Primary | | Object Storage |
| (Redis) | | Database | | Original Photos|
+----------+ +----------------+ | & Thumbnails |
| +----------------+
v ^
+----------------+ |
| Read Replica | |
+----------------+ |
|
App Servers |
| |
v |
+---------------+ |
| Message Queue | |
+---------------+ |
| |
v |
+---------------+ |
| Thumbnail |-----------------------+
| Worker |
+---------------+

6.  What Each Component Does

- CDN: Delivers cached images and thumbnails from locations close to users, reducing latency and origin server traffic.
- Load balancer: Distributes incoming requests across app servers to prevent one server from becoming overloaded.
- App servers: Handle application logic, authentication, photo uploads, feed requests, and communication with other services.
- Cache (Redis): Stores frequently accessed feed data and metadata to reduce database queries and improve response times.
- Primary database: Stores persistent structured data, including users, photo metadata, and follow relationships, and handles writes.
- Read replica: Handles read queries to reduce the workload on the primary database and improve read scalability.
- Object storage: Stores original photos and generated thumbnails without placing large image files inside database records.
- Message queue: Holds thumbnail-generation jobs so that photo uploads do not need to wait for image processing.
- Thumbnail worker: Processes queued jobs, creates smaller versions of uploaded photos, and saves the thumbnails to object storage.

7. Photo Upload Flow

1. A user uploads a photo through the application.
1. The load balancer routes the upload request to an available app server.
1. The app server validates the request, authenticates the user, and checks the uploaded file.
1. The original photo is stored in object storage.
1. The app server saves the photo's metadata and storage key in the primary database.
1. The app server places a thumbnail-generation job in the message queue.
1. The app server confirms the upload to the user without waiting for thumbnail generation to finish.
1. A thumbnail worker retrieves the job from the queue and creates a smaller image.
1. The worker stores the thumbnail in object storage and updates any necessary metadata.
1. When users view their feeds, the app servers retrieve feed data from the cache or database, and the CDN delivers the images and thumbnails.

1. Trade-Offs

Trade-Off 1: Caching versus data freshness

Caching makes feed requests faster and reduces database load, but cached data may become outdated when a user uploads a photo or changes their follow relationships. Cache invalidation or updates improve freshness but add complexity.

Trade-Off 2: Asynchronous thumbnails versus immediate availability

Using a queue and worker allows uploads to finish quickly and handles image processing independently. However, thumbnails may not be available immediately, and the system must handle failed jobs and retries.

Trade-Off 3: Read replicas versus consistency

Read replicas improve read scalability, but replication lag may cause users to see slightly outdated data after an upload. Reading critical, recently updated data from the primary database can improve freshness but increases its workload.

Trade-Off 4: Object storage versus operational simplicity

Object storage is cost-effective and scalable for large image files, but it introduces a separate service that must be coordinated with the database. The system must handle failed uploads, orphaned files, and access permissions carefully.
