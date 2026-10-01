import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must contain 10 digits";
    }

    if (formData.course === "") {
      newErrors.course = "Please select a course";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/students",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: ""
      });

      setErrors({});

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to upload data"
      );
    }
  };

  return (
    <div className="container">
      <h1>Student Registration</h1>

      <form onSubmit={handleSubmit}>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        {errors.name && <p className="error">{errors.name}</p>}


        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <p className="error">{errors.email}</p>}


        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter 10 digit phone number"
        />
        {errors.phone && <p className="error">{errors.phone}</p>}


        <label>Course</label>
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Select Course</option>
          <option value="BCA">BCA</option>
          <option value="B.Tech CSE">B.Tech CSE</option>
          <option value="B.Tech ECE">B.Tech ECE</option>
          <option value="B.Tech Biotech">B.Tech BioTech</option>
          <option value="MCA">MCA</option>
          <option value="M.Tech">M.Tech</option>
          <option value="PhD">PhD</option>
        </select>

        {errors.course && (
          <p className="error">{errors.course}</p>
        )}


        <button type="submit">
          Register
        </button>

      </form>

      {message && <h3 className="message">{message}</h3>}
    </div>
  );
}

export default App;