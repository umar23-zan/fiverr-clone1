import React, { useState, useEffect } from "react";
import { getAllGigs} from "../api/gigApi";
import GigCard from "./GigCard";

function GigManagement() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    const gigs = await getAllGigs();
    setGigs(gigs);
  };


  return (
    <div>
      <h1>Gigs</h1>
      <div className="gig-container">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
      </div>
    </div>
  );
}

export default GigManagement;
