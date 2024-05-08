"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { statuses } from "../data/data";
import { schedule } from "../data/schedule-schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
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
import { useSearchParams } from "next/navigation";

const TaskLink = ({ rowData }:{rowData: any}) => {
  
  const searchParams = useSearchParams();
  const className = searchParams.get('class') || '';
  const id = rowData.id;

  return (
    <a href={`/class/submissions/diary?id=${id}&class=${className}`}>
      {rowData.title}
    </a>
  );
};
export const columns: ColumnDef<schedule>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium whitespace-normal ">
              <TaskLink rowData={row.original} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "teamMembers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Members" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className=" whitespace-normal font-medium">
            {(row.getValue("teamMembers") as string[]).join(", ")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const teamMembers = row.getValue(id) as string[];
      return teamMembers.some(member =>
        member.toLowerCase().includes(value.toLowerCase())
      );
   },
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
              {row.getValue("date")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hour" />
    ),
    cell: ({ row }) => {
      const [hour] = (row.getValue("time") as string).split(", ");
      return (
        <div className="flex space-x-2">
          <span className="font-medium whitespace-normal">{hour}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slot" />
    ),
    cell: ({ row }) => {
      const [, slotNumber] = (row.getValue("time") as string).split(", ");
      return (
        <div className="flex space-x-2">
          <span className="font-medium whitespace-normal">{slotNumber}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
