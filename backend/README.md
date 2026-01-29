Forum App – Backend

This is the backend service for a forum application where users can create groups, post content, like posts, and add comments.

The backend is built using Node.js, Express, and MongoDB, with secure JWT authentication using cookies.

Tech Stack
 Node.js
 Express.js
 Cors
 Bcrypt.js
 Dotenv
 MongoDB (Atlas)
 Mongoose
 JWT (JSON Web Token)
 Cookie-based Authentication
 ES Modules
 Nodemon

Features
 1 Authentication
   User login using JWT
   Token stored securely in HTTP-only cookies

 2 Groups
   Join a group 
   Only group members can access group content

 3 Posts
   Create a post inside a group (group members only)
   View all posts of a specific group
   Delete a post (only the post author)

 4 Likes
   Like a post
   One user can like a post only once
   Clicking again removes the like (toggle behaviour)

 5 Comments
   Add a comment to a post (group members only)
   View comments of a post
   Delete a comment (only the comment author)

 6 Data Population
   Author details (username) are populated in posts and comments
   Improves frontend usability by avoiding extra API calls

How to Run the Backend
 1: Clone the repository
    git clone <repository-url>
    cd backend

 2: Install dependencies
    npm install

 3: Start the server
    npm run server

🔗 API Endpoints
 1: Authentication
   Create User Api
    http://localhost:5000/api/users/register
   Login User Api
    http://localhost:5000/api/users/login
   Logout User Api
    http://localhost:5000/api/users/logout
   
2: Groups
   AllGetGroups
    http://localhost:5000/api/data/groups
   CreateGroup
    http://localhost:5000/api/data/groups
   JoinGroup
    http://localhost:5000/api/data/groups/:id/join

3: Posts
   ShowPost
    http://localhost:5000/api/posts/:groupId
   CreatePost
    http://localhost:5000/api/posts/:groupId
   DeletePost
    http://localhost:5000/api/posts/:postId
   Like / Unlike a post
    http://localhost:5000/api/posts/:postId/like
  
4: Comments
   ShowComments
    http://localhost:5000/api/comments/:postId
   CreateComment
    http://localhost:5000/api/comments/:postId
   DeleteComment
    http://localhost:5000/api/comments/:commentId

Authorization Rules
  Only authenticated users can access protected routes
  Only group members can create posts and comments
  Only authors can delete their own posts or comments

Key Design Decisions
 Group-based access control
 Ownership-based delete permissions
 Toggle like system instead of separate like/unlike APIs
 Clean REST API structure

Future Improvements
 Pagination for posts and comments
 Role-based access (admin/moderator)
 Real-time features
 Notifications

Author
Abdul Khalid
Full Stack Developer

Assignment Status
  All required backend features implemented
  Secure authentication and authorization
  Ready for review and deployment