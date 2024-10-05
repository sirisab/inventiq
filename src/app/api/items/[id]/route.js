import { NextResponse } from "next/server";
import {
  object404Response,
  validateItemData,
  validateJSONData,
} from "@/utils/helpers/apiHelpers";
import { verifyJWT, getAuthHeader } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(options) {
  const id = options.params.id;

  try {
    const item = await prisma.item.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return object404Response(NextResponse, "Item");
  }
}

export async function PUT(req, options) {
  const id = options.params.id;
  const token = getAuthHeader(req);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized - You need to be logged in to edit an item" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized - Invalid token format" },
      { status: 401 }
    );
  }

  // Validera JSON-data från request
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    console.error("Invalid JSON object received");
    return NextResponse.json(
      {
        message: "Invalid JSON object",
      },
      {
        status: 400,
      }
    );
  }

  // Validera item-data
  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    console.error("Item validation errors:", errors.join(", "));
    return NextResponse.json(
      {
        message: errors.join(", "),
      },
      {
        status: 400,
      }
    );
  }

  try {
    const updatedItem = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        description: body.description,
        quantity: Number(body.quantity),
        category: body.category,
      },
    });

    return NextResponse.json(
      updatedItem,
      {
        message: "Item successfully updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating item:", error.message);
    return NextResponse.json(
      { message: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, options) {
  const token = getAuthHeader(req);
  const itemId = options.params.id;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized – You need to be logged in to delete an item." },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized - Invalid token format" },
      { status: 401 }
    );
  }
  const item = await prisma.item.findUnique({
    where: { id: Number(itemId) },
  });

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  try {
    await prisma.item.delete({
      where: { id: Number(itemId) },
    });

    return NextResponse.json(
      { message: "Item successfully deleted" },
      { status: 200 } // 200 för att signalera att objektet raderades
    );
  } catch (error) {
    console.error("Error deleting item:", error.message);

    return NextResponse.json(
      {
        message: "Failed to delete item",
      },
      {
        status: 500,
      }
    );
  }
}
