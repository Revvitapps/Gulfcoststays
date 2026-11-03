import { quote, type Quote } from "@/lib/rates";

/**
 * Booking adapter boundary. The UI only talks to this interface, so going live
 * on StayOS swaps `mockAdapter` for `stayosAdapter` and nothing above changes.
 */
export type BookingRequest = {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone?: string;
  note?: string;
  source: "direct";
  createdAt: string;
};

export type BookingResult = { status: "requested" | "confirmed"; reference: string; message: string };

export interface BookingAdapter {
  quote(checkIn: string, checkOut: string): Quote;
  availability(checkIn: string, checkOut: string): Promise<"open" | "unknown" | "booked">;
  request(req: BookingRequest): Promise<BookingResult>;
}

/** Quotes from the published plan; availability unknown until StayOS is connected. */
export const mockAdapter: BookingAdapter = {
  quote: (a, b) => quote(a, b),
  availability: async () => "unknown",
  request: async (req) => ({
    status: "requested",
    reference: req.id.slice(0, 8).toUpperCase(),
    message: "Request received. We confirm by email within a few hours, usually faster.",
  }),
};

/** Placeholder for the StayOS direct-booking API (not built yet). */
export const stayosAdapter: BookingAdapter = {
  ...mockAdapter,
  availability: async () => "unknown",
};

export const booking: BookingAdapter = process.env.STAYOS_API_URL ? stayosAdapter : mockAdapter;
