import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, storage } from "../configs/firebase";
import "bootstrap/dist/css/bootstrap.min.css"; // Global styles like Bootstrap
import "./index.css"; // Your custom styles

import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Product({ user }) {
  const { productId } = useParams();

  const [productName, setProductName] = useState("");
  const [productList, setProductList] = useState([]);
  const [message, setMessage] = useState("");

  const productListCollection = collection(db, "product_list");

  useEffect(() => {
    // Fetch the list of products and the product name
    getProductList();
    getProduct(productId);
  }, []);

  // Function to fetch the list of products
  const getProductList = async () => {
    try {
      // Subscribe to real-time updates of the products
      const unsubscribe = onSnapshot(
        query(productListCollection, orderBy("timestamp")),
        (snapshot) => {
          // Map the document data to an array of objects with id
          const updatedProductList = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setProductList(updatedProductList);
        }
      );
      return () => unsubscribe(); // Unsubscribe from real-time updates when component unmounts
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch the product document
  const getProduct = async (productId) => {
    try {
      const productDocRef = doc(db, "products", productId);
      const productDocSnap = await getDoc(productDocRef);
      if (productDocSnap.exists()) {
        const productData = { ...productDocSnap.data(), id: productDocSnap.id };
        setProductName(productData.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to send a message
  const send = async () => {
    try {
      if (message.trim() === "") {
        return;
      }

      // Add a new message to the product
      await addDoc(productListCollection, {
        message,
        senderName: user.displayName ?? user.email,
        senderId: user.uid,
        productId,
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to upload a file
  const fileUpload = async (file) => {
    if (!file) {
      return;
    }

    const storageRef = ref(
      storage,
      `products/${productId}/${Date.parse(new Date())}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Add a new message with the uploaded image to the product
    await addDoc(productListCollection, {
      message,
      senderName: user.displayName ?? user.email,
      senderId: user.uid,
      productId,
      image: downloadURL,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className={styles["product-container"]}>
    <>
      <Link to="/products">Back</Link>
      <h1>{productName}</h1>
      {productList.map((item, index) =>
        item.timestamp ? (
          <div style={{ marginBottom: 15 }} key={index}>
            <b>
              {item.senderName}:<br />{" "}
              {item.image ? (
                <img src={item.image} alt="image" style={{ width: 200 }} />
              ) : (
                item.message
              )}
            </b>
            <br />
            <span>{item.timestamp?.toDate().toLocaleString()}</span>
          </div>
        ) : null
      )}
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send}>Send</button>
      <input type="file" onChange={(e) => fileUpload(e.target.files[0])} />
    </>
    </div>
  );
}

export default Product;