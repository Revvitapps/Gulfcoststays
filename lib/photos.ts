/**
 * Page slots to photos. Matthew is shooting Island Retreat himself; until a
 * file lands in public/photos/, each slot renders a branded plate labelled with
 * the shot it wants, so nothing on the site is stock or a grey box.
 *
 * To add a photo: drop `public/photos/<key>.jpg` and set `src` below.
 */
export type Photo = { key: string; label: string; src?: string; alt: string; position?: string };

const slot = (key: string, label: string, alt: string, src?: string): Photo => ({ key, label, alt, src });

export const photos = {
  hero: slot("hero", "Exterior at golden hour, from the courtyard", "Island Retreat, a raised two-bedroom condo on Okaloosa Island"),
  living: slot("living", "Living room toward the windows", "Living room at Island Retreat"),
  kitchen: slot("kitchen", "Kitchen, counter forward", "Kitchen and dining table at Island Retreat", "/photos/kitchen.jpg"),
  dining: slot("dining", "Dining table", "Pub-height dining table for four at Island Retreat", "/photos/dining.jpg"),
  bed1: slot("bed1", "Bedroom one, bed made, lamps on", "Main bedroom at Island Retreat", "/photos/bed1.jpg"),
  bed1Tv: slot("bed1Tv", "Bedroom one, TV wall", "Main bedroom TV and dresser at Island Retreat", "/photos/bed1-tv.jpg"),
  bed1Closet: slot("bed1Closet", "Bedroom one, closet", "Main bedroom closet at Island Retreat", "/photos/bed1-closet.jpg"),
  bed2: slot("bed2", "Bedroom two", "Second bedroom at Island Retreat", "/photos/bed2.jpg"),
  bed2Closet: slot("bed2Closet", "Bedroom two, dresser and closet", "Second bedroom dresser, TV and closet at Island Retreat", "/photos/bed2-closet.jpg"),
  deck: slot("deck", "Courtyard, stairs and the palm", "The courtyard at Island Retreat: the raised center building, its stairs and the palm", "/photos/courtyard.jpg"),
  parking: slot("parking", "Your spot under the building", "Parking spot under the building, painted Apt 1", "/photos/parking.jpg"),
  tables: slot("tables", "Picnic tables under the building", "Picnic tables in the shade under the raised building", "/photos/tables.jpg"),
  beachWalk: slot("beachWalk", "The beach access across the street", "Blue Dolphin Beachwalk, the public beach access across Santa Rosa Blvd", "/photos/beach-walk.jpg"),
  bayWalk: slot("bayWalk", "The boat basin at sunset", "Okaloosa Island Boat Basin at sunset"),
  gulfarium: slot("gulfarium", "Gulfarium entrance or dolphin show", "Gulfarium Marine Adventure Park"),
  pier: slot("pier", "Okaloosa Island Pier from the beach", "Okaloosa Island Pier"),
  food: slot("food", "A fried shrimp basket at Stewby's", "Seafood basket at a local shanty"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Ink-and-watercolor sketches painted from Matthew's own photos. Art, not photos, and labelled as such on the page. */
export type Art = { key: string; src: string; alt: string; w: number; h: number };
export const sketches: Art[] = [
  { key: "courtyard", src: "/photos/wc-courtyard.jpg", alt: "Watercolor sketch of the Island Retreat courtyard and the raised center building", w: 2752, h: 1536 },
  { key: "beachWalk", src: "/photos/wc-beach-walk.jpg", alt: "Watercolor sketch of Blue Dolphin Beachwalk across Santa Rosa Boulevard", w: 2752, h: 1536 },
  { key: "kitchen", src: "/photos/wc-kitchen.jpg", alt: "Watercolor sketch of the kitchen and dining table", w: 2400, h: 1792 },
  { key: "bed1", src: "/photos/wc-bed1.jpg", alt: "Watercolor sketch of the main bedroom", w: 1792, h: 2400 },
  { key: "tables", src: "/photos/wc-tables.jpg", alt: "Watercolor sketch of the picnic tables and parking under the building", w: 2400, h: 1792 },
];
/** Shot and on the site, in display order. */
export const gallery: PhotoKey[] = ["kitchen", "bed1", "dining", "deck", "bed2", "beachWalk", "bed1Tv", "parking", "tables", "bed2Closet"];
/** Still on Matthew's shot list. Rendered as plates, smaller, below the real photos. */
export const stillToShoot: PhotoKey[] = ["hero", "living", "bayWalk"];
