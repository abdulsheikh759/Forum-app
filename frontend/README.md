 Frontend 

This is the frontend part of the Mini Community Forum application.
It is built using React and connects with a Node.js + Express backend via REST APIs.

Tech Stack

  React (with Hooks)
  React Router DOM
  Axios
  Context API (Authentication)
  React Toastify
  Tailwind CSS (basic styling)

Features Implemented
 User authentication using JWT (via backend)
 View posts inside a grou
 Create a post in a group
 Like / Unlike a post
 View comments on a post
 Add and delete comments
 Protected routes using auth token
 Backend APIs tested and working via Postman

 Install dependencies
 npm install

 Start the frontend
 npm run dev

 Main APIs used:
 GET /api/posts/:groupId
 POST /api/posts/:groupId
 POST /api/posts/:postId/like
 GET /api/comments/:postId
 POST /api/comments/:postId
 DELETE /api/comments/:commentId


 Backend Status

✅ Backend APIs are fully implemented and tested using Postman
✅ Like / Unlike and Comment logic works correctly on backend
⚠️ There is a minor frontend state synchronization issue related to like/comment UI rendering, which is currently being worked on.

The core logic, API flow, and data handling are correct.


Notes
Focus of this project is functionality over UI
Clean API integration and authentication flow
Code written with readability and clarity in mind
Project is suitable for junior-level evaluation

Author
Abdul Khalid
Junior Full Stack Developer
(React | Node.js | MongoDB)