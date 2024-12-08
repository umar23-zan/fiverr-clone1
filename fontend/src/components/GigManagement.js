import React, { useState, useEffect } from "react";
import { getGigs, createGig, deleteGig } from "../api/gigApi";

function GigManagement() {
  const [gigs, setGigs] = useState([]);
  const [newGig, setNewGig] = useState({ title: "", price: "", category: "" });

  useEffect(() => {
    getGigs().then(setGigs);
  }, []);

  const handleCreateGig = async () => {
    const gig = await createGig(newGig);
    setGigs([...gigs, gig]);
    setNewGig({ title: "", price: "", category: "" });
  };

  const handleDeleteGig = async (id) => {
    await deleteGig(id);
    setGigs(gigs.filter((gig) => gig._id !== id));
  };

  return (
    <div>
      <h3>Manage Gigs</h3>
      <ul>
        {gigs.map((gig) => (
          <li key={gig._id}>
            {gig.title} - ${gig.price}
            <button onClick={() => handleDeleteGig(gig._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Gig Title"
        value={newGig.title}
        onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newGig.price}
        onChange={(e) => setNewGig({ ...newGig, price: e.target.value })}
      />
      <button onClick={handleCreateGig}>Add Gig</button>
    </div>
  );
}

export default GigManagement;
