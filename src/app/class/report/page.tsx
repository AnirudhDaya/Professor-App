"use client"

import { columns } from "@/components/columns2"
import { DataTable } from "@/components/data-table"
import { taskSchema } from "@/data/schema"
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";
import { useEffect, useState } from "react";




export default async function Reports({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
  const [fetchedTasks, setFetchedTasks] = useState([]);
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Reports" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasks2(class_name as string);
      setFetchedTasks(tasks);
    };

    fetchData();
  }, []);

  async function getTasks2(class_name:string) {
    const formdata = new FormData();
    formdata.append("batch", class_name);
    formdata.append("role",localStorage.getItem("role") || "coordinator");
    try {
      const res = await fetch("/api/login", {
        method: "GET",
      });
      if (res.status === 200) {
        const val = await res.json();
        const response = await fetch(
          "https://proma-ai-uw7kj.ondigitalocean.app/Projects/",
          {
            method: "POST",
            body: formdata,
          }
        );
    
        const data = await response.json();
        console.log("BAKA MONE", data);
    
        // Extract the required data from the API response
        const tasks = data.map((project: any) => ({
          id: project.project.id.toString(), // Convert id to string
          title: project.project.title, 
          status: project.project.status,
          label: project.project.team, // Assuming 'team' is the label
          priority: 'high', // No priority information in the API response
          teamMembers: project.members, // No team members information in the API response
          // abstract: project.project.abstract,
          // researchPapers: project.research_papers,
          guide: project.project.guide,
          reports: project.reports, // No reports information in the API response
        }));
    
        return tasks;
      }
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        {fetchedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold tracking-tight mb-4">No Reports Yet</h2>
            <p className="text-muted-foreground mb-6">There are no Reports generated for this batch so far.</p>
          </div>
        ) : (
          <>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of all the reports generated!
            </p>
          </div>
        </div>
        <DataTable data={fetchedTasks} columns={columns} />
        </>
        )}
      </div>
     
    </>
  );
}






// Simulate a database read for tasks.


