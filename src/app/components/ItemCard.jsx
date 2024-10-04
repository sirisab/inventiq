"use client";

function ItemCard({ name, description, quantity, category }) {
  return (
    <>
      <div className="itemName">{name}</div>
      <div className="itemDescription">{description}</div>
      <div className="itemQuantity">{quantity}</div>
      <div className="itemCategory">{category}</div>
    </>
  );
}

export default ItemCard;
