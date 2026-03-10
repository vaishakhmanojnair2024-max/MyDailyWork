import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Replace this with your actual API call if needed
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) return <h2>Loading...</h2>;

  return (
    <div className="container">
      <div className="job-card">
        <h2>{job.title}</h2>
        <p><b>Company:</b> {job.company}</p>
        <p><b>Location:</b> {job.location}</p>
        <p>{job.description}</p>

        <button
          onClick={() => window.location.href = `/apply/${job._id}`}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetail;