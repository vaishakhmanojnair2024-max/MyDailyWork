import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {

  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [search, setSearch] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchJobs = () => {
    axios
      .get("http://localhost:5000/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/delete-job/${id}`,
        {
          headers: { Authorization: token }
        }
      );
      fetchJobs();
    } catch {
      alert("Login required");
    }
  };

  const updateJob = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/update-job/${editingJob._id}`,
        editingJob,
        {
          headers: { Authorization: token }
        }
      );
      setEditingJob(null);
      fetchJobs();
    } catch {
      alert("Login required");
    }
  };

  // 🔎 Search Filtering
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h2>Available Jobs</h2>

      {/* 🔎 Search Bar */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* ✏️ Edit Section */}
      {editingJob && isLoggedIn && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit Job</h3>

          <input
            value={editingJob.title}
            onChange={e =>
              setEditingJob({ ...editingJob, title: e.target.value })
            }
          />
          <br />

          <input
            value={editingJob.company}
            onChange={e =>
              setEditingJob({ ...editingJob, company: e.target.value })
            }
          />
          <br />

          <input
            value={editingJob.location}
            onChange={e =>
              setEditingJob({ ...editingJob, location: e.target.value })
            }
          />
          <br />

          <input
            value={editingJob.description}
            onChange={e =>
              setEditingJob({ ...editingJob, description: e.target.value })
            }
          />
          <br />

          <button onClick={updateJob}>Update</button>
        </div>
      )}

      {/* 📦 Job Cards */}
      <div className="jobs-container">

        {filteredJobs.length === 0 && (
          <p style={{ marginTop: "20px" }}>No jobs found.</p>
        )}

        {filteredJobs.map(job => (
          <div className="job-card" key={job._id}>
            <h3>
              <Link to={`/job/${job._id}`}>
                {job.title}
              </Link>
            </h3>
            <p><b>Company:</b> {job.company}</p>
            <p><b>Location:</b> {job.location}</p>
            <p>{job.description}</p>

            {isLoggedIn && (
              <>
                <button onClick={() => setEditingJob(job)}>
                  Edit
                </button>
                <button onClick={() => deleteJob(job._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

export default Home;