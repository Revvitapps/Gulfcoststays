/**
 * Page slots to photos. Matthew is shooting Island Retreat himself; until a
 * file lands in public/photos/, each slot renders a branded plate labelled with
 * the shot it wants, so nothing on the site is stock or a grey box.
 *
 * To add a photo: drop `public/photos/<key>.jpg` and set `src` below.
 */
export type Photo = { key: string; label: string; src?: string; alt: string; position?: string; credit?: string };

const slot = (key: string, label: string, alt: string, src?: string): Photo => ({ key, label, alt, src });

export const photos = {
  hero: slot("hero", "Exterior at golden hour, from the courtyard", "Island Retreat, a raised two-bedroom condo on Okaloosa Island"),
  living: slot("living", "Living room toward the windows", "Living room at Island Retreat: a deep sofa, coral lamps, a tall palm by the window", "/photos/living.jpg"),
  kitchen: slot("kitchen", "Kitchen, island forward", "Kitchen at Island Retreat: a long island with stools, a full-size fridge and range", "/photos/kitchen.jpg"),
  dining: slot("dining", "Dining table", "Pub-height dining table for four at Island Retreat", "/photos/dining.jpg"),
  bed1: slot("bed1", "Bedroom two, bed made, lamps on", "Second bedroom at Island Retreat: a made bed, dresser with an arched mirror and a TV", "/photos/bed1.jpg"),
  bed1Tv: slot("bed1Tv", "Bedroom two, TV wall", "Second bedroom TV and dresser at Island Retreat", "/photos/bed1-tv.jpg"),
  bed1Closet: slot("bed1Closet", "Bedroom two, closet", "Second bedroom closet at Island Retreat", "/photos/bed1-closet.jpg"),
  bed2: slot("bed2", "Master bedroom", "Master bedroom at Island Retreat, with its own bathroom through the door", "/photos/bed2.jpg"),
  bath1: slot("bath1", "The master bath", "The master bedroom's own bathroom at Island Retreat", "/photos/bath1.jpg"),
  bath2: slot("bath2", "The hall bath", "Hall bathroom with a tub at Island Retreat", "/photos/bath2.jpg"),
  bed2Closet: slot("bed2Closet", "Master bedroom, dresser and closet", "Master bedroom dresser, TV and closet at Island Retreat", "/photos/bed2-closet.jpg"),
  deck: slot("deck", "Courtyard, stairs and the palm", "The courtyard at Island Retreat: the raised center building, its stairs and the palm", "/photos/courtyard.jpg"),
  parking: slot("parking", "Your spot under the building", "Parking spot under the building, painted Apt 1", "/photos/parking.jpg"),
  tables: slot("tables", "Picnic tables under the building", "Picnic tables in the shade under the raised building", "/photos/tables.jpg"),
  beachWalk: slot("beachWalk", "The beach access across the street", "Blue Dolphin Beachwalk, the public beach access across Santa Rosa Blvd", "/photos/beach-walk.jpg"),
  bayWalk: { ...slot("bayWalk", "The boat basin at sunset", "Okaloosa Island Boat Basin: the new docks and kayak launch on the bay", "/photos/boat-basin.jpg"), credit: "Photo: Okaloosa County" },
  gulfarium: { ...slot("gulfarium", "Gulfarium entrance or dolphin show", "A bottlenose dolphin at Gulfarium Marine Adventure Park", "/photos/gulfarium.jpg"), credit: "Photo: Gulfarium Marine Adventure Park" },
  pier: { ...slot("pier", "Okaloosa Island Pier from the beach", "Okaloosa Island Pier from the sand, Gulf side", "/photos/pier.jpg"), credit: "Photo: Destin-Fort Walton Beach" },
  town: { ...slot("town", "Downtown Fort Walton Beach", "The Indian Temple Mound on Miracle Strip Parkway in downtown Fort Walton Beach", "/photos/temple-mound.jpg"), credit: "Photo: Destin-Fort Walton Beach" },
  food: { ...slot("food", "A fried shrimp basket at Stewby's", "Fried shrimp basket with hushpuppies and fries at Stewby's Seafood Shanty", "/photos/stewbys-shrimp.jpg"), credit: "Photo: Stewby's Seafood Shanty" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Ink-and-watercolor sketches painted from the real photos. Art, not photos, and labelled as such on the page. */
export type Art = { key: string; src: string; alt: string; photo: PhotoKey; title: string };
export const sketches: Art[] = [
  { key: "courtyard", src: "/photos/wc-courtyard.jpg", alt: "Watercolor sketch of the Island Retreat courtyard and the raised center building", photo: "deck", title: "The courtyard" },
  { key: "living", src: "/photos/wc-living.jpg", alt: "Watercolor sketch of the living room", photo: "living", title: "The living room" },
  { key: "kitchen", src: "/photos/wc-kitchen.jpg", alt: "Watercolor sketch of the kitchen and island", photo: "kitchen", title: "The kitchen" },
  { key: "dining", src: "/photos/wc-dining.jpg", alt: "Watercolor sketch of the dining table", photo: "dining", title: "Supper for four" },
  { key: "bed2", src: "/photos/wc-bed2.jpg", alt: "Watercolor sketch of the master bedroom", photo: "bed2", title: "The master bedroom" },
  { key: "bath1", src: "/photos/wc-bath1.jpg", alt: "Watercolor sketch of the master bath", photo: "bath1", title: "The master's own bath" },
  { key: "bed1", src: "/photos/wc-bed1.jpg", alt: "Watercolor sketch of the second bedroom", photo: "bed1", title: "Bedroom two" },
  { key: "bath2", src: "/photos/wc-bath2.jpg", alt: "Watercolor sketch of the hall bath with a tub", photo: "bath2", title: "A hall tub for sandy kids" },
  { key: "tables", src: "/photos/wc-tables.jpg", alt: "Watercolor sketch of the picnic tables under the building", photo: "tables", title: "Picnic tables in the shade" },
  { key: "parking", src: "/photos/wc-parking.jpg", alt: "Watercolor sketch of the parking spot painted Apt 1", photo: "parking", title: "Your spot, painted Apt 1" },
  { key: "beachWalk", src: "/photos/wc-beach-walk.jpg", alt: "Watercolor sketch of Blue Dolphin Beachwalk across Santa Rosa Boulevard", photo: "beachWalk", title: "The beach, across the street" },
  { key: "gulfarium", src: "/photos/wc-gulfarium.jpg", alt: "Watercolor sketch of a dolphin at Gulfarium", photo: "gulfarium", title: "Gulfarium" },
  { key: "pier", src: "/photos/wc-pier.jpg", alt: "Watercolor sketch of Okaloosa Island Pier", photo: "pier", title: "The pier" },
  { key: "bayWalk", src: "/photos/wc-boat-basin.jpg", alt: "Watercolor sketch of the boat basin on the bay", photo: "bayWalk", title: "The boat basin" },
  { key: "town", src: "/photos/wc-temple-mound.jpg", alt: "Watercolor sketch of the Indian Temple Mound downtown", photo: "town", title: "Downtown" },
  { key: "food", src: "/photos/wc-stewbys.jpg", alt: "Watercolor sketch of a fried shrimp basket", photo: "food", title: "Stewby's" },
];
export const sketchFor = (photo: PhotoKey) => sketches.find((a) => a.photo === photo);
/** Every room and corner of the home, in walk-through order. Each shows a sketch with the real photo behind it. */
export const tour = ["courtyard", "living", "kitchen", "dining", "bed2", "bath1", "bed1", "bath2", "tables", "parking", "beachWalk"];
/** Still on the shot list. */
export const stillToShoot: PhotoKey[] = ["hero"];
