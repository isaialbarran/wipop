import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const merchantId = process.env.WIPOP_MERCHANT_ID;
    const secretKey = process.env.WIPOP_SECRET_KEY;
    const apiUrl = process.env.WIPOP_API_URL || "https://sandbox-api.wipop.es";

    // Generar token de autorización Basic (sk_key:)
    const authToken = Buffer.from(`${secretKey}:`).toString("base64");

    // Generar order_id con formato requerido: 4 dígitos + 8 alfanuméricos
    const orderId = body.order_id || generateOrderId();

    const checkoutData = {
      amount: body.amount || 1.0,
      description: body.description || "Checkout de prueba",
      send_email: body.send_email || false,
      currency: "EUR",
      origin: "API",
      product_type: "PAYMENT_LINK",
      terminal: {
        id: body.terminal_id || 1,
      },
      redirect_url: body.redirect_url || "https://wipop.vercel.app/",
      order_id: orderId,
      customer: {
        name: body.customer?.name || "Test",
        last_name: body.customer?.last_name || "User",
        email: body.customer?.email || "test@example.com",
        external_id: body.customer?.external_id || 27112025,
      },
    };

    console.log("Enviando checkout a Wipop:", checkoutData);

    const response = await fetch(`${apiUrl}/k/v1/${merchantId}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    });

    const data = await response.json();

    console.log("Respuesta de Wipop:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error en Wipop", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creando checkout:", error);
    return NextResponse.json(
      { error: "Error interno", details: String(error) },
      { status: 500 }
    );
  }
}

// Genera order_id con formato: 4 dígitos + 8 alfanuméricos
function generateOrderId(): string {
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let alphanumeric = "";
  for (let i = 0; i < 8; i++) {
    alphanumeric += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return digits + alphanumeric;
}
