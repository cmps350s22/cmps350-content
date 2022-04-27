// Import dependencies
import express from "express";
import router from "./services/router.js";

// Setup the express server
const app = express();
const port = 5000;

// Use json middleware
app.use(express.json());

// Setup all the services
app.use('/', router);

// Start the server
app.listen(port, () => {
  const host = "localhost";
  console.log(`App running @ http://${host}:${port}`);
});