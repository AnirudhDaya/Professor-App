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

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// };
interface Class {
  strength: number;
  name: string; // Assuming strength is a number, adjust the type as necessary
  // Add other properties of cls here if needed
 }

export default function DashboardPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
  });

  
  useEffect( () => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/login", {
          method: "GET",
        });
  
        if (res.status === 200) {
          const val  = await res.json();
            const getClasses = await fetch(
              "https://pmt-inajc.ondigitalocean.app/get_classes/",
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
    fetchClasses();
  },[]);

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, picture: e.target.files[0] });
  };

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
          "https://pmt-inajc.ondigitalocean.app/create_class/",
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
  return (
    <>
     
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
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

            <Dialog>
              <DialogTrigger asChild>
                <Card className="col-span-1 bg-blue-500 text-white cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Add new Class
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
                    <div className="text-2xl font-bold">Add new Class</div>
                    <p className="text-xs">
                      Click to add a new class to your dashboard.
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a New Class</DialogTitle>
                  <DialogDescription>
                    {`Upload the CSV in the format given below. Click submit when
                    you&aposre done.`}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Class Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="R8B"
                      className="col-span-3"
                      // value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture" className="text-right">
                      Upload
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="text/csv"
                      className="col-span-3"
                      onChange={handleFileChange}
                    />
                  </div>
                  <TableDemo />
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                      </div> */}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSubmit}
                    >
                      Add
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
