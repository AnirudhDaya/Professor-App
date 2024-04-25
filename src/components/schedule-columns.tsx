"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { statuses } from "../data/data";
import { Task } from "../data/schema";
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
export const columns: ColumnDef<Task>[] = [
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
            <Drawer>
              <DrawerTrigger className="underline">
                {row.getValue("title")}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Documents Uploaded</DrawerTitle>
                  <DrawerDescription>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] ">Document</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Abstract</TableCell>
                          <TableCell className="italic">
                            <a href={row.original.abstract} target="_blank">Open Abstract</a>
                            </TableCell>
                        </TableRow>
                         {/* Check if researchPapers is defined and is an array */}
  {Array.isArray(row.original.researchPapers) && (
    // Mapping through research papers and creating a new TableRow for each paper
    (row.original.researchPapers as string[]).map((paper: string, index: number) => (
      <TableRow key={index}>
        <TableCell className="font-medium">Paper {index + 1}:</TableCell>
        <TableCell className="italic">
        <a href={paper} target="_blank">Open Paper {index +1}</a>
        </TableCell>
      </TableRow>
    ))
  )}
                      </TableBody>
                    </Table>
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
