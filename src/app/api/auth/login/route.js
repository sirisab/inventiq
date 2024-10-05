import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  let body;

  try {
    body = await req.json();
    console.log(body);

    if (!body.email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        {
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      console.log(body.password, user.password);
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 } // Unauthorized status
      );
    }

    // Om lösenordet är korrekt, fortsätt logiken
    const token = await signJWT({
      userId: user.id,
    });

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    // Hantera oväntade fel
    return NextResponse.json(
      {
        message: "Something went wrong, try again",
      },
      {
        status: 500,
      }
    );
  }
}
