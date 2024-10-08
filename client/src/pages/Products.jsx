import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import HeroPage from "../components/HeroPage";


const Products = () => {
  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Regular expression to remove HTML tags
  };

  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(
          "/api/categories"
        );
        const categories = await categoriesResponse.json();
        setCategories(categories);

        // Fetch products
        const productsResponse = await fetch(
          "/api/products"
        );
        const products = await productsResponse.json();

        // Organize products by category
        const productsMap = {};
        products.forEach((product) => {
          const category = product.category; // Assuming product has a category field
          if (!productsMap[category]) {
            productsMap[category] = [];
          }
          productsMap[category].push(product);
        });

        setProductsByCategory(productsMap);
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <HeroPage heading="Products" />

      <div className="our-products">
        {categories.map((category) => (
          <div key={category._id} className="productbox">
            <h1 className="heading1">{category.name}</h1>
            <hr />
            <div className="productcard">
              {productsByCategory[category.name] &&
              productsByCategory[category.name]?.length > 0 ? (
                productsByCategory[category.name].map((product) => {
                  // Get the first image from the images array
                  var firstImage =
                    product.images && product.images?.length > 0
                      ? product.images[0]
                      : null;
                  
                  if(firstImage){
                    firstImage = `${import.meta.env.VITE_MODE=="prod"? import.meta.env.VITE_PROD_BACKEND:import.meta.env.VITE_DEV_BACKEND}/${firstImage}`;
                  }

                  return (
                    <div className="card" key={product._id}>
                      <img
                        className="productimg"
                        src={
                          firstImage
                            ? `${firstImage}`
                            : undefined
                        } // Display only the first image
                        alt={product.name}
                      />
                      <div className="arrowlink">
                        <Link to={`/product/${product._id}`}>
                          <GoArrowUpRight className="GoArrowUpRight" />
                        </Link>
                      </div>
                      <div className="info">
                        <h3 className="productname">{product.name}</h3>
                        <p className="productdesc">
                          {stripHtmlTags(product.smallDesc)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No products available for this category.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;
