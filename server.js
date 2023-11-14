const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const fs = require("fs");
const app = express();
const dummyData = require("./dummy");

dotenv.config();
const port = process.env.PORT || 8002;

//reads the data from config file
const configData = require("./config.json");

let logFolders;

// fetch the folders structure based on the inUse parameter from config.js file
if (configData.inUse == "ideal6") {
  logFolders = configData.ideal6.logFolders;
} else if (configData.inUse == "iwf6") {
  logFolders = configData.iwf6.logFolders;
}

app.set("view engine", "ejs");
app.use(express.static("public")); // Assuming your CSS file is in a 'public' folder

// Routes
app.get("/", (req, res) => {
  //   res.render("dashboard"); // Assuming your EJS file is named 'dashboard.ejs'
  res.render("dashboard", {
    filesData: getListOfLogFiles(),
    servicesData: getLogFolderDetails(),
    overview: {
      file: getLogFilesCount(),
      size: getTotalLogSize(),
      totalMicroservices: logFolders.length,
      level: "Normal",
      uptime: "9hrs",
    },
  });
});

// Function to count log files from specified log folders
function getLogFilesCount() {
  let totalLogFiles = 0;
  for (const logFolder of logFolders) {
    try {
      const files = fs.readdirSync(logFolder[1]);
      // console.log("files-->" + files);
      totalLogFiles += files.length;
    } catch (err) {
      // console.error(`${red}Error reading log folder ${err}${reset}`);
      console.log("errrr");
    }
  }
  return totalLogFiles;
}

// Function to calculate the total log size from different log folders
function getTotalLogSize() {
  let totalSizeBytes = 0;
  for (const logFolder of logFolders) {
    try {
      const files = fs.readdirSync(logFolder[1]);
      for (const file of files) {
        const filePath = path.join(logFolder[1], file);
        // console.log("filepath-->" + filePath);
        const stats = fs.statSync(filePath);
        totalSizeBytes += stats.size;
      }
    } catch (err) {
      console.error(`Error reading log folder ${logFolder[1]}: ${err}`);
      // console.error(`${red}Error reading log folder ${err}${reset}`);
    }
  }
  const totalSizeGB = formatSize(totalSizeBytes); //(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
  return totalSizeGB;
}

function getListOfLogFiles() {
  const logFiles = [];

  for (const logFolder of logFolders) {
    try {
      const serviceName = logFolder[0];
      const files = fs.readdirSync(logFolder[1]);
      for (const file of files) {
        // const filePath = path.join(logFolder[1], file);
        const filePath = path.join(logFolder[1]);
        const stats = fs.statSync(path.join(logFolder[1], file));

        logFiles.push({
          serviceName,
          fileName: file,
          size: formatSize(stats.size),
          path: filePath,
        });
      }
    } catch (err) {
      console.error(`Error reading log folder ${logFolder[1]}: ${err}`);
    }
  }

  return logFiles;
}

// Function to get log folder details with service name, path, and size
function getLogFolderDetails() {
  const logFolderDetails = [];
  for (const logFolder of logFolders) {
    try {
      const logFolderPathRelative = logFolder[1]; // Use the provided relative path
      const logFolderPath = path.resolve(__dirname, logFolderPathRelative); // Convert to absolute path

      const serviceName = logFolder[0];
      const files = fs.readdirSync(logFolder[1]);
      let totalSizeBytes = 0;
      for (const file of files) {
        const filePath = path.join(logFolder[1], file);
        const stats = fs.statSync(filePath);
        totalSizeBytes += stats.size;
      }
      const logFolderSizeGB = formatSize(totalSizeBytes); //(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
      logFolderDetails.push({
        serviceName,
        logFolderPath: logFolderPath, //logFolder[1],
        logFolderSize: logFolderSizeGB,
      });
    } catch (err) {
      console.error(`Error reading log folder ${logFolder}: ${err}`);
      // console.error(`${red}Error reading log folder ${err}${reset}`);
    }
  }
  return logFolderDetails;
}

function formatSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
