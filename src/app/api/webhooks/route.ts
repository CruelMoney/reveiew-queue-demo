import { NextResponse } from "next/server";
import modApi from "@/lib/modApi";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const webhookSignatureHeader = headersList.get("modapi-signature");

    if (!webhookSignatureHeader) {
      return NextResponse.json(
        { error: "No signature header" },
        { status: 400 }
      );
    }

    const payload = await modApi.webhooks.constructEvent(
      Buffer.from(body),
      webhookSignatureHeader,
      process.env.MODAPI_WEBHOOK_SECRET!
    );

    if (payload.action?.key === "remove") {
      const profileId = payload.item.id;
      await prisma.profile.delete({
        where: {
          id: profileId,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 400 }
    );
  }
}
