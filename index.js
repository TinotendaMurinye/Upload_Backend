const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3001;

// SSL options using Let's Encrypt certificates
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/fullchain.pem'),
};

// Use CORS middleware
app.use(cors()); // Enable all CORS requests

// Function to set up storage
const createStorage = (uploadDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
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
  const filePath = path.join("uploads", req.file.filename);
  res.json({ path: `${filePath}` });
});

// Example route for uploading documents
app.post("/documents", uploadDocuments.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No document uploaded.");
  }
  const filePath = path.join("Documents", req.file.filename);
  res.json({ path: `${filePath}` });
});

// Define a route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Error handling middleware for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ message: err.message });
  }
  next(err);
});

// Start the server with SSL
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});