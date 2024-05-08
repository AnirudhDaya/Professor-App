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
import { taskSchema } from "../data/schema"
import { toast } from "./ui/use-toast"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  dialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [professors, setProfessors] = React.useState<{ value: string; label: string }[]>([]);
  const task = taskSchema.parse(row.original)
  const urlContainsReport = window.location.href.includes("report")
  const handleGuideAssign = async (e: any) => {
    e.preventDefault(); 
    dialogClose();
    try {
      const res = await fetch("/api/login", {
        method: "GET",
      });
      const formdata = new FormData();
      formdata.append("project_id", task.id);
      formdata.append("guide", value);
      if (res.status === 200) {
        const val = await res.json();
        const response = await fetch(
          "https://proma-ai-uw7kj.ondigitalocean.app/GuideAssign/",
          {
            method: "POST",
            // headers: {
            //   Authorization: `Token ${val.token.value}`,
            // },
            body: formdata,
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          // If a user session exists, redirect to the main page
          toast({
            title: "Guide Assigned",
            description: data.message,
          });
          
          // Optionally, update the class list on the dashboard
        } else {
          toast({
            title: "Error",
            description: "Guide not assigned",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create class",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }
  const handleStatusChange = async (labelValue: string) => {
    const formdata = new FormData();
    formdata.append("project_id", task.id);
    formdata.append("status", labelValue); // Use the clicked label value here
    try {
      const response = await fetch(
        "https://proma-ai-uw7kj.ondigitalocean.app/ProjectStatusChange/",
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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://proma-ai-uw7kj.ondigitalocean.app/getTeacherList/', {
          method: 'POST',
        }); // Replace with your API endpoint
        const data = await response.json();
        const professors = data.map((item:any) => ({
          value: item.username,
          label: item.first_name,
        }));
        setProfessors(professors);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchData();
  }, []);

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
        { !urlContainsReport && (
        <Dialog>
      <DialogTrigger asChild>
        <Button>Assign Guide</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign or Reassign a Guide</DialogTitle>
          <DialogDescription>
            Choose a professor to guide the students for this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
         {value
  ? professors.find((professor) => professor.value === value)?.label
  : "Select professor..."}
<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
</Button>
</PopoverTrigger>
<PopoverContent className="w-[400px] p-0">
<Command>
  <CommandInput placeholder="Search professor..." />
  <CommandEmpty>No professor found.</CommandEmpty>
  <CommandGroup>
    {professors.map((professor) => (
      <CommandItem
        key={professor.value}
        value={professor.value}
        onSelect={(currentValue) => {
          setValue(currentValue === value ? "" : currentValue)
          setOpen(false)
        }}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            value === professor.value ? "opacity-100" : "opacity-0"
          )}
        />
        {professor.label}
      </CommandItem>
    ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGuideAssign}
                    >
                      Assign
                    </Button>
                  </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}