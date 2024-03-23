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

export default async function Submissions({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
  const tasks = await getTasks()
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Submissions" },
  ];
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of all the submissions made by the students!
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
     
    </>
  );
}






// Simulate a database read for tasks.


