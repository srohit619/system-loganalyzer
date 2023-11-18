const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const archiver = require("archiver");
const fs = require("fs");
const app = express();

dotenv.config();
const port = process.env.PORT || 8002;

//reads the data from config file
const configData = require("./config.json");
// console.log("config" + JSON.stringify(configData));

let logFolders;

// fetch the folders structure based on the inUse parameter from config.js file
if (configData.inUse == "ideal6") {
  logFolders = configData.ideal6.logFolders;
} else if (configData.inUse == "iwf6") {
  logFolders = configData.iwf6.logFolders;
}
console.log("logFolders--->" + typeof logFolders);

app.set("view engine", "ejs");
app.use(express.static("public")); // Assuming your CSS file is in a 'public' folder
// Serve static files from the 'src' folder
app.use("/src", express.static(path.join(__dirname, "src")));

// Define your getStatusIndicatorClass function
function getStatusIndicatorClass(level) {
  switch (level.toLowerCase()) {
    case "normal":
      return "normal";
    case "medium":
      return "medium";
    case "high":
      return "high";
    default:
      return "normal";
  }
}

app.get("/", (req, res) => {
  // Simulated data, replace this with your actual data
  const overviewData = {
    file: getLogFilesCount(),
    size: getTotalLogSize(),
    totalMicroservices: logFolders.length,
    level: "medium",
    uptime: "9hrs",
  };

  res.render("dashboard", {
    overview: overviewData,
    getStatusIndicatorClass: getStatusIndicatorClass,
    filesData: getListOfLogFiles(),
    servicesData: getLogFolderDetails(),
  });
});

app.get("/delete/:type/:name/:servicename", (req, res) => {
  console.log("endpoint called-->");
  const { name, servicename } = req.params;
  console.log("req body-->" + JSON.stringify(req.params));
  console.log(`RS---> ${getFolderPath(configData, servicename)}/${name}`);
  fs.unlinkSync(`${getFolderPath(configData, servicename)}/${name}`);
  res.status(200).send("DELETED");
});

// Download route for files and folders
app.get("/download/:type/:name/:servicename", (req, res) => {
  console.log("funcion called--->");
  const { type, name, servicename } = req.params;
  console.log("req body--->" + JSON.stringify(req.params));
  console.log("type--->" + type);
  console.log("servicename--->" + servicename);
  const filePath = path.join(
    __dirname,
    "C:\\IMPL_IDEAL6\\idealetl\\Logs\\2023-11-14-result.log"
  );
  console.log("filepath--->" + filePath);

  const filePath1 = path.join(getFolderPath(configData, servicename), name);
  console.log("filpath1-->" + filePath1);

  // const downloadFile =
  if (type === "file") {
    // Download file
    res.download(filePath1);
    // res.download(filePath1, name);
  } else if (type === "folder") {
    // Download folder as zip
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level
    });
    const output = fs.createWriteStream(`${__dirname}/temp/${name}.zip`);
    console.log("output--->" + output);

    archive.pipe(output);
    archive.directory(filePath, false);
    archive.finalize();

    output.on("close", () => {
      res.download(`${__dirname}/temp/${name}.zip`, `${name}.zip`, () => {
        // Clean up the temporary zip file
        fs.unlinkSync(`${__dirname}/temp/${name}.zip`);
      });
    });
  } else {
    res.status(404).send("Invalid download type");
  }
});

function getFolderPath(config, serviceName) {
  const inUseProduct = config.inUse;
  if (config.hasOwnProperty(inUseProduct)) {
    const logFolders = config[inUseProduct].logFolders;
    for (let i = 0; i < logFolders.length; i++) {
      if (logFolders[i][0] === serviceName) {
        return logFolders[i][1];
      }
    }
  }
  return null; // Service not found
}

// Function to count log files from specified log folders
function getLogFilesCount() {
  let totalLogFiles = 0;
  for (const logFolder of logFolders) {
    try {
      const files = fs.readdirSync(logFolder[1]);
      // console.log("files-->" + files);
      totalLogFiles += files.length;
      console.log("totalLogFiles" + totalLogFiles);
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
        // console.log("RSS filepath-->" + filePath);
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
        const creationDate = stats.birthtime.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        logFiles.push({
          serviceName,
          fileName: file,
          size: formatSize(stats.size),
          path: filePath,
          creationDate,
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
