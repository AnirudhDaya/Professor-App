"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { statuses } from "../data/data";
import { Diary } from "@/data/diary-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions-diary";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Link from "next/link";
import { usePathname,useSearchParams } from 'next/navigation';


export const columns: ColumnDef<Diary>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex space-x-2">
          <span className="font-medium whitespace-normal ">
            <Drawer>
              <DrawerTrigger className="underline">
                {row.getValue("date")}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Remarks</DrawerTitle>
                  <DrawerDescription>
                    {row.original.remarks}
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className=" whitespace-normal font-medium">
            {row.original.remarks}
          </span>
        </div>
      );
    },
    
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  
  {
    accessorKey: "diary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diary" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className=" whitespace-normal font-medium">
            <a href={row.original.diary} target="_blank">submission</a>
            
          </span>
        </div>
      );
    },
    
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
