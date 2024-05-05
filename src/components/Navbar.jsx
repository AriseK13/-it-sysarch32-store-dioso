// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ cartItems }) {
  const [logoHover, setLogoHover] = useState(false);
  const [cartItemsHover, setCartItemsHover] = useState(false);

  const navbarStyle = {
    backgroundColor: "#87CEEB",
    color: "skyblue",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "100%", // Set the width to 100% to occupy the full width
    position: "fixed", // Fixed position to stick the Navbar at the top
    top: 0, // Position the Navbar at the top
    left: 0,
    zIndex: 1000, // Set a higher z-index to ensure it appears above other content
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1580px",
    margin: "0 auto",
  };

  const logoStyle = {
    color: "black",
    textDecoration: "none",
    fontSize: "32px",
    fontWeight: "bold",
    transition: "color 0.3s ease", // Transition color change on hover
  };

  const cartButtonStyle = {
    padding: "20px 40px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#DEB887",
    borderRadius: "16px",
    textDecoration: "none",
    transition: "background-color 0.3s ease", // Transition background color change on hover
  };

  const cartButtonHoverStyle = {
    backgroundColor: "#CC7722", // Change background color to royal blue on hover
  };

  const logoHoverStyle = {
    color: "white", // Change color to white on hover
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        {/* Logo with hover effect */}
        <Link
          to="/"
          style={{ ...logoStyle, ...(logoHover ? logoHoverStyle : {}) }}
          className="logo"
          onMouseEnter={() => setLogoHover(true)} // Set hover state to true on mouse enter
          onMouseLeave={() => setLogoHover(false)} // Set hover state to false on mouse leave
        >
          Flip Shoes
        </Link>
        {/* Cart button with hover effect */}
        <Link
          to="/cart"
          style={{ ...cartButtonStyle, ...(cartItemsHover ? cartButtonHoverStyle : {}) }}
          onMouseEnter={() => setCartItemsHover(true)} // Set hover state to true on mouse enter
          onMouseLeave={() => setCartItemsHover(false)} // Set hover state to false on mouse leave
        >
          Cart ({cartItems})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;