const express = require("express");
const app = express();
const port = 3000; // or any port of your choice
const dummyData = require("./dummy");

app.set("view engine", "ejs");
app.use(express.static("public")); // Assuming your CSS file is in a 'public' folder

// Routes
app.get("/", (req, res) => {
  //   res.render("dashboard"); // Assuming your EJS file is named 'dashboard.ejs'
  res.render("dashboard", {
    filesData: dummyData.filesData,
    servicesData: dummyData.servicesData,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
