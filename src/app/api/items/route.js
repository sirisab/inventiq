import { NextResponse } from "next/server";
import { validateItemData } from "../../../utils/helpers/apiHelpers";
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
    console.log("Received body:", body);
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
    console.log(error.message);
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

// export async function DELETE(options) {
//   const id = options.params.id;

//   try {
//     await prisma.item.delete({
//       where: { id: Number(id) },
//     });
//     return new Response(null, {
//       status: 204,
//     });
//   } catch (error) {
//     return object404Response(NextResponse, "Item");
//   }
// }
