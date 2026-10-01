const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  }
});

const Student = mongoose.model("Student", studentSchema);

// POST API
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;

    if (!name || !email || !phone || !course) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const student = new Student({
      name,
      email,
      phone,
      course
    });

    await student.save();

    res.status(201).json({
      message: "Student data uploaded successfully",
      student
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
});

// GET API
app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});