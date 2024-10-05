import { NextResponse } from "next/server";
import { validateItemData } from "../../../utils/helpers/apiHelpers";
import { verifyJWT, getAuthHeader } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  let items;

  if (search) {
    items = await prisma.item.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  } else if (category) {
    items = await prisma.item.findMany({
      where: {
        category: {
          has: category, // Checks if the category array includes the specified value
        },
      },
    });
  } else {
    items = await prisma.item.findMany();
  }

  return NextResponse.json(items);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        message: "A valid JSON object has to be sent",
      },
      {
        status: 400,
      }
    );
  }
  const token = getAuthHeader(req);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized - You need to be logged in to post an item" },
      { status: 401 }
    );
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized - Invalid or expired token" },
      { status: 401 }
    );
  }
  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    return NextResponse.json(
      {
        message: errors,
      },
      {
        status: 400,
      }
    );
  }

  let newItem;
  try {
    newItem = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: parseInt(body.quantity),
        category: body.category,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid data sent for item creation",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(newItem, {
    status: 201,
  });
}
