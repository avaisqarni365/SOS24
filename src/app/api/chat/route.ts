import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages?.[messages.length - 1]?.content || "";

    // If GROK_API_KEY is configured in environment, call xAI Grok API:
    if (process.env.GROK_API_KEY) {
      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROK_API_KEY}`
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            {
              role: "system",
              content: "Du bist der freundliche, fachlich versierte digitale Sanierungs-Assistent von 'sos-abdichtung', einem offiziellen SchimmelPeter Partnerbetrieb geleitet von Shahzad Mahmood in Wuppertal (PLZ 42). Deine Aufgabe ist es, Hauseigentümer und Mieter im Bergischen Land zu beraten bei feuchten Kellerwänden, Schimmelbefall und Horizontalsperren. Halte deine Antworten prägnant, hilfreich und empfehle stets die kostenlose Vor-Ort-Feuchtigkeitsmessung durch Herrn Mahmood."
            },
            ...messages
          ]
        })
      });

      if (grokResponse.ok) {
        const data = await grokResponse.json();
        return NextResponse.json({
          reply: data.choices?.[0]?.message?.content || "Vielen Dank für Ihre Nachricht."
        });
      }
    }

    // Default intelligent diagnostic fallback
    return NextResponse.json({
      reply: "Vielen Dank für Ihre Nachricht! Herr Shahzad Mahmood von sos-abdichtung prüft Ihr Anliegen im Raum Wuppertal gerne persönlich vor Ort. Sie erreichen uns direkt telefonisch unter +49 172 2064177 oder per WhatsApp."
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Chatbot-Dienst temporär nicht erreichbar." },
      { status: 500 }
    );
  }
}
