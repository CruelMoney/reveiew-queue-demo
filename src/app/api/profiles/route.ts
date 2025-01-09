import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import modApi from "@/lib/modApi";

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

    const analysis = await modApi.moderate.object({
      contentId: profile.id,
      authorId: profile.id,
      value: {
        type: "profile",
        data: {
          username: {
            type: "text",
            value: username,
          },
          bio: {
            type: "text",
            value: bio,
          },
          imageUrl: {
            type: "image",
            value: imageUrl,
          },
        },
      },
    });

    if (analysis.flagged) {
      //do something
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
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
