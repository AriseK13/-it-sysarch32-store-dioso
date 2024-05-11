import React, { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe.js library with your publishable API key
const stripePromise = loadStripe('pk_test_51PF3bl066yqkLG8RYxiRV0YScVdjHPvBUA5lw5CcLH5gmoaokyavlaT0q9UwEa6lfCBmkYQ03UwS5QooSVFFrUM700IwNykoKT'); // Replace with your publishable key

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"; // Import arrayRemove function
import "bootstrap/dist/css/bootstrap.min.css";

function Cart({ setCartItems }) {
  const [cartItems, setLocalCartItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate total price whenever cartItems change
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const cartSnapshot = await getDocs(collection(db, "cart"));
      const cartItemsData = [];

      for (const docRef of cartSnapshot.docs) {
        const itemIds = docRef.data().items; // Assuming 'items' field contains product IDs
        const productPromises = itemIds.map(async (productId) => {
          try {
            const productDoc = await getDoc(doc(db, "products", productId));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              cartItemsData.push({ id: productId, ...productData });
            } else {
              console.error(`Product with ID ${productId} does not exist.`);
            }
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        });

        await Promise.all(productPromises);
      }

      setLocalCartItems(cartItemsData); // Update cartItems state here
      setCartItems(cartItemsData.length); // Update the cart count in the Navbar using the prop
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "cart");
      const cartSnapshot = await getDocs(cartCollectionRef);
      const cartDocRef = cartSnapshot.docs[0].ref; // Assuming there's only one document in the cart collection
      await updateDoc(cartDocRef, { items: arrayRemove(productId) });
      console.log("Product removed from cart successfully!");
      // Refresh cart items after removal
      fetchCartItems();
      // Update cart items count in the Navbar using the prop
      setCartItems((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      // Check if item.price is a string and not null/undefined
      if (typeof item.price === "string") {
        // Attempt to replace '₱' and convert to a float
        const priceWithoutCurrencySign = parseFloat(
          item.price.replace("₱", "")
        );
        // Add the price to the running total
        total += priceWithoutCurrencySign;
      } else {
        console.error(`Invalid price data for item with ID ${item.id}`);
      }
      return total;
    }, 0);

    // Return total price formatted to 2 decimal places
    return totalPrice.toFixed(2);
  };

  const handleClick = async () => {
    const stripe = await stripePromise;
  
    // Send a request to the backend to create a checkout session
    const response = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName, price }), // Send product name and price to the backend
    });
  
    if (response.ok) {
      // If the request is successful, retrieve the session ID from the response
      const session = await response.json();
  
      // Redirect the user to the Stripe Checkout page using the session ID
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
  
      if (result.error) {
        // If there is an error during the redirect, display the error message
        setError(result.error.message);
      }
    } else {
      // If there is an error creating the checkout session, display an error message
      setError('Error creating checkout session');
    }
  };

  // Handle the change event when the user enters a product name
  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  // Handle the change event when the user enters a price
  const handlePriceChange = (event) => {
    setPrice(event.target.value * 100); // Convert price to cents for Stripe
  };

  return (
    <div className="containers">
      <div className="row">
        {/* Left Side: Product Card */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="row">
                      <div className="col-md-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "100%", borderRadius: "5px" }}
                        />
                      </div>
                      <div className="col-md-9">
                        <h6>{item.title}</h6>
                        <p>{item.description}</p>
                        <p>{item.price}</p>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Right Side: Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: ₱{calculateTotalPrice()}</p>
              <button className="btn btn-primary" onClick={handleClick}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;