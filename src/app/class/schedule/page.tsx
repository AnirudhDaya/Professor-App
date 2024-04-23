"use client";
// import { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MainNav } from "@/components/main-nav";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { UserNav } from "@/components/user-nav";
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
import Link from "next/link";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { Checkbox } from "@radix-ui/react-checkbox";
import { DatePickerWithRange } from "@/components/range-calendar";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// };
interface Class {
  strength: number;
  name: string; // Assuming strength is a number, adjust the type as necessary
  // Add other properties of cls here if needed
 }

export default function Schedule({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
  });
  const class_name = searchParams?.class
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Schedule" },
  ];
  useEffect( () => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/login", {
          method: "GET",
        });
  
        if (res.status === 200) {
          const val  = await res.json();
            const getClasses = await fetch(
              "https://proma-ai-uw7kj.ondigitalocean.app//",
              {
                method: "POST",
                headers: {
                  Authorization: `Token ${val.token.value}`,
                },
              }
            );
            if (getClasses.status === 200) {
              const data = await getClasses.json();
              setClasses(data);
            }
            // Optionally, update the class list on the dashboard
          } else {
            toast({
              title: "Message",
              description: "No classes found!",
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
    if (typeof window !== 'undefined')
      setRole(localStorage.getItem('role') || "");
    fetchSchedule();
  },[]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    dialogClose();
    // Validate form data here
    // For example, check if name is not empty and picture is selected
    if (!formData.name || !formData.picture) {
      toast({
        title: "Look Out!",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Create FormData object
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("class", formData.name);
    formDataToSubmit.append("csv_file", formData.picture);

    // Submit to API
    try {
      const res = await fetch("/api/login", {
        method: "GET",
      });

      if (res.status === 200) {
        const val = await res.json();
        console.log("PUTA MADRE", formDataToSubmit.get("picture"));
        const response = await fetch(
          "https://proma-ai-uw7kj.ondigitalocean.app//",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${val.token.value}`,
            },
            body: formDataToSubmit,
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          // If a user session exists, redirect to the main page
          toast({
            title: "Class Created",
            description: "Class created successfully",
          });
          
          // Optionally, update the class list on the dashboard
        } else {
          toast({
            title: "Message",
            description: "No classes found!",
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

  const handleRoute = (className: string) => {
        router.push(`/class?name=${className}`, { scroll: false });
  }

  const handleCheckboxChange = (day:any, column:any) => {
    const checkboxId = `${day}-${column}`;
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
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {classes.map((cls) => (
              
                <Card className="cursor-pointer" key={cls.name} onClick={()=>handleRoute(cls.name)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cls.name }</div>
                    <p className="text-xs text-muted-foreground">
                    {`${cls.strength} students`}
                    </p>
                  </CardContent>
                </Card>
             
            ))}
            {role !== 'guide' && (
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
                    <div className="text-2xl font-bold">Schedule a presentation</div>
                    <p className="text-xs">
                      Click to create a new schedule.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a New Schedule</DialogTitle>
                  <DialogDescription>
                    {`Pick a date to begin the presentation`}
                  </DialogDescription>
                </DialogHeader>
                
    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                      Date
                    </Label>
                    
                      <DatePickerWithRange/>
                  </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSubmit}
                    >
                      Schedule
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="col-span-1 bg-orange-600 text-white cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    {/* <CardTitle className="text-sm font-medium">
                      Update Professor&apos;s schedule
                    </CardTitle> */}
                    {/* <svg
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
                    </svg> */}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">Update Professor&apos;s schedule</div>
                    <p className="text-xs">
                      Click to create a new or update existing schedule.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update professor&apos;s schedule for {class_name}</DialogTitle>
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
              checked={selectedCheckboxes.includes('Monday-1')}
              onChange={() => handleCheckboxChange('Monday', 1)}
              
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-2')}
              onChange={() => handleCheckboxChange('Monday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-3')}
              onChange={() => handleCheckboxChange('Monday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-4')}
              onChange={() => handleCheckboxChange('Monday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-5')}
              onChange={() => handleCheckboxChange('Monday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-6')}
              onChange={() => handleCheckboxChange('Monday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Tue</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-1')}
              onChange={() => handleCheckboxChange('Tuesday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-2')}
              onChange={() => handleCheckboxChange('Tuesday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-3')}
              onChange={() => handleCheckboxChange('Tuesday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-4')}
              onChange={() => handleCheckboxChange('Tuesday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-5')}
              onChange={() => handleCheckboxChange('Tuesday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-6')}
              onChange={() => handleCheckboxChange('Tuesday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Wed</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-1')}
              onChange={() => handleCheckboxChange('Wednesday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-2')}
              onChange={() => handleCheckboxChange('Wednesday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-3')}
              onChange={() => handleCheckboxChange('Wednesday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-4')}
              onChange={() => handleCheckboxChange('Wednesday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-5')}
              onChange={() => handleCheckboxChange('Wednesday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-6')}
              onChange={() => handleCheckboxChange('Wednesday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Thu</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-1')}
              onChange={() => handleCheckboxChange('Thursday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-2')}
              onChange={() => handleCheckboxChange('Thursday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-3')}
              onChange={() => handleCheckboxChange('Thursday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-4')}
              onChange={() => handleCheckboxChange('Thursday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-5')}
              onChange={() => handleCheckboxChange('Thursday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-6')}
              onChange={() => handleCheckboxChange('Thursday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Fri</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-1')}
              onChange={() => handleCheckboxChange('Friday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-2')}
              onChange={() => handleCheckboxChange('Friday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-3')}
              onChange={() => handleCheckboxChange('Friday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-4')}
              onChange={() => handleCheckboxChange('Friday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-5')}
              onChange={() => handleCheckboxChange('Friday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-6')}
              onChange={() => handleCheckboxChange('Friday', 6)}
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
