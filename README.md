# ShortWeb

## Description

ShortWeb is a web application that allows you to shorten long URLs and share them easily. It also stores your urls if you are logged in. You can also create notes for each short url you create. It also has in-built search functionality for retrieving your urls in future. The application is integrated with VirusTotal API to ensure that malicious urls are not propagated through our medium. It also uses client side caching for faster redirection.

## Features

ShortWeb offers the following features to enhance your web experience:

- You can create short and easy-to-share URLs from any long URL.
- You can be assured that the URLs you generate are safe and virus-free, thanks to the VirusTotal API integration.
- You can enjoy faster redirection from the short URLs to the original ones, thanks to the client-side caching mechanism.
- You can sign up for a free account and access more features, such as:
  - Token-based authentication for secure login and logout.
  - Click analysis for your short URLs, such as number of clicks, date of creation, and expiration date.
  - Search functionality for finding your short URLs by keywords or notes.
  - Notes functionality for adding and editing notes to your short URLs.
  - Autocomplete functionality for suggesting possible short URLs based on your input.

## How to run the project

To run the project, you need to have Node.js, npm, and MongoDB installed on your system.

1. Clone the repository from GitHub using `git clone https://github.com/SalmanHabeeb/ShortWeb.git`.
2. Navigate to the project directory using `cd ShortWeb`.
3. Navigate to the subdirectory server and run `npm install`.
4. Create a .env file in the server directory with the following variables:

```
PORT = <Server port address>
HOST = <host name>

LOCAL_CLIENT_APP = <Local Client Url>
LOCAL_SERVER_API = <Local Server Url>
LOCAL_MONGO_URL = <Mongo Cluster Connection Url>

KEY_FOR_USER_AUTH_TOKEN_GEN = <Token generation secret key>
VIRUSTOTAL_API_KEY = <Your VirusTotal API key>
```

5. Start the server using `npm run devStart`.
6. Open another terminal and navigate to the client directory using `cd client`.
7. Install the dependencies using `npm install`.
8. Create a .env file in the client directory with the following variables:

```
REACT_APP_LOCAL_SERVER_API = <Local host base api url>
```

9. Start the client using `npm start`.
10. Open your browser and go to `http://localhost:3000` to use the application.

## How the project works

The project consists of two parts: the server and the client.

- The server is built using Express, a web framework for Node.js. It handles the requests from the client and interacts with the MongoDB database. It also provides an API for creating and retrieving short URLs.

- The user interface is built using React. It allows the user to create short urls, browse previously created urls, create and delete account and view analysis of each created url.

### Client

The client is the front-end part of the application that provides the user interface. It consists of the following pages:

- **Landing page**: This is the main page where users can enter a long URL and get a short URL in return. They can also see a list of previously generated short URLs and their statistics. This page does not require the user to log in, so anyone can use it to create and share short URLs.
- **Signup page**: This is the page where users can create a free account by providing their name, email, and password. Having an account allows the user to access more features, such as notes, search, and profile.
- **Login page**: This is the page where users can log in to their existing account by providing their email and password. They will receive a token that will be stored in their browser's local storage and used for authentication.
- **Search page**: This is the page where users can search for their short URLs by keywords or notes. They can also use the autocomplete feature that will suggest possible matches as they type. Users can access this page by clicking on the search tab in the navigation bar.
- **Profile page**: This is the page where users can view and edit their personal details, namely email, and password. They can also delete their account if they wish to do so. Users can access this page by clicking on profile tab in the navigation bar.

### API Endpoints

The server provides the following API endpoints for the client:

- `/api/short/create`: GET - for creating short URLs from long URLs. The request body should contain the long URL as `longUrl`. The response body will contain the short URL as `shortUrl`.
- `/api/short`: GET - for obtaining short URLs and their metadata. The request query should contain the short URL as `shortUrl`. The response body will contain the long URL as `full`.
- `/api/user`: GET - for getting user details. The request header should contain the user token as `token`. The response body will contain the user email `email`.
- `/api/user/delete`: POST - for deleting user account. The request header should contain the user token as `token`. The response body will contain a success message as `{success: true}`.
- `/api/password`: POST - for changing user password. The request header should contain the user token as `token`. The request body should contain the old password and the new password as `oldPassword` and `newPassword`. The response body will contain a success message as `{success: true}`.
- `/api/signup`: POST - for creating a new user account. The request body should contain the user name, email, and password as `name`, `email`, and `password`. The response body will contain a success message as `{success: true}`.
- `/api/login`: POST - for logging in an existing user account. The request body should contain the user email and password as `email` and `password`. The response body will contain the user token as `token`.
- `/api/login/verify`: GET - to verify whether a user is logged in. The request header should contain the user token as `token`. The response body will contain a boolean value as `loggedIn`.
- `/api/logout`: GET - to log out a user. The request header should contain the user token as `token`. The response body will contain a success message as `{success: true}`.
- `/api/notes/edit`: GET - to edit notes for a short URL. The request header should contain the user token as `token`. The request query should contain the short URL and the new note as `shortUrl` and `note`. The response body will contain a success message as `{success: true}`.
- `/api/search/results`: GET - to get search results for a query. The request header should contain the user token as `token`. The request query should contain the search query as `query` and field as `field`. The response body will contain an array of short URLs that match the query as `results`.
- `/api/search/suggestions`: GET - to get suggestions for a query being typed. The request header should contain the user token as `token`. The request query should contain the partial query as `query` and field of search as `field`. The response body will contain an array of possible suggestions as `suggestions`.

## What I learned from the project

From this project, I learned how to:

- Use React to create a dynamic and responsive web interface.
- Use Express to create a RESTful API and handle different types of requests.
- Use safe hashing algorithms to encrypt user data.
- Use tokens for user-authentication.
- Use MongoDB to store and query data
- Use autocomplete and search indexes for faster search.

## Resources and references

I used the following resources and references while working on this project:

- [React documentation](https://reactjs.org/docs/getting-started.html)
- [Express documentation](https://expressjs.com/en/4x/api.html)
- [MongoDB documentation](https://docs.mongodb.com/)
- [How To Build A URL Shortener With Node.js, Express, and MongoDB](https://youtu.be/SLpUKAGnm-g)
