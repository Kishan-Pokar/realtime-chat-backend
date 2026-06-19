# Realtime Chat Backend

A production-ready realtime chat backend built with Node.js, Express, Socket.IO, PostgreSQL, and Redis. Supports real-time message delivery, offline message storage with store-and-forward, presence tracking, and JWT-secured WebSocket connections.

---
Live Demo

A simple frontend has been built to demonstrate the backend's functionality, deployed on Vercel. Backend is deployed on Render.

Site: https://realtime-chat-app-two-jade.vercel.app/

To test real-time chat:


Open the site and log in with:

Email: kip@gmail.com
Password: 123456
Username: kishan



Open the site again in an incognito window (or a different browser) and log in with:

Email: k@gmail.com
Password: 123456
Username: kip



Start chatting between the two windows to see real-time message delivery, ACK-based confirmations, and presence tracking in action.



Note: These are demo credentials on a free-tier deployment for showcasing functionality only — not real accounts.


## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT                            │
└──────────┬──────────────────────────┬───────────────┘
           │ REST API                 │ WebSocket
┌──────────▼──────────┐   ┌──────────▼───────────────┐
│     HTTP Layer      │   │     Socket.IO Layer        │
│  (Express Routes)   │   │  JWT Auth Middleware       │
│                     │   │  Connection Handler        │
│  POST /users/register   │  Message Handler           │
│  POST /users/login  │   │  Presence Handler          │
│  GET  /users        │   └──────────┬───────────────┘
└──────────┬──────────┘              │
           │                         │
┌──────────▼─────────────────────────▼───────────────┐
│                  Service Layer                       │
│  user.service    message.service   presence.service  │
└──────────┬─────────────────────────┬───────────────┘
           │                         │
┌──────────▼──────────┐   ┌──────────▼───────────────┐
│     PostgreSQL      │   │          Redis             │
│                     │   │                            │
│  users table        │   │  online:<userId> → socketId│
│  messages table     │   │  (presence tracking)       │
└─────────────────────┘   └────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Realtime | Socket.IO |
| Database | PostgreSQL |
| Cache / Presence | Redis |
| Auth | JWT (HTTP) + JWT (WebSocket) |
| Password Hashing | bcrypt |

---

## Key Features

### JWT-Secured WebSocket Connections
WebSocket connections are authenticated the same way as HTTP requests. The client passes a JWT token in the socket handshake. The server verifies it before allowing the connection and attaches the `userId` to the socket instance. Unauthenticated connections are rejected immediately.

### Real-Time Message Delivery
When a user sends a message, the server checks Redis to see if the receiver is currently online. If they are, the message is delivered instantly over WebSocket. The receiver sends back an ACK confirming delivery, which triggers a status update in PostgreSQL.

### Store-and-Forward for Offline Users
If the receiver is offline, the message is saved to PostgreSQL with status `PENDING`. When they reconnect, they emit a `fetch_offline_messages` event. The server retrieves all undelivered messages and pushes them to the client in one batch.

### Message Lifecycle States
Every message moves through a clear lifecycle:
```
PENDING → SENT → DELIVERED
```
- `PENDING` — saved to DB, receiver is offline
- `SENT` — delivered over WebSocket, waiting for ACK
- `DELIVERED` — ACK received, confirmed on receiver's end

### Presence Tracking with Redis
Redis tracks which users are online and what their current socket ID is. This is externalized from memory so it works across multiple server instances — the foundation for horizontal scaling.

---

## Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING'
);
```

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Redis

### Setup

**1. Clone the repository**
```bash
git clone <repo-url>
cd realtime-chat-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create environment file**
```bash
cp .env.example .env
```

**4. Configure environment variables**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/chat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**5. Create database tables**

Run the schema above in your PostgreSQL instance.

**6. Start the server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## API Reference

### Register User
```http
POST /users/register
Content-Type: application/json

{
  "username": "kishan",
  "email": "kishan@example.com",
  "password": "yourpassword"
}
```

### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "kishan@example.com",
  "password": "yourpassword"
}
```
Returns a JWT token. Use this token for WebSocket authentication.

### Get All Users
```http
GET /users
```

---

## WebSocket Events

### Connection
Connect with JWT token in the handshake:
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
});
```

### Send Message
```javascript
socket.emit('send_message', {
  to: 'receiver_user_id',
  content: 'Hello!'
});
```

### Receive Message
```javascript
socket.on('receive_message', (message) => {
  console.log(message);
  // Send ACK to confirm delivery
  socket.emit('message_ack', { messageId: message.id });
});
```

### Fetch Offline Messages
```javascript
socket.emit('fetch_offline_messages');

socket.on('offline_messages', (messages) => {
  console.log(messages);
});
```

---

## Project Structure

```
src/
├── config/
│   ├── db.js           ← PostgreSQL connection pool
│   └── redis.js        ← Redis client
├── controllers/
│   └── user.controller.js
├── repositories/
│   ├── message.repo.js ← message DB queries
│   └── user.repo.js    ← user DB queries
├── routes/
│   ├── health.routes.js
│   └── user.routes.js
├── services/
│   ├── message.service.js   ← delivery logic, store-and-forward
│   ├── presence.service.js  ← Redis online/offline tracking
│   └── user.service.js      ← auth, registration
├── sockets/
│   ├── index.js        ← Socket.IO init + JWT middleware
│   ├── connection.js   ← connection/disconnection handler
│   └── messaging.js    ← message event handlers
├── app.js              ← Express setup
└── server.js           ← HTTP server + Socket.IO init
```

---

## Known Limitations

- **No conversation history endpoint** — messages are stored in PostgreSQL but there is no REST endpoint to fetch chat history. Planned as a future improvement.
- **Single server instance** — while presence is externalized to Redis, Socket.IO is not configured with a Redis adapter yet. Messages can only be delivered if the sender and receiver are connected to the same server instance. A Redis adapter would enable true multi-instance support.
- **No message pagination** — offline message retrieval fetches all pending messages at once. For large backlogs this needs pagination.

---

## Future Improvements

- Redis adapter for Socket.IO to support true horizontal scaling
- Chat history endpoint with pagination
- Group chat support
- Read receipts
- Message editing and deletion
- Docker Compose setup for one-command local development
