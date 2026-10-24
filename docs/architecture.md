QuickNotes System Architecture

1.  Functional Requirements

- Users can load, create, view, update, and delete notes.
- Users can organize notes using tags.
- The system validates input and displays loading, success, and error messages.
- Users must be authenticated to access their private notes.

2.  Nonfunctional Requirements

- Performance: Common requests should complete within 2 seconds under normal load.
- Availability: The service should target 99.9% uptime.
- Security: Use HTTPS, authentication, authorization, and input validation.
- Scalability: Add application servers as traffic increases.
- Reliability: Back up the database and monitor application health.

3.  Estimated Load for 1 Million Registered Users

Assumptions:

- 100,000 daily active users.
- Each active user makes 50 read requests and 5 write requests per day.
- Each user creates 2 notes daily.
- Each stored note averages 2 KB, excluding indexes and backups.
- One day has 86,400 seconds.

Read and Write Requests

Daily reads = 100,000 × 50 = 5,000,000.

Average reads per second = 5,000,000 ÷ 86,400 ≈ 58.

Daily writes = 100,000 × 5 = 500,000.

Average writes per second = 500,000 ÷ 86,400 ≈ 5.8.

These are average rates. Peak traffic may be considerably higher.

Annual Storage

Annual notes = 100,000 × 2 × 365 = 73,000,000 notes.

Annual note storage = 73,000,000 × 2 KB = approximately 146 GB per year.

This estimate excludes database indexes, metadata, backups, and replication.

4.  Architecture Diagram

                 [Web / Mobile Client]
                           |
                          DNS
                           |
                          CDN
                           |
                  [Load Balancer]
                     /         \
             [App Server 1] [App Server 2]
                     \         /
                       [Cache]
                           |
                  [Primary Database]
                           |
                    [Read Replica]

                  [Message Queue]
                         |
                       [Worker]
                         |
                 [Database / Storage]

5.  Component Responsibilities

- Client: Displays the interface and sends API requests.
- DNS: Resolves the service domain to its network destination.
- CDN: Delivers static files from locations closer to users.
- Load balancer: Distributes incoming requests across application servers.
- Application servers: Validate requests, enforce permissions, and execute application logic.
- Cache: Stores frequently requested data to reduce database load.
- Primary database: Handles writes and maintains the authoritative data.
- Read replica: Serves suitable read queries to reduce load on the primary database.
- Message queue: Holds background jobs until workers process them.
- Worker: Performs tasks such as sending notifications and processing queued jobs.

6.  Request Flows

GET /notes

1. The client sends a GET request to `/notes`.
2. DNS resolves the service address, and the request reaches the load balancer.
3. The load balancer selects a healthy application server.
4. The application server authenticates the user and checks permissions.
5. The server checks the cache for the user's notes.
6. If the data is not cached, the server queries the database or an appropriate read replica.
7. The server returns the notes as JSON with HTTP status `200 OK`.
8. The client displays the notes.

POST /notes

1. The client sends a POST request to `/notes` with the note title and body.
2. The load balancer forwards the request to a healthy application server.
3. The server authenticates the user and validates the request.
4. The server writes the new note to the primary database.
5. If background work is required, the server adds a job to the message queue.
6. The server returns the created note with HTTP status `201 Created`.
7. A worker processes any queued background tasks.

8. Trade-offs and Reliability

Trade-off 1: Caching

Caching reduces database load and improves read performance. However, cached data can become stale. The system should invalidate or update relevant cache entries after writes.

Trade-off 2: Read Replicas

Read replicas improve read capacity, but replication delay can mean a recent update is not immediately visible on a replica. Requests that require the latest data should read from the primary database.

Trade-off 3: Queues

Queues allow slow background work to happen asynchronously. However, jobs may be delayed or fail, so workers need retries and failed-job monitoring.

8.  Avoiding Single Points of Failure

- Run multiple application servers across separate failure zones where possible.
- Use health checks and redundant load-balancing infrastructure.
- Configure database backups, replication, and a documented recovery process.
- Monitor the cache and queue, and define fallback behavior.
- Use monitoring and alerts to detect service failures quickly.

The architecture improves scalability and reliability, but actual availability depends on deployment, configuration, and recovery testing.

9.  Prototype Limitation

The current QuickNotes browser prototype uses JSONPlaceholder to demonstrate GET, POST, and DELETE requests. It does not implement the production infrastructure described above. The architecture is a proposed design for a scalable future version
