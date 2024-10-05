"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth";

function EditItemForm({
  setRefreshTrigger,
  setNewItem,
  item,
  setShowEditItemForm,
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [quantity, setQuantity] = useState(item?.quantity || "");
  const [category, setCategory] = useState(item?.category || "");
  const [error, setError] = useState("");
  const auth = useAuth();

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const dataBeingSent = {
        name,
        description,
        quantity: quantity,
        category,
      };

      const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(dataBeingSent),
      });

      if (response.ok) {
        const data = await response.json();
        setNewItem(""); // Clear input field
        setRefreshTrigger((prev) => prev + 1); // Increment to trigger re-fetch
        setShowEditItemForm(false);
      } else {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ") // Om array, slå ihop felmeddelandena till en sträng
          : errorData.message || response.statusText; // Annars visa meddelandet eller statusText

        if (response.status === 401) {
          console.error("Unauthorized:", errorMessage);
          setError("You are not authorized to edit this item. Please log in.");
        } else {
          console.error("Failed to save changes to item:", errorMessage);
          setError(errorMessage || "Failed to save changes");
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setError("An unexpected error occured. Please try again!");
    }
  };

  return (
    <div className="item-form-container edit">
      <div className="item-form">
        <form onSubmit={(e) => handleEdit(e)}>
          <div className="form__group">
            <h3>Edit item</h3>
            <label className="col-25">Name:</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder={description}
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            ></input>
          </div>
          <div className="form__group">
            <label className="col-25">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></input>
          </div>
          <button type="submit">Save changes</button>
          <button
            type="reset"
            className="cancel-btn"
            onClick={() => setShowEditItemForm(false)}
          >
            Cancel
          </button>
        </form>
      </div>
      <div className="error-message">{error}</div>
    </div>
  );
}

export default EditItemForm;
