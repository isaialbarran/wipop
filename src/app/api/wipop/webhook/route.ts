import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();

  try {
    console.log("Wipop webhook received:", body);
    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ message: "Wipop webhook active" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
