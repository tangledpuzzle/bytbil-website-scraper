"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Venues = {
  name: string;
  category: string;
  status: string;
  address: string;
  city: string;
  updatedAt: number;
  country: string;
  rating: string;
  eventEntityId: string;
};

export const columns: ColumnDef<Venues>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="2xl:text-xl"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string | "Venue Address";
      const formatted = address;
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="2xl:text-xl"
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="2xl:text-xl"
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rating = row.getValue("rating") as string;
      const formatted = rating;
      return <div className="font-medium text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="2xl:text-xl"
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as number;
      const formatted = new Date(updatedAt).toUTCString();
      return <div className="font-medium">{
        typeof updatedAt === "number" ? formatted : row.getValue("updatedAt")
      }</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      // console.log(row?.original?.eventEntityId);
      const eventEntityId = row?.original?.eventEntityId;
      return (
        <Link
          href={`/dashboard/edit/venue/${eventEntityId}`}
          className="cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-primary">Edit</p>
        </Link>
      );
    },
  },
];
