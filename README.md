
# SocialNest 
## A social Media Platform

## Overview

This project is a full-stack social media platform built using the MERN stack, which comprises MongoDB, Express.js, React.js, and Node.js. It offers a range of features including user authentication using JSON Web Tokens (JWT), user routes for signup and signin, user context for managing user details across the application, and posts routes for creating, deleting, editing, and liking posts. Cloudinary integration is utilized for efficient management of images associated with posts.

## Features

### User Authentication

- Secure signup and signin functionality using JSON Web Tokens (JWT).
- Authentication middleware to protect routes requiring authentication.

### User Routes

- **Signup**: Allows users to create a new account by providing necessary details.
- **Signin**: Enables users to log in to their existing accounts securely.

### User Context

- Centralized management of user authentication state and user details.
- Provides user information throughout the application, facilitating personalized experiences.

### Posts Routes

- **Create Post**: Users can create new posts, including text content and optional images.
- **Delete Post**: Allows users to delete their own posts.
- **Edit Post**: Provides functionality for users to edit the content of their posts.
- **Like Post**: Users can like and unlike posts, with real-time updating of like counts.

### Image Management with Cloudinary

- Integration with Cloudinary for efficient storage and management of images associated with posts.
- Automatic resizing and optimization of images for optimal performance.

## Technologies Used

### Frontend

- **React.js**: Frontend JavaScript library for building user interfaces.
- **React Router**: For declarative routing within the React application.
- **Axios**: Promise-based HTTP client for making API requests.

### Backend

- **Node.js**: JavaScript runtime environment for executing server-side code.
- **Express.js**: Web application framework for Node.js, providing a robust set of features for building APIs.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: MongoDB object modeling tool for interacting with MongoDB databases.

### Authentication

- **JSON Web Tokens (JWT)**: Standard for securely transmitting information between parties as a JSON object.

### Image Management

- **Cloudinary**: Cloud-based image and video management platform for storage, optimization, and delivery of media assets.

## License

This project is licensed under the [MIT License](LICENSE).

---