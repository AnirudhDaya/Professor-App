import Image from "next/image";
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"

import { columns } from "@/components/diary-columns"
import { DataTable } from "@/components/data-table"
import { diarySchema } from "@/data/diary-schema"
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

  return z.array(diarySchema).parse(tasks)
}

async function getTasks2(class_name:string) {
//what is needed
// id: string;
//     title: string;
//     status: string;
//     label: string;
//     priority: string;
//     teamMembers: string[];
//     abstract?: string | undefined;
//     researchPapers?: string[] | undefined;
//     reports?: string[] | undefined;
// what is given by the API
  // {
  //   project: {
  //     id: 1,
  //     title: 'Ai Project Management Tool',
  //     abstract: 'https://blr1.digitaloceanspaces.com/pmt-bucket/pmt/abstracts/ChatGPT_Prompt_Patterns_for_Improving_Code_Quality_Refactoring_Requirements_Elicitation_and_Software_Design.pdf?AWSAccessKeyId=DO004T9FL282WA3V6GAJ&Signature=zma5G347sIaQWZLfMlWZG7QXzqU%3D&Expires=1713859752',
  //     status: 'InProgress',
  //     team: '2B10B2',
  //     coordinator: 1,
  //     guide: 1,
  //     batch: 2
  //   },
  //   research_papers: []
  // },
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
      date: "today",
      status: project.project.status,
      priority: 'high', // No priority information in the API response
      diary: "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024",
      remarks: "shit",
      label: project.project.team
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
//   const tasks = await getTasks()
  const tasks = await getTasks2(class_name as string)
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?class=${class_name}` },
    { label: "Submissions", href:`/class/submissions?class=${class_name}` },
    {label: "Diary"}
  ];
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Diary</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of the weekly diary submitted by !
            </p>
          </div>
        </div>
         <DataTable data={tasks} columns={columns} />   
      </div>
     
    </>
  );
}






// Simulate a database read for tasks.

