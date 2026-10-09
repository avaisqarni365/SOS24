"use client";

import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles } from "lucide-react";
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

    setTimeout(() => {
      let botResponse = "";
      let replies: string[] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes("keller") || lower.includes("wand")) {
        botResponse =
          "Feuchte Kellerwände entstehen meist durch aufsteigende Feuchte oder undichte Wand-Boden-Anschlüsse. Eine neue Horizontalsperre per SchimmelPeter-Injektion stoppt das dauerhaft, ohne Aufgraben. In welcher Stadt bzw. PLZ befindet sich das Objekt?";
        replies = ["42103 Wuppertal", "42651 Solingen", "42853 Remscheid", "42549 Velbert"];
      } else if (lower.includes("schimmel") || lower.includes("sporen")) {
        botResponse =
          "Schimmel ist ein gesundheitliches Risiko. Herr Mahmood führt eine exakte Ursachenanalyse (Feuchte- & Taupunktmessung) durch. Um welche Räume handelt es sich?";
        replies = ["Schlafzimmer / Wohnraum", "Keller / Vorratsraum", "Badezimmer"];
      } else if (lower.includes("kosten") || lower.includes("preis") || lower.includes("teuer")) {
        botResponse =
          "Eine chemische Horizontalsperre ist meist bis zu 60% günstiger als eine Außenaufgrabung. Die Erstbesichtigung & Messung vor Ort ist für Sie unverbindlich. Dürfen wir Sie für einen Termin kontaktieren?";
        replies = ["Ja, bitte Rückruf", "Direkt per WhatsApp"];
      } else if (lower.includes("42") || lower.includes("wuppertal") || lower.includes("solingen") || lower.includes("remscheid")) {
        botResponse =
          "Hervorragend! Unser Einsatzgebiet deckt Ihren Ort vollständig ab. In Wuppertal und Umgebung sind wir in der Regel innerhalb von 24 bis 48 Stunden vor Ort. Möchten Sie einen Termin vereinbaren?";
        replies = ["Termin vereinbaren", "Rückruf anfordern"];
      } else if (lower.includes("termin") || lower.includes("rückruf") || lower.includes("ja")) {
        botResponse = `Gerne! Bitte hinterlassen Sie uns kurz Ihre Telefonnummer oder rufen Sie Herrn Mahmood direkt an unter ${COMPANY_INFO.phoneDisplay}. Alternativ können Sie uns direkt auf WhatsApp schreiben.`;
        replies = ["WhatsApp öffnen", "Formular ausfüllen"];
      } else if (lower.includes("whatsapp")) {
        window.open(COMPANY_INFO.whatsappUrl, "_blank");
        botResponse = "WhatsApp wurde geöffnet. Wir freuen uns auf Ihre Nachricht!";
      } else {
        botResponse =
          "Vielen Dank für Ihre Angabe! Für eine verlässliche Sanierungsplanung prüft Herr Mahmood Ihr Anliegen gerne persönlich vor Ort im Raum Wuppertal. Wie können wir Sie am besten erreichen?";
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
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Sanierungs-Assistent öffnen"
          className="fixed bottom-[5.25rem] right-3 z-40 flex h-12 items-center gap-2 rounded-full border border-landing-mint/40 bg-landing-ink px-3 text-landing-bone shadow-xl transition-colors hover:border-landing-mint sm:bottom-6 sm:right-6 sm:px-4"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-landing-mint/20 text-landing-mint">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden text-xs font-semibold sm:inline">Sanierungs-Assistent</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-landing-ink rounded-3xl border border-line/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-landing-ink2 border-b border-line/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-landing-mint/20 text-landing-mint flex items-center justify-center border border-landing-mint/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-landing-bone font-mono flex items-center gap-1.5">
                  <span>Sanierungs-Bot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-landing-mint"></span>
                </h4>
                <p className="text-[10px] text-landing-bone/50 font-mono">
                  <PartnerLink>SchimmelPeter® Partner Wuppertal</PartnerLink>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full text-landing-bone/60 hover:text-[var(--bone)] hover:bg-line/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-landing-ink/90 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-landing-bone text-landing-ink font-medium"
                      : "bg-landing-ink2 text-landing-bone/90 border border-line/10"
                  }`}
                >
                  {m.text}
                </div>

                {m.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.quickReplies.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSend(r)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-landing-ink3 text-landing-mint border border-landing-mint/30 hover:bg-landing-mint/20 transition-colors"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-landing-ink2 border border-line/10 w-fit text-landing-mint text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-landing-mint animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-landing-mint animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-landing-mint animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-landing-ink2 border-t border-line/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ihre Frage zur Sanierung..."
                className="flex-1 px-4 py-2.5 rounded-full bg-landing-ink border border-[var(--line-strong)] text-xs text-landing-bone focus:outline-none focus:border-[var(--focus)] focus:ring-1 focus:ring-[var(--focus)] placeholder:text-landing-bone/30"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-landing-bone text-landing-ink hover:bg-surface flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
