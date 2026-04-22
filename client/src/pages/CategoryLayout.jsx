import React from "react";
import { Outlet } from "react-router-dom";

const CategoryLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CategoryLayout;
