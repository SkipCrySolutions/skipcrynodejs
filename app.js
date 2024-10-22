const express = require("express");
const { PORT } = require("./constants");
const app = express();
const port = process.env.PORT || PORT;
const path = require("path");
const connectToMongoDB = require("./config");

// Define the directory for static content
const publicDirectoryPath = path.join(__dirname, "public");

// Middleware
app.use(express.json());

app.use(express.static(publicDirectoryPath));

// connect to DB
connectToMongoDB();

// Routes
const routes = require("./routes");
app.use("/", routes);


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
