import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
const EditCategory = () => {
  return (
    <>
      <div className="dashboard-name">
        <div className="dash-opr-head">
          <h1>
            <Link className="dash-head" to="/product-operation">
              Products Page
            </Link>
            <IoIosArrowForward />
            Edit Category
          </h1>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
