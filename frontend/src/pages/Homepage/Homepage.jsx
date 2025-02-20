import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

const Homepage = () => {
  return (
    <Link to={"/feedback"}>
      <Button>Start</Button>
    </Link>
  );
};

export default Homepage;
