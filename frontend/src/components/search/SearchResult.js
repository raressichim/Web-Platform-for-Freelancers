import React from "react";
import { useLocation } from "react-router-dom";
import GigCard from "../Gig/GigCard";

const SearchResults = () => {
  const location = useLocation();
  const { gigs } = location.state || { gigs: [] }; // If there's no state, default to an empty array

  if (!gigs.length) {
    return <div>No gigs found.</div>;
  }

  return (
    <div>
      {gigs.map((gig) => (
        <GigCard
          key={gig.id}
          title={gig.title}
          photo={gig.photo}
          seller={gig.owner.user}
          id={gig.id}
        />
      ))}
    </div>
  );
};

export default SearchResults;
