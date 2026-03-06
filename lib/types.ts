export interface Listing {
  id: string;
  title: string;
  city: string;
  district: string;
  priceVnd: number;
  beds: number;
  baths: number;
  areaM2: number;
  image: string;
  propertyType: "Apartment" | "Ground House";
}
