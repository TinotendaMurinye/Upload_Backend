const express = require("express"); // Import express
const multer = require("multer"); // Import multer
const path = require("path"); // Import path
const fs = require("fs"); // Import fs
const cors = require("cors"); // Import cors

const app = express(); // Create an instance of express
const PORT = process.env.PORT || 3001; // Set port

// Use CORS middleware
app.use(cors()); // Enable all CORS requests

// Function to set up storage
const createStorage = (uploadDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
      cb(null, uploadDir); // Set destination
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
    },
  });
};

// Initialize multer for different storage locations
const upload = multer({ storage: createStorage("uploads") });
const uploadDocuments = multer({ storage: createStorage("Documents") });
const uploadBirthCertificates = multer({ storage: createStorage("Birth_Certificate") });
const uploadNationalIDs = multer({ storage: createStorage("National_ID") });
const uploadResults = multer({ storage: createStorage("Results") });

// Serve static files from the upload directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/Documents', express.static(path.join(__dirname, 'Documents')));
app.use('/Birth_Certificate', express.static(path.join(__dirname, 'Birth_Certificate')));
app.use('/National_ID', express.static(path.join(__dirname, 'National_ID')));
app.use('/Results', express.static(path.join(__dirname, 'Results')));

// Define routes for uploading files
app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("uploads", req.file.filename); // Get the file path
  res.json({ path: `http://localhost:${PORT}/${filePath}` }); // Return the file path as JSON
});

app.post("/Documents", uploadDocuments.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("Documents", req.file.filename); // Get the file path
  res.json({ path: `http://localhost:${PORT}/${filePath}` }); // Return the file path as JSON
});

app.post("/Birth_Certificate", uploadBirthCertificates.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("Birth_Certificate", req.file.filename); // Get the file path
  res.json({ path: `http://localhost:${PORT}/${filePath}` }); // Return the file path as JSON
});

app.post("/National_ID", uploadNationalIDs.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("National_ID", req.file.filename); // Get the file path
  res.json({ path: `http://localhost:${PORT}/${filePath}` }); // Return the file path as JSON
});

app.post("/Results", uploadResults.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("Results", req.file.filename); // Get the file path
  res.json({ path: `http://localhost:${PORT}/${filePath}` }); // Return the file path as JSON
});

// Define a route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!"); // Response for the root URL
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});