import { NextResponse } from "next/server";

export function validateItemData(data) {
  let errors = [];

  if (data.id && data.id !== item.id) {
    errors.push("Mismatch of ids");
  }

  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required");
  }

  if (!data.description || typeof data.description !== "string") {
    errors.push("Description is required");
  }

  if (!data.quantity || !Number(data.quantity)) {
    errors.push("Enter a quantity");
  }

  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required");
  }

  return [errors.length > 0, errors]; // hasErrors = true, errors = array of messages
}

export async function validateJSONData(req) {
  try {
    const body = await req.json();
    return [false, body];
  } catch (error) {
    return [true, null];
  }
}

export function validateUserData(data) {
  let errors = {};
  if (!data.name || typeof data.name !== "string") {
    errors.name = "Name is required";
  }
  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}

export function object404Response(response, model = "") {
  return NextResponse.json(
    {
      message: "Item not found",
    },
    {
      status: 404,
    }
  );
}
