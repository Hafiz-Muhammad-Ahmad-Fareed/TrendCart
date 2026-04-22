import React from "react";
import { Outlet } from "react-router-dom";

const CategoriesLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CategoriesLayout;
