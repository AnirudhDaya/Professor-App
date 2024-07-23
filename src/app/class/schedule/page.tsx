"use client";
// import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableDemo } from "@/components/formatTable";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

import { useRouter } from "next/navigation";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { DatePickerDemo } from "@/components/datepicker";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";


import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Class {
  strength: number;
  name: string; // Assuming strength is a number, adjust the type as necessary
  // Add other properties of cls here if needed
}

const pptType = [
  {
    value: "0",
    label: "Zeroth",
  },
  {
    value: "1",
    label: "First Interim",
  },
  {
    value: "2",
    label: "Second Interim",
  },
  {
    value: "3",
    label: "Final",
  },
  
]

export default function Schedule({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [dateselected, setDate] = React.useState<Date>();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [ppts, setppt] = useState<String[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [open, setOpen] = React.useState(false)
  const [pptvalue, setValue] = React.useState("")
  const class_name = searchParams?.class;
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Schedule" },
  ];
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/login", {
          method: "GET",
        });
        const formdata = new FormData();
        
        formdata.append("batch", class_name as string);
        if (res.status === 200) {
          const val = await res.json();

          const getppt = await fetch(
            "https://pmt-u972l.ondigitalocean.app/get_ppt_types/",
            {
              method: "POST",
              body: formdata
            }
          );
          if (getppt.status === 200) {
            const data = await getppt.json();
            console.log("stoinks",data);
            setppt(data)
          }
          // Optionally, update the class list on the dashboard
        } else {
          toast({
            title: "Message",
            description: "No presentations found!",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    };
    if (typeof window !== "undefined")
      setRole(localStorage.getItem("role") || "");
    fetchSchedule();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    dialogClose();
    // Validate form data here
    // For example, check if name is not empty and picture is selected

    if (!dateselected) {
      toast({
        title: "Look Out!",
        description: "Please pick a date",
        variant: "destructive",
      });
      return;
    }

    
    if(pptvalue.length == 0)
    {
      toast({
        title: "Look Out!",
        description: "Please pick a presentation type",
        variant: "destructive",
      });
      return;
      
    }
    
    if(selectedCheckboxes.length == 0)
    {
      toast({
        title: "Can't schedule this presentation",
        description: "No free slots chosen",
        variant: "destructive",
      });
      return;
    }
    // Submit to API
    try {
      const res = await fetch("/api/login", {
        method: "GET",
      });

      if (res.status === 200) {
        const formdata = new FormData();
        const offset = dateselected.getTimezoneOffset()
        const tempDate = new Date(dateselected.getTime() - (offset*60*1000))
        const chosenDate = dateselected.toISOString().split('T')[0]
        formdata.append("pptType",pptvalue as string);
        formdata.append("available_slots", selectedCheckboxes.toString());
        formdata.append("start_date", chosenDate);
        formdata.append("batch_ref", class_name as string);
        console.log("Eda mone", formdata.get("pptType"));
        console.log("Eda mone", formdata.get("available_slots"));
        console.log("Eda mone", formdata.get("start_date"));
        console.log("Eda mone", formdata.get("batch_ref"));
        const val = await res.json();
        const response = await fetch(
          "https://pmt-u972l.ondigitalocean.app/schedule_gen/",
          {
            method: "POST",
            // headers: {
            //   Authorization: `Token ${val.token.value}`,
            // },
            body: formdata
          }
        );
        if (response.status === 201) {
          const data = await response.json();
          // If a user session exists, redirect to the main page
          toast({
            title: "Successfully submitted",
            description: "Scheduling a presentation now..",
          });

          toast({
            title: "Success",
            description: "Presentation scheduled successfully",
          });
          // Optionally, update the class list on the dashboard
        }
        if(response.status == 500)
         {
          toast({
            title: "Error",
            description: "Failed to create schedule",
            variant: "destructive",
          });
        }
        if(response.status == 400)
         {
          toast({
            title: "Error",
            description: "Error occured",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create schedule",
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

  const handleRoute = (pptName: string) => {
    router.push(`/class/schedule/${pptName}?class=${class_name}`, {
      scroll: false,
    });
  };

  const handleCheckboxChange = (day: any, column: any) => {
    const checkboxId = `${day}${column}`;
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (prevSelectedCheckboxes.includes(checkboxId)) {
        return prevSelectedCheckboxes.filter((id) => id !== checkboxId);
      } else {
        return [...prevSelectedCheckboxes, checkboxId];
      }
    });
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems} />
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ppts.map((ppt) => (
            <Card
              className="cursor-pointer"
              key={ppt as string}
              onClick={() => handleRoute(ppt as string)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ppt}</div>
              </CardContent>
            </Card>
          ))}
         
          {role !== "guide" && (
            <Dialog>
              <DialogTrigger asChild>
                <Card className="col-span-1 bg-blue-500 text-white cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Schedule a presentation
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      Schedule a presentation
                    </div>
                    <p className="text-xs">Click to create a new schedule.</p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a New Schedule</DialogTitle>
                  <DialogDescription>
                    {`Pick a date to begin the presentation. Choose the presentation type. Choose the free hours of the professor.`}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="picture" className="text-right">
                    Date
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !dateselected && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateselected ? (
                          format(dateselected, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateselected}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Presentation Type</Label>
                  <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {pptvalue
            ? pptType.find((pptType) => pptType.value === pptvalue)?.label
            : "Select presentation type..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search ppt Type..." className="h-9" />
          <CommandEmpty>No ppt Type found.</CommandEmpty>
          <CommandGroup>
            {pptType.map((pptType) => (
              <CommandItem
                key={pptType.value}
                value={pptType.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === pptvalue ? "" : currentValue)
                  setOpen(false)
                }}
              >
                {pptType.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    pptvalue === pptType.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
                  </div>
                  {/* <div className="grid grid-cols-4 items-center gap-4"> */}
                  
              <table>
      <thead>
        <tr>
          <th></th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
          <th>6</th>
        </tr>
      </thead>
      <tbody className="">
        <tr>
          <td>Mon</td>
          <td>

            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('11')}
              onChange={() => handleCheckboxChange('1', 1)}
              
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('12')}
              onChange={() => handleCheckboxChange('1', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('13')}
              onChange={() => handleCheckboxChange('1', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('14')}
              onChange={() => handleCheckboxChange('1', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('15')}
              onChange={() => handleCheckboxChange('1', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('16')}
              onChange={() => handleCheckboxChange('1', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Tue</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('21')}
              onChange={() => handleCheckboxChange('2', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('22')}
              onChange={() => handleCheckboxChange('2', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('23')}
              onChange={() => handleCheckboxChange('2', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('24')}
              onChange={() => handleCheckboxChange('2', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('25')}
              onChange={() => handleCheckboxChange('2', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('26')}
              onChange={() => handleCheckboxChange('2', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Wed</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('31')}
              onChange={() => handleCheckboxChange('3', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('32')}
              onChange={() => handleCheckboxChange('3', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('33')}
              onChange={() => handleCheckboxChange('3', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('34')}
              onChange={() => handleCheckboxChange('3', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('35')}
              onChange={() => handleCheckboxChange('3', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('36')}
              onChange={() => handleCheckboxChange('3', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Thu</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('41')}
              onChange={() => handleCheckboxChange('4', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('42')}
              onChange={() => handleCheckboxChange('4', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('43')}
              onChange={() => handleCheckboxChange('4', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('44')}
              onChange={() => handleCheckboxChange('4', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('45')}
              onChange={() => handleCheckboxChange('4', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('46')}
              onChange={() => handleCheckboxChange('4', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Fri</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('51')}
              onChange={() => handleCheckboxChange('5', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('52')}
              onChange={() => handleCheckboxChange('5', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('53')}
              onChange={() => handleCheckboxChange('5', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('54')}
              onChange={() => handleCheckboxChange('5', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('55')}
              onChange={() => handleCheckboxChange('5', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('56')}
              onChange={() => handleCheckboxChange('5', 6)}
            />
          </td>
        </tr>
        {/* Add similar rows for Tuesday, Wednesday, Thursday, and Friday */}
      </tbody>
    </table>

                  {/* </div> */}
                  </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSubmit}
                    >
                      Generate Schedule
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Dialog>
            {/* <DialogTrigger asChild>
              <Card className="col-span-1 bg-orange-600 text-white cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    Update Professor&apos;s schedule
                  </div>
                  <p className="text-xs">
                    Click to create a new or update existing schedule.
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger> */}

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Update professor&apos;s schedule for {class_name}
                </DialogTitle>
                <DialogDescription>
                  {`Check the boxes in which the professor is free.`}
                </DialogDescription>
              </DialogHeader>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr>
                    <td>Mon</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-1")}
                        onChange={() => handleCheckboxChange("Monday", 1)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-2")}
                        onChange={() => handleCheckboxChange("Monday", 2)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-3")}
                        onChange={() => handleCheckboxChange("Monday", 3)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-4")}
                        onChange={() => handleCheckboxChange("Monday", 4)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-5")}
                        onChange={() => handleCheckboxChange("Monday", 5)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Monday-6")}
                        onChange={() => handleCheckboxChange("Monday", 6)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Tue</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-1")}
                        onChange={() => handleCheckboxChange("Tuesday", 1)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-2")}
                        onChange={() => handleCheckboxChange("Tuesday", 2)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-3")}
                        onChange={() => handleCheckboxChange("Tuesday", 3)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-4")}
                        onChange={() => handleCheckboxChange("Tuesday", 4)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-5")}
                        onChange={() => handleCheckboxChange("Tuesday", 5)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Tuesday-6")}
                        onChange={() => handleCheckboxChange("Tuesday", 6)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Wed</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-1")}
                        onChange={() => handleCheckboxChange("Wednesday", 1)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-2")}
                        onChange={() => handleCheckboxChange("Wednesday", 2)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-3")}
                        onChange={() => handleCheckboxChange("Wednesday", 3)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-4")}
                        onChange={() => handleCheckboxChange("Wednesday", 4)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-5")}
                        onChange={() => handleCheckboxChange("Wednesday", 5)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Wednesday-6")}
                        onChange={() => handleCheckboxChange("Wednesday", 6)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Thu</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-1")}
                        onChange={() => handleCheckboxChange("Thursday", 1)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-2")}
                        onChange={() => handleCheckboxChange("Thursday", 2)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-3")}
                        onChange={() => handleCheckboxChange("Thursday", 3)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-4")}
                        onChange={() => handleCheckboxChange("Thursday", 4)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-5")}
                        onChange={() => handleCheckboxChange("Thursday", 5)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Thursday-6")}
                        onChange={() => handleCheckboxChange("Thursday", 6)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Fri</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-1")}
                        onChange={() => handleCheckboxChange("Friday", 1)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-2")}
                        onChange={() => handleCheckboxChange("Friday", 2)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-3")}
                        onChange={() => handleCheckboxChange("Friday", 3)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-4")}
                        onChange={() => handleCheckboxChange("Friday", 4)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-5")}
                        onChange={() => handleCheckboxChange("Friday", 5)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes("Friday-6")}
                        onChange={() => handleCheckboxChange("Friday", 6)}
                      />
                    </td>
                  </tr>
                  {/* Add similar rows for Tuesday, Wednesday, Thursday, and Friday */}
                </tbody>
              </table>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSubmit}
                  >
                    Update Schedule
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
