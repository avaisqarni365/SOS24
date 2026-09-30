import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, email, plzCity, damageType, message } = data;

    if (!name || !phone || !plzCity) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder (Name, Telefon, PLZ) aus." },
        { status: 400 }
      );
    }

    // Structured lead object ready for email dispatch or CRM archiving
    const leadPayload = {
      receivedAt: new Date().toISOString(),
      leadData: {
        name,
        phone,
        email: email || "Keine E-Mail angegeben",
        plzCity,
        damageType,
        message: message || "Keine zusätzlichen Details",
      },
      recipient: "s.mahmood@schimmelpeter.de",
      source: "sos-abdichtung Wuppertal Website"
    };

    console.log("[LEAD RECEIVED]", JSON.stringify(leadPayload, null, 2));

    // If an email service like Resend, Sendgrid or Nodemailer is configured via ENV:
    // e.g., if (process.env.RESEND_API_KEY) { await resend.emails.send(...) }

    return NextResponse.json({
      success: true,
      message: "Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt."
    });
  } catch (error: any) {
    console.error("[LEAD API ERROR]", error);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Verarbeiten der Anfrage." },
      { status: 500 }
    );
  }
}
