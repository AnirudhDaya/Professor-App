"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { labels } from "../data/data"
import { diarySchema } from "../data/diary-schema"
import { toast } from "./ui/use-toast"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = diarySchema.parse(row.original)
  const handleStatusChange = async (labelValue: string) => {
    const formdata = new FormData();
    formdata.append("diary_id", task.id);
    formdata.append("status", labelValue); // Use the clicked label value here
    try {
      const response = await fetch(
        "https://proma-ai-uw7kj.ondigitalocean.app/ChangeDiaryStatus/",
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await response.json();
      console.log("BAKA MONO", data.message);
      if (response.status == 200) {
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={task.label}>
          {labels.map((label) => (
            <DropdownMenuRadioItem
              key={label.value}
              value={label.value}
              onClick={() => handleStatusChange(label.value)}
            >
              {label.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}