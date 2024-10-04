"use client";

import { useState, useRouter, useEffect } from "react";
import { validateItemData } from "@/utils/helpers/apiHelpers";
import { useAuth } from "@/context/auth";

const ItemForm = ({ setRefreshTrigger, setNewItem, setShowItemForm }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowItemForm(false);
    if (!auth.token) {
      alert("You need to log in to create an item!");
      return;
    }
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
      } else {
        console.error("Failed to create item:", response.statusText);
      }
      setNewItem(""); // Clear input field
      setRefreshTrigger((prev) => prev + 1); // Increment to trigger re-fetch
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="item-form-container">
      <div className="item-form add">
        <form onSubmit={handleSubmit}>
          <div className="col-25">Name:</div>
          <div className="col-75">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
            ></input>
          </div>
          <div className="col-25">Description:</div>
          <div className="col-75">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
            ></input>
          </div>
          <div className="col-25">Quantity:</div>
          <div className="col-75">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              id="quantity"
            ></input>
          </div>
          <div className="col-25">Category:</div>
          <div className="col-75">
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
    </div>
  );
};

export default ItemForm;
