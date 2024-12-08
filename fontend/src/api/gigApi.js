export const getGigs = async () => {
  const res = await fetch("/api/gigs/freelancer/123"); // Example freelancerId
  return res.json();
};

export const createGig = async (gig) => {
  const res = await fetch("/api/gigs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gig),
  });
  return res.json();
};

export const deleteGig = async (id) => {
  await fetch(`/api/gigs/${id}`, { method: "DELETE" });
};
