import React, { useState, useEffect } from "react";
import { getAllGigs } from "../api/gigApi";
import GigCard from "./GigCard";

function GigManagement() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const gigs = await getAllGigs();
      if (!gigs || gigs.length === 0) {
        setError("No gigs found. Please try again later.");
      } else {
        setGigs(gigs);
      }
    } catch (err) {
      setError("Failed to fetch gigs. Please check your internet connection or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gigs</h1>
      {loading && <p>Loading gigs...</p>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && gigs.length === 0 && <p>No gigs available.</p>}
      <div className="gig-container">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </div>
  );
}

export default GigManagement;
