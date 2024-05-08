import Image from "next/image";
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { taskSchema } from "@/data/schema"
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";



interface Class {
  strength: number;
  name: string; 
 }

 async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/data/tasks.json")
  )
  // W:\Projects\professor_app\src\data\tasks.json
  
  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

async function getTasks2(class_name:string) {

  const formdata = new FormData();
  formdata.append("batch", class_name);

  try {
    const response = await fetch(
      "https://proma-ai-uw7kj.ondigitalocean.app/Projects/",
      {
        method: "POST",
        body: formdata,
      }
    );

    const data = await response.json();
    console.log("BAKA MONO", data);

    // Extract the required data from the API response
    const tasks = data.map((project: any) => ({
      id: project.project.id.toString(), // Convert id to string
      title: project.project.title,
      status: project.project.status,
      label: project.project.team, // Assuming 'team' is the label
      priority: 'high', // No priority information in the API response
      teamMembers: project.members, // No team members information in the API response
      abstract: project.project.abstract,
      researchPapers: project.research_papers,
      reports: [], // No reports information in the API response
      guide:  project.project.guide
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export default async function Submissions({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
  // const tasks = await getTasks()
  const tasks = await getTasks2(class_name as string)
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Submissions" },
  ];
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold tracking-tight mb-4">No Submissions Yet</h2>
            <p className="text-muted-foreground mb-6">There are no form submissions for this batch so far.</p>
          </div>
        ) : (
          <>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of all the submissions made by the students!
            </p>
          </div>
        </div>

         <DataTable data={tasks} columns={columns} />  
         </> 
         )}
      </div>
     
    </>
  );
}






// Simulate a database read for tasks.


