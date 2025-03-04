import type { UserRole } from "@prisma/client";

export type DataUserRole = Pick<
  UserRole,
  "sequence" | "symbol" | "name" | "description"
>;

export const dataUserRoles: DataUserRole[] = [
  {
    symbol: "Administrator",
    name: "Administrator",
    description: "Users who can manage the entire system and data.",
  },
  {
    symbol: "Dealer Principle",
    name: "Dealer Principle",
    description: "",
  },
  {
    symbol: "General Manager",
    name: "General Manager",
    description: "",
  },
  {
    symbol: "Finance Manager",
    name: "Finance Manager",
    description: "Upsells back end productss.",
  },
  {
    symbol: "Sales Manager",
    name: "Sales Manager",
    description: "",
  },
  {
    symbol: "Accessories Manager",
    name: "Accessories Manager",
    description: "",
  },
  {
    symbol: "Parts Manager",
    name: "Parts Manager",
    description: "",
  },
  {
    symbol: "Service Manager",
    name: "Service Manager",
    description: "",
  },
  {
    symbol: "Sales Person",
    name: "Sales Person",
    description: "Sales associate selling vehicles.",
  },
  {
    symbol: "Accessory Sales Staff",
    name: "Accessory Sales Staff",
    description: "Accessorizing the world one client at a time.",
  },
  {
    symbol: "Parts Sales Staff",
    name: "Parts Sales Staff",
    description: "Parts advisor helping customer while upselling popular products.",
  },
  {
    symbol: "Service Writer",
    name: "Service Writer",
    description: "Service writers, booking in clients for service.",
  },
  {
    symbol: "Technician",
    name: "Technician",
    description: "Fixing clients vehicles as they are brought in.",
  },
  {
    symbol: "Recieving",
    name: "Recieving",
    description: "Manages the incoming products and organizes them for store.",
  },
  {
    symbol: "DEV",
    name: "DEV",
    description: "DEV Staff",
  },
 
  {
    symbol: "Delivery Driver",
    name: "Delivery Driver",
    description: "Delivery Driver.",
  },
  {
    symbol: "Owner",
    name: "Owner",
    description: "Owner",
  },
  {
    symbol: "Office",
    name: "Office",
    description: "Office",
  },
];
