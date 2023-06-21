# ShortWeb

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

1. Clone the repository from GitHub using `git clone https://github.com/your-username/ShortWeb.git`.
2. Navigate to the project directory using `cd ShortWeb`.
3. Navigate to subdirectory server and run `npm install`.
4. Start the server using `npm run devStart`.
5. Open another terminal and navigate to the client directory using `cd client`.
6. Install the dependencies using `npm install`.
7. Start the client using `npm start`.
8. Open your browser and go to `http://localhost:3000` to use the application.

## How the project works

The project consists of two parts: the server and the client.

- The server is built using Express, a web framework for Node.js. It handles the requests from the client and interacts with the MongoDB database. It also provides an API for creating and retrieving short URLs.

- The user interface is built using React. It allows the user to create short urls, browse previously created urls, create and delete account and view analysis of each created url.

### FrontEnd

Landing page is for users to create urls and share them avoiding the hassle of logging in. If the user wants to access more features, they have to signup. Once logged in, the user can make notes for their urls. Also, they can search the urls by navigating to Search page from navigation bar. Search page enables users to search urls, with autocomplete functionality. For retrieving the user details, the user can navigate to the Profile page using navigation bar. Here, the user can modify his password and delete his account.

### APIs

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
- [How to build a URL shortener with Node.js, Express, and MongoDB](https://www.freecodecamp.org/news/how-to-build-a-url-shortener-with-node-js-express-and-mongodb/)
