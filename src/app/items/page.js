"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import ItemCard from "@/app/components/ItemCard";
import ItemForm from "@/app/components/ItemForm";
import EditItemForm from "../components/EditItemForm";

export default function CreateItemPage() {
  const [items, setItems] = useState([]);
  let [showItemForm, setShowItemForm] = useState(false);
  let [showEditItemForm, setShowEditItemForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for re-fetching items
  const [newItem, setNewItem] = useState(""); // For the new item being added

  const auth = useAuth();

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/items");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to get items:", error);
      }
    };

    getItems();
  }, [refreshTrigger]);

  const editItem = (itemId) => {
    setEditingItemId(itemId);
    setShowEditItemForm(!showEditItemForm);
  };

  const deleteItem = async (itemId) => {
    const token = localStorage.getItem("@library/token");
    if (!token) {
      alert("You need to log in to delete an item!");
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        alert("Item was deleted");
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <>
      <main>
        <div className="item-form">
          <button
            className="item-form-btn"
            onClick={() => {
              setShowItemForm(!showItemForm);
            }}
          >
            Add Item
          </button>
          {showItemForm && (
            <ItemForm
              setShowItemForm={setShowItemForm}
              setNewItem={setNewItem}
              setRefreshTrigger={setRefreshTrigger}
            />
          )}
          {showEditItemForm && (
            <EditItemForm
              setShowEditItemForm={setShowEditItemForm}
              setNewItem={setNewItem}
              setRefreshTrigger={setRefreshTrigger}
              item={items.find((item) => item.id === editingItemId)}
            />
          )}
        </div>
        <div className="item-list">
          <h2>ITEMS</h2>

          <div className="item-card">
            <div className="itemName bold">Name</div>
            <div className="itemDescription bold">Description</div>
            <div className="itemQuantity bold">Quantity</div>
            <div className="itemCategory bold">Category</div>{" "}
            <div className="itemButtons"></div>
          </div>

          {items &&
            items.map((item, i) => (
              <div className="item-card" key={item.id}>
                <ItemCard {...item} />{" "}
                <div className="itemButtons">
                  <button
                    onClick={() => {
                      editItem(item.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteItem(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
