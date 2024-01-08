## URL Shortener ##

This project is a URL shortening service implemented using Node.js and Express.js. The application provides user authentication, allowing registered users to create shortened versions of URLs. It also includes a dashboard where users can manage and view their created short URLs.

**Technologies Used:**

* Node.js: A JavaScript runtime used for server-side development.
* Express.js: A web application framework for Node.js that simplifies the process of building robust web applications.
* PostgreSQL: A powerful open-source relational database used for storing user data, URLs, and related information.
* Passport.js: An authentication middleware for Node.js that supports various authentication strategies. In this project, the local strategy is used for email/password authentication.
* EJS: A template engine for generating HTML markup with embedded JavaScript in the views.
* Nanoid: A small, secure, URL-friendly unique string ID generator used for creating short URL identifiers.

  
**Project Structure:**

* The project follows a client-server architecture.
* The frontend views are rendered using EJS templates.
* The backend is implemented using Express.js, handling URL shortening, user authentication, and database interactions.
* Passport.js is utilized for user authentication and session management.
* PostgreSQL is used to store user information, short URLs, and related data.
