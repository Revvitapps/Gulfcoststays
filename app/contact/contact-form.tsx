"use client";
import { useState } from "react";
import { upsertContact } from "@/lib/pipeline";
import { track } from "@/lib/analytics";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !note.trim()) return setState("error");
    setState("busy");
    await upsertContact({ kind: "inquiry", name, email, note });
    track("contact_submit");
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="card card-sea">
        <h3>Sent</h3>
        <p style={{ margin: 0 }}>Thanks, {name || "friend"}. We&apos;ll reply to {email} soon.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="card grid" noValidate>
      <label className="field"><span>Name</span><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="field"><span>Email</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label className="field"><span>Message</span><textarea value={note} onChange={(e) => setNote(e.target.value)} required /></label>
      {state === "error" ? <p className="notice notice-err" role="alert">Add a working email and a message.</p> : null}
      <button type="submit" className="button button-orange" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send"}</button>
    </form>
  );
}
