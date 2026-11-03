/**
 * One lead pipeline for every terminal action (booking request, inquiry, ask
 * handoff). Saved on the device first, then POSTed to /api/pipeline, which
 * forwards to PIPELINE_WEBHOOK_URL when it is set. Never throws.
 */
export type Contact = {
  id: string;
  kind: "booking" | "inquiry" | "ask" | "newsletter";
  name?: string;
  email?: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  note?: string;
  page?: string;
  createdAt: string;
  sent?: boolean;
};

const KEY = "gcs:contacts";

export function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function load(): Contact[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Contact[];
  } catch {
    return [];
  }
}
function save(list: Contact[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
  } catch {}
}

export async function upsertContact(input: Omit<Contact, "id" | "createdAt"> & { id?: string }): Promise<Contact> {
  const contact: Contact = { id: input.id ?? newId(), createdAt: new Date().toISOString(), ...input, page: input.page ?? (typeof location !== "undefined" ? location.pathname : undefined) };
  const list = load().filter((c) => c.id !== contact.id);
  list.push(contact);
  save(list);
  await flush();
  return contact;
}

/** Sends anything not yet delivered. Called on upsert and when the connection returns. */
export async function flush() {
  const list = load();
  let changed = false;
  for (const c of list) {
    if (c.sent) continue;
    try {
      const res = await fetch("/api/pipeline", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(c) });
      if (res.ok) {
        c.sent = true;
        changed = true;
      }
    } catch {
      break; // offline; try again later
    }
  }
  if (changed) save(list);
}

export function myContacts() {
  return load();
}
