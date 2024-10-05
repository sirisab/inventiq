import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import { validateUserData } from "@/utils/helpers/apiHelpers";

const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
export async function POST(req) {
  let body;

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        message: "A valid new user object has to be provided",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { hasErrors, errors } = validateUserData(body);
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

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      });

      const token = await signJWT({
        userId: user.id,
      });

      return NextResponse.json({
        user,
        token,
      });
    } catch (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message || "Internal server error. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
