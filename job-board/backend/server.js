const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Application = require("./models/Application");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const SECRET = "mysecretkey";

// LOCAL MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/jobboard")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// =====================
// Models
// =====================

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String
});

const Job = mongoose.model("Job", jobSchema);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);


// =====================
// Auth Middleware
// =====================

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
}


// =====================
// Auth Routes
// =====================

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User created successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({ token });
});


// =====================
// Job Routes
// =====================

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.post("/add-job", auth, async (req, res) => {
  const { title, company, location, description } = req.body;

  const job = new Job({
    title,
    company,
    location,
    description
  });

  await job.save();

  res.json({ message: "Job added" });
});

app.delete("/delete-job/:id", auth, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});

app.put("/update-job/:id", auth, async (req, res) => {
  const { title, company, location, description } = req.body;

  await Job.findByIdAndUpdate(req.params.id, {
    title,
    company,
    location,
    description
  });

  res.json({ message: "Job updated" });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/apply/:jobId", upload.single("resume"), async (req, res) => {
  try {

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = new Application({
      jobId: req.params.jobId,
      applicantEmail: req.body.email,
      resume: req.file.filename
    });

    await application.save();

    res.json({
      message: "Application submitted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Application failed",
      error: err.message
    });
  }
});

app.get("/applications", async (req, res) => {
  const applications = await Application.find().populate("jobId");
  res.json(applications);
});