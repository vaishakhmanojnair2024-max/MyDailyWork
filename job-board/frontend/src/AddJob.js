import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const addJob = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/add-job",
        {
          title,
          company,
          location,
          description
        },
        {
          headers: { Authorization: token }
        }
      );

      navigate("/");
    } catch {
      alert("Error adding job");
    }
  };

  return (
    <div>
      <h2>Add Job</h2>

      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <br />

      <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
      <br />

      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <br />

      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <br />

      <button onClick={addJob}>Add Job</button>
    </div>
  );
}

export default AddJob;