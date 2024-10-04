import { NextResponse } from "next/server";

export function validateItemData(data) {
  let errors = {};
  if (data.id && data.id !== item.id) {
    errors.id = "Mismatch of ids";
  }
  if (!data.name || typeof data.name !== "string") {
    errors.name = "Name is required";
  }
  if (!data.description || typeof data.description !== "string") {
    errors.description = "Description is required";
  }
  if (!data.quantity || !Number(data.quantity)) {
    errors.quantity = "Enter a quantity";
  }

  if (!data.category || typeof data.category !== "string") {
    errors.category = "Category is required";
  }
  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}

export async function validateJSONData(req) {
  try {
    const body = await req.json();
    return [false, body];
  } catch (error) {
    return [true, null];
  }
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
