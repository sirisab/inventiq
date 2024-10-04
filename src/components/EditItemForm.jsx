"use client";

import { useState, useRouter, useEffect } from "react";
import { validateItemData } from "@/utils/helpers/apiHelpers";
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
  const auth = useAuth();

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowEditItemForm(false);

    if (auth.token) {
      try {
        const dataBeingSent = {
          name,
          description,
          quantity: Number(quantity),
          category,
        };

        console.log("Data being sent:", dataBeingSent); // Logga datan som skickas till API:et

        const response = await fetch(`/api/items/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(dataBeingSent),
        });
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);

        if (response.ok) {
          setNewItem(""); // Clear input field
          setRefreshTrigger((prev) => prev + 1); // Increment to trigger re-fetch
          const result = await response.json();
          console.log("Response data:", result); // Logga datan som kom tillbaka från servern
        } else {
          console.error("Failed to save item:", response.statusText);
          const errorData = await response.json();
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    } else {
      alert("You need to log in to edit an item!");
    }
  };

  return (
    <div className="item-form-container">
      <div className="item-form edit">
        <form onSubmit={(e) => handleEdit(e)}>
          <div className="col-25">Name:</div>
          <div className="col-75">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="col-25">Description:</div>
          <div className="col-75">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder={description}
            ></input>
          </div>
          <div className="col-25">Quantity:</div>
          <div className="col-75">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            ></input>
          </div>
          <div className="col-25">Category:</div>
          <div className="col-75">
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
    </div>
  );
}

export default EditItemForm;
