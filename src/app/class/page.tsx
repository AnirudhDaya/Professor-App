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
import { useRouter, useSearchParams } from "next/navigation";
import { Meteors } from "@/components/ui/meteors";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// };
interface Class {
  strength: number;
  name: string; // Assuming strength is a number, adjust the type as necessary
  // Add other properties of cls here if needed
}

export default function Class() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleClick = (type: string) => {
        router.push(`/class/${type}?class=${searchParams.get('name')}`)
  }
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
      
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Dashboard {searchParams.get("name")}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer" onClick={()=>handleClick("submissions")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                
                {/* <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle> */}
                
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Submissions</div>
                <p className="text-xs text-muted-foreground">
                  View all the form submissions
                  
                </p>
              
              </CardContent>
            </Card>
            <Card className="cursor-pointer" onClick={()=>handleClick("schedule")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                
              
                  
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Schedule</div>
                <p className="text-xs text-muted-foreground">
                  Schedule presentations and more 
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer" onClick={()=>handleClick("reports")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Reports</div>
                <p className="text-xs text-muted-foreground">
                  View detailed reports
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}