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
  kitchen: slot("kitchen", "Kitchen, counter forward", "Kitchen at Island Retreat"),
  bed1: slot("bed1", "Bedroom one, bed made, lamps on", "Main bedroom at Island Retreat"),
  bed2: slot("bed2", "Bedroom two", "Second bedroom at Island Retreat"),
  deck: slot("deck", "Deck or stairs with the breeze in the palms", "Stairs and deck at Island Retreat"),
  beachWalk: slot("beachWalk", "The walk to the beach access across the street", "Public beach access across Santa Rosa Blvd"),
  bayWalk: slot("bayWalk", "The boat basin at sunset", "Okaloosa Island Boat Basin at sunset"),
  gulfarium: slot("gulfarium", "Gulfarium entrance or dolphin show", "Gulfarium Marine Adventure Park"),
  pier: slot("pier", "Okaloosa Island Pier from the beach", "Okaloosa Island Pier"),
  food: slot("food", "A fried shrimp basket at Stewby's", "Seafood basket at a local shanty"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
export const gallery: PhotoKey[] = ["hero", "living", "kitchen", "bed1", "bed2", "deck", "beachWalk", "bayWalk"];
