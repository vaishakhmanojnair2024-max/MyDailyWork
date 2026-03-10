import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Apply() {

  const { id } = useParams();   // job id from URL
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("resume", resume);

    const response = await fetch(`http://localhost:5000/apply/${id}`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div>

      <h2>Apply for Job</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          required
        />

        <br /><br />

        <button type="submit">Submit Application</button>

      </form>

    </div>
  );
}

export default Apply;