"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircleQuestion, X } from "lucide-react";
import { askTree } from "@/lib/ask";
import { upsertContact } from "@/lib/pipeline";
import { contact } from "@/lib/site";

/**
 * Floating "Ask" helper: a scripted tree over the FAQ and rate plan. Anything
 * about a specific stay routes to a human. Opens from the button or from any
 * link to #ask.
 */
export function Ask() {
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState("start");
  const node = askTree[nodeId] ?? askTree.start;

  useEffect(() => {
    const onHash = () => {
      if (location.hash === "#ask") {
        setOpen(true);
        history.replaceState(null, "", location.pathname + location.search);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (next: string) => {
    setNodeId(next);
    if (askTree[next]?.human) void upsertContact({ kind: "ask", note: `Ask → ${next}` });
  };

  return (
    <>
      <button type="button" className="ask-fab" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <MessageCircleQuestion size={20} aria-hidden /> Ask
      </button>
      {open ? (
        <>
          <div className="sheet-backdrop" onClick={() => setOpen(false)} aria-hidden />
          <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="ask-title">
            <div className="sheet-handle" aria-hidden />
            <div className="row between">
              <p id="ask-title" className="eyebrow" style={{ margin: 0 }}>
                Ask Gulf Coast Stays
              </p>
              <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="ask-bubble" style={{ marginTop: "0.75rem" }}>
              <p style={{ margin: 0 }}>{node.prompt}</p>
              {node.human ? (
                <p className="small" style={{ marginTop: "0.5rem" }}>
                  A person answers: <a className="link" href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              ) : null}
            </div>
            {node.action ? (
              <Link href={node.action.href} className="button button-orange button-block" style={{ marginTop: "0.75rem" }} onClick={() => setOpen(false)}>
                {node.action.label}
              </Link>
            ) : null}
            {node.options?.map((o) => (
              <button key={o.label} type="button" className="ask-option" onClick={() => go(o.next)}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
