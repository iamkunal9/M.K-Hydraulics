import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const stripHtmlTags = (html) => {
    return html?.replace(/<\/?[^>]+(>|$)/g, ""); // Regular expression to remove HTML tags
  };

  const progressData = [
    { value: 66, title: "Product Range Expansion" },
    { value: 75, title: "Customer Satisfaction" },
    { value: 80, title: "Innovation in Design" },
    { value: 90, title: "Environmental Compliance" },
    { value: 100, title: "Quality Assurance" },
  ];

  const [recentQueries, setRecentQueries] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [products, setProducts] = useState([]); // Add state for products
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch logged-in user
    setLoggedInUser(localStorage.getItem("loggedInUser"));

    // Fetch recent queries
    fetch("/api/recent-queries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setRecentQueries(data))
      .catch((error) => console.error("Error fetching recent queries:", error));

    // Fetch admin users
    fetch("/api/admin-users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAdminUsers(data))
      .catch((error) => console.error("Error fetching admin users:", error));

    // Fetch products
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="dashboard-name">
        <h1>Welcome {loggedInUser}</h1>
      </div>
      <div className="dashboard-number">
        <div className="progressive-bar">
          {progressData.map((item, index) => (
            <div className="progress-container" key={index}>
              <CircularProgressbar
                value={item.value}
                text={`${item.value}%`}
                styles={buildStyles({
                  pathColor: "#0085ff",
                  textColor: "#0085ff",
                })}
              />
              <p className="progress-title">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="tables-area">
        <div className="recent-queries">
          <h1 className="heading">Recent Queries</h1>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization's Name</th>
              </tr>
            </thead>
            <tbody>
              {recentQueries?.length > 0 ? (
                recentQueries.map((query, index) => (
                  <tr key={index}>
                    <td>{query.name}</td>
                    <td>{query.email}</td>
                    <td>{query.organization}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No recent queries available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-users">
          <h1 className="heading">Admin Users</h1>
          <table className="modern-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers?.length > 0 ? (
                adminUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No admin users available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="product-listing">
          <h1 className="heading">Recent Products</h1>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>Error loading products: {error.message}</p>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Small Description</th>
                </tr>
              </thead>
              <tbody>
                {products?.length > 0 ? (
                  products.map((product) => {
                    // Get the first image from the images array
                    var firstImage =
                      product.images && product.images?.length > 0
                        ? product.images[0]
                        : null;

                    if (firstImage) {
                      firstImage = `${import.meta.env.VITE_MODE=="prod"? import.meta.env.VITE_PROD_BACKEND:import.meta.env.VITE_DEV_BACKEND}/${firstImage}`;
                    }

                    return (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>
                          {firstImage ? (
                            <img
                              src={`${firstImage}`}
                              alt={product.name}
                              className="product-image"
                              style={{ maxWidth: "150px", maxHeight: "150px" }} // Adjust size as needed
                            />
                          ) : (
                            <p>No image available</p>
                          )}
                        </td>
                        <td>{stripHtmlTags(product.smallDesc)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
