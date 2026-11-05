/**
 * Public copy helper. Facts we do not have yet are written as
 * "[PLACEHOLDER: …]" in the data files so the audit can list them. Customer
 * facing pages must never show those tokens, so they pass copy through pub():
 * the token is removed and whatever real text remains is returned ("" if none).
 */
export const pub = (text: string | undefined | null) => (text ?? "").replace(/\s*\[PLACEHOLDER:[^\]]*\]\s*/g, " ").replace(/\s{2,}/g, " ").trim();
