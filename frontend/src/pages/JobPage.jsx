import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const JobPage = () => {
  const { isAuthenticated } = useContext(AuthContext)

  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteJob = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete job");
      }
      navigate("/");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + jobId
    );
    if (!confirm) return;

    deleteJob(jobId);
  };

  return (
    <div className="job-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{job.title} at {job.company.name}</h2>
          <p>{job.type}</p>

          <p className="description">{job.description}</p>

          {job.location && <p><b>Location:</b> {job.location}</p>}
          {job.salary && <p><b>Salary:</b> {job.salary}</p>}
          {job.status && <p><b>Status:</b> {job.status}</p>}

          <div className="companyDiv">
            <h3>Contact {job.company.name}</h3>
            <p><b>E-mail:</b> {job.company.contactEmail}</p>
            <p><b>Phone:</b> {job.company.contactPhone}</p>
          </div>

          {isAuthenticated && <div className="buttonHolder">
            <button onClick={() => navigate(`/edit-job/${job._id}`)}>
              Edit
            </button>
            <button onClick={() => onDeleteClick(job._id)}>Delete</button>
          </div>}
        </>
      )}
    </div>
  );
};

export default JobPage;
