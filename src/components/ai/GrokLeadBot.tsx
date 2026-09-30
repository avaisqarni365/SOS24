"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, CheckCircle, PhoneCall, Sparkles } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

export default function GrokLeadBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Guten Tag! Ich bin der digitale Sanierungs-Assistent von SOS Abdichtung Wuppertal. Wo haben Sie Feuchtigkeit festgestellt?",
      quickReplies: ["Im Keller", "Im Erdgeschoss", "Schimmelbefall", "Salzausblühungen"]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Context-aware intelligent response
    setTimeout(() => {
      let botResponse = "";
      let replies: string[] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes("keller") || lower.includes("wand")) {
        botResponse = "Feuchte Kellerwände entstehen meist durch aufsteigende Bodenfeuchte oder undichte Wand-Boden-Anschlüsse. Unsere WTA-zertifizierte chemische Injektion stoppt dies dauerhaft ohne Aufgraben. In welcher Stadt bzw. PLZ befindet sich das Objekt?";
        replies = ["42103 Wuppertal", "42651 Solingen", "42853 Remscheid", "42549 Velbert"];
      } else if (lower.includes("schimmel") || lower.includes("sporen")) {
        botResponse = "Schimmel ist ein gesundheitliches Risiko. Herr Mahmood führt eine exakte Ursachenanalyse (Feuchte- & Taupunktmessung) durch. Um welche Räume handelt es sich?";
        replies = ["Schlafzimmer / Wohnraum", "Keller / Vorratsraum", "Badezimmer"];
      } else if (lower.includes("kosten") || lower.includes("preis") || lower.includes("teuer")) {
        botResponse = "Die Sanierungskosten hängen von Mauerwerksart und Laufmetern ab. Eine chemische Horizontalsperre ist meist 60% günstiger als eine Außenaufgrabung. Die Erstbesichtigung & Messung vor Ort ist für Sie unverbindlich. Dürfen wir Sie für einen Termin kontaktieren?";
        replies = ["Ja, bitte Rückruf", "Direkt per WhatsApp"];
      } else if (lower.includes("42") || lower.includes("wuppertal") || lower.includes("solingen") || lower.includes("remscheid")) {
        botResponse = "Hervorragend! Unser Einsatzgebiet deckt Ihren Ort vollständig ab. In Wuppertal und Umgebung sind wir in der Regel innerhalb von 24–48 Stunden vor Ort. Möchten Sie einen Termin vereinbaren?";
        replies = ["Termin vereinbaren", "Rückruf anfordern"];
      } else if (lower.includes("termin") || lower.includes("rückruf") || lower.includes("ja")) {
        botResponse = `Gerne! Bitte hinterlassen Sie uns kurz Ihre Telefonnummer oder rufen Sie Herrn Mahmood direkt an unter ${COMPANY_INFO.phoneDisplay}. Alternativ können Sie uns direkt auf WhatsApp schreiben.`;
        replies = ["WhatsApp öffnen", "Formular ausfüllen"];
      } else if (lower.includes("whatsapp")) {
        window.open(COMPANY_INFO.whatsappUrl, "_blank");
        botResponse = "WhatsApp wurde geöffnet. Wir freuen uns auf Ihre Nachricht!";
      } else {
        botResponse = "Vielen Dank für Ihre Angabe! Für eine verlässliche Sanierungsplanung prüft Herr Mahmood Ihr Anliegen gerne persönlich vor Ort im Raum Wuppertal. Wie können wir Sie am besten erreichen?";
        replies = ["0172 2064177 anrufen", "WhatsApp Chat"];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botResponse,
          quickReplies: replies
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Subtle Attention Bubble */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sand-200 shadow-elevated text-xs text-sand-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>24/7 Sanierungs-Berater online</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-hydro-600 hover:bg-hydro-700 text-white shadow-elevated hover:shadow-glow-hydro transition-all active:scale-95 group"
            aria-label="KI-Sanierungs-Berater öffnen"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-hydro-600 rounded-full"></span>
            </div>
            <span className="text-sm font-semibold">Sanierungs-Check</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-h-[580px] bg-white rounded-3xl border border-sand-200 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Chat Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-hydro-600 to-hydro-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold">SOS Sanierungs-Assistent</h4>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </div>
                <p className="text-[11px] text-hydro-100">Live-Beratung für Raum Wuppertal & PLZ 42</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-sand-50/50 min-h-[300px] max-h-[380px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-hydro-100 border border-hydro-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-hydro-700" />
                  </div>
                )}

                <div className="max-w-[80%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-hydro-600 text-white rounded-br-none"
                        : "bg-white text-sand-800 border border-sand-200 rounded-bl-none shadow-soft"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Quick reply buttons */}
                  {m.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(reply)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-hydro-50 border border-sand-200 hover:border-hydro-300 text-sand-700 hover:text-hydro-700 text-[11px] font-medium transition-all shadow-soft"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-sand-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-sand-700" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-sand-400 pl-9">
                <span className="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct Emergency Call Bar */}
          <div className="px-4 py-2 bg-sand-100/80 border-t border-sand-200 flex items-center justify-between text-[11px]">
            <span className="text-sand-600">Direkter Experten-Kontakt:</span>
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="font-bold text-hydro-700 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              {COMPANY_INFO.phoneDisplay}
            </a>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-sand-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage zu Feuchte, Schimmel oder Kosten..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-sand-50 border border-sand-200 focus:outline-none focus:ring-2 focus:ring-hydro-500 focus:bg-white text-sand-900 placeholder:text-sand-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-hydro-600 hover:bg-hydro-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
