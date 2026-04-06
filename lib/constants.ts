export const NAV_LINKS = [
  { label: "New & Featured", href: "/products?isNew=true" },
  { label: "Men", href: "/products?gender=MENS" },
  { label: "Women", href: "/products?gender=WOMENS" },
  { label: "Kids", href: "/products?gender=KIDS" },
  { label: "Sale", href: "/sale", sale: true },
  { label: "SNKRS", href: "/collections/jordan" },
] as const;

export const US_SIZES = [
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "13",
];
