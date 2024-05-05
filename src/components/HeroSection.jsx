// HeroSection.jsx
import React from 'react';

function HeroSection() {
  const heroStyle = {
    backgroundImage: `url('https://st.depositphotos.com/66391244/55820/v/450/depositphotos_558203046-stock-illustration-seamless-pattern-sport-shoe-nike.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    position: 'relative',
    marginBottom: '50px',
    marginTop: '120px',
    borderRadius: '00px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    padding: "16px",
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
  };

  const textStyle = {
    zIndex: 1,
  };

  return (
    <div style={heroStyle}>
      <div style={overlayStyle}></div>
      <div style={textStyle}>
        <h1>Just Do It</h1>
        <p>“If You Don’t Take Risks, You Can’t Create A Future”</p>
        <button
          style={{
            padding: '15px 100px',
            backgroundColor: '#DEB887',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '30px',
            border: 'none',
            borderRadius: '20px',
            marginTop: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease', // Add transition for smooth effect
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#CC7722')} // Light brown on hover
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#DEB887')} // Dark brown when leaving hover
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default HeroSection;