"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth";

const ItemForm = ({ setRefreshTrigger, setNewItem, setShowItemForm }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!auth.token) {
    //   alert("You need to log in to create an item!");
    //   return;
    // }

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          quantity,
          category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewItem(""); // Clear input field
        setRefreshTrigger((prev) => prev + 1); // Increment to trigger re-fetch
        setShowItemForm(false);
      } else {
        const errorData = await response.json(); // Få detaljer om felet

        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ") // Om array, slå ihop felmeddelandena till en sträng
          : errorData.message || response.statusText; // Annars visa meddelandet eller statusText

        if (response.status === 401) {
          console.error("Unauthorized:", errorMessage);
          setError("You are not authorized to create an item. Please log in.");
        } else {
          console.error("Failed to create item:", errorMessage);
          setError(errorMessage || "Failed to create item");
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setError("An unexpected error occured. Please try again!");
    }
  };

  return (
    <div className="item-form-container add">
      <div className="item-form">
        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <h3>Add item</h3>
            <label className="col-25">Name:</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              id="quantity"
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="category"
            ></input>
          </div>
          <button type="submit">Add Item</button>
          <button
            type="reset"
            className="cancel-btn"
            onClick={() => setShowItemForm(false)}
          >
            Cancel
          </button>
        </form>
      </div>
      <div className="error-message">{error}</div>
    </div>
  );
};

export default ItemForm;
