import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, bio, imageUrl } = body;

    if (!username || !bio || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        username,
        bio,
        imageUrl,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Error creating profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Error fetching profiles" },
      { status: 500 }
    );
  }
}
