export type GalleryItem = {
  title: string;
  category:
    | "Lifestyle"
    | "Travel"
    | "Cars"
    | "Motorcycles"
    | "Coffee"
    | "Workspace"
    | "Photography";
  location: string;
};

export const galleryPage = {
  eyebrow: "Gallery",
  title: "Visual notes without becoming a feed.",
  description:
    "A future home for photography, travel, city moments, workspace details, and the visual side of YusufDere.com.",
} as const;

export const galleryItems: GalleryItem[] = [
  { title: "Coastal evening", category: "Photography", location: "Samsun" },
  { title: "City walk", category: "Travel", location: "Night notes" },
  { title: "Open road", category: "Motorcycles", location: "Weekend route" },
  { title: "Coffee table", category: "Coffee", location: "Workspace" },
  { title: "Desk light", category: "Workspace", location: "Late build" },
  { title: "Street detail", category: "Lifestyle", location: "Everyday" },
  { title: "Car silhouette", category: "Cars", location: "Evening" },
  { title: "Quiet frame", category: "Photography", location: "Archive" },
];
