# Express Book Reviews: a REST API with sessions and JWT

A small book-shop back end in Node.js and Express. Anyone can browse the catalogue and read reviews; registered users log in, get a JWT stored in their session, and can add, change or delete their own review of a book.

Final project for IBM's *Developing Back-End Apps with Node.js and Express* course, built on the course's starter template.

## Endpoints

| Method | Path | Access | What it does |
|---|---|---|---|
| GET | `/` | public | all books |
| GET | `/isbn/:isbn` | public | one book by ISBN |
| GET | `/author/:author` | public | books by an author |
| GET | `/title/:title` | public | books by title |
| GET | `/review/:isbn` | public | the reviews of a book |
| POST | `/register` | public | create a user (`{"username", "password"}`) |
| POST | `/customer/login` | public | log in; stores a JWT in the session |
| PUT | `/customer/auth/review/:isbn?review=...` | logged in | add or update your review |
| DELETE | `/customer/auth/review/:isbn` | logged in | delete your review |

The public lookups are written with Promises (the course's async task). Every `/customer/auth/*` route passes through a middleware that verifies the session's JWT and returns 403 when the user is not logged in.

## Run it

```bash
cd final_project
npm install
npm start                      # http://localhost:5000
```

```bash
curl -X POST localhost:5000/register -H "Content-Type: application/json" -d '{"username":"omar","password":"pw123"}'
curl -c jar -X POST localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"omar","password":"pw123"}'
curl -b jar -X PUT "localhost:5000/customer/auth/review/1?review=Great%20book"
curl localhost:5000/review/1
```

Set `SESSION_SECRET`, `JWT_SECRET` and `PORT` in the environment for anything beyond local use; the built-in defaults are for development only.

## Changes after the course

The course template left a few things a production review would flag, so this version:

- reads the session and JWT secrets and the port from environment variables instead of hard-coding them;
- signs the JWT with the username, not the password (the template put the password in the token payload);
- returns 400 for a login with missing fields and 401 for wrong credentials (the template used 404 and 208);
- runs with `node` by default (`npm start`) and keeps `nodemon` as a dev dependency (`npm run dev`).

Users and books are held in memory, so they reset when the server restarts; that is the course's scope.

## History

Developed in August 2025 on another GitHub account and moved here in October 2026 with its full commit history (the early commits are the IBM template's).

---

Omar Essam El Sherbiny · [omaressam.web.app](https://omaressam.web.app) · [LinkedIn](https://www.linkedin.com/in/omar-essam-el-sherbiny-b602279b/)
