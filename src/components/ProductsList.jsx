import React, { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe.js library with your publishable API key
const stripePromise = loadStripe('pk_test_51PF3bl066yqkLG8RYxiRV0YScVdjHPvBUA5lw5CcLH5gmoaokyavlaT0q9UwEa6lfCBmkYQ03UwS5QooSVFFrUM700IwNykoKT'); // Replace with your publishable key
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore"; // Import doc and getDoc functions
import "bootstrap/dist/css/bootstrap.min.css";
import HeroSection from "./HeroSection"; // Import HeroSection component

function ProductsList({ setCartItems }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "cart");
      const cartDocRef = doc(cartCollectionRef, "ySrQRpUzgtTfKmSFwqFD");

      const cartDocSnap = await getDoc(cartDocRef);
      if (!cartDocSnap.exists()) {
        await addDoc(cartCollectionRef, { items: [productId] });
      } else {
        await updateDoc(cartDocRef, { items: arrayUnion(productId) });
      }

      console.log("Product added to cart successfully!");

      // Update cart items count
      setCartItems((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="products-container">
      <HeroSection title="Welcome to MJ's Shop" /> {/* Display HeroSection with custom title */}

      <div className="product-grid">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} className="rounded-image" />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <div className="product-buttons">
                  <button
                    className="btn btn-secondary btn-maximize"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Maximize
                  </button>
                  <button
                    className="btn btn-primary btn-sm btn-add-to-cart"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal or Pop-up for selected product */}
      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedProduct(null)}>
              &times;
            </span>
            <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-image" />
            <h2>{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>{selectedProduct.price}</p>
            <button
              className="btn btn-primary"
              onClick={() => handleAddToCart(selectedProduct.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsList;