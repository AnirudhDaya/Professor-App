"use client"
import { usePathname } from 'next/navigation';
import { columns } from "@/components/schedule-columns"
import { DataTable } from "@/components/data-table"
import { taskSchema } from "@/data/schema"
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';



//  async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "src/data/tasks.json")
//   )
//   // W:\Projects\professor_app\src\data\tasks.json
  
//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }


export default async function Schedule({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?class=${class_name}` },
    { label: "Schedule",  href: `/class/schedule?class=${class_name}` },
    { label: decodeURIComponent(params.slug)},
  ];
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
        const tasks = await getTasks2();
        setFetchedTasks(tasks);
    };
    fetchSchedule();
    
  }, []);


    async function getTasks2() {
        var pptval
        try { 
          const res = await fetch("/api/login", {
            method: "GET",
          });
          const formdata = new FormData();
          if(params.slug.includes("Preliminary"))
            pptval = "0"
          else if(params.slug.includes("First"))
            pptval = "1"
          else if(params.slug.includes("Second"))
            pptval = "2"
          else if(params.slug.includes("Final"))
            pptval = "3"
          else
            pptval=-1
          formdata.append("batch", class_name as string);
          console.log("jaada",pptval);
          formdata.append("ppt_type",pptval as string);
          if (res.status === 200) {
              const getppt = await fetch(
              "https://pmt-u972l.ondigitalocean.app/get_presentations/",
              {
                method: "POST",
                body: formdata
              }
            );
            if (getppt.status === 200) {
              const data = await getppt.json();
              console.log("BAKAMONO", data);

              const tasks = data.map((ppt: any) => ({
                id:  ppt.id.toString(), // Convert id to string
                date: ppt.Date,
                time: ppt.Time,
                teamMembers: ppt.Members || [],
                title: ppt.Title,
                priority: "high", // No priority information in the API response
                label: "Team Label", // No team information in the API response
                guide: ppt.Guide || "Not Assigned",
                status: "done",
              }));
              console.log("TASKS", tasks);
              return tasks;
            }
            // Optionally, update the class list on the dashboard
          } else {
            toast({
              title: "Message",
              description: "No presentations found!",
            });
            return []
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      
      return [];
  }
  console.log("AMBAAN",fetchedTasks);
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        {fetchedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold tracking-tight mb-4">No Schedules Yet</h2>
            <p className="text-muted-foreground mb-6">There are no schedules for this batch so far.</p>
          </div>
        ) : (
        <>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">  Schedule of {decodeURIComponent(params.slug)} presentation of {class_name}</h2>
            <p className="text-muted-foreground">
              Here&apos;s a view of all the presentations!
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


// "use client"

// import { columns } from "@/components/ppt-columns"
// import { DataTable } from "@/components/data-table"
// import { diarySchema } from "@/data/diary-schema"
// import { MainNav } from "@/components/main-nav"
// import { UserNav } from "@/components/user-nav"
// import { useState, useEffect } from "react"

// export default function Diary({
//   params,
//   searchParams,
// }: {
//   params: { slug: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
//   const p_id = searchParams?.id
//   const [members, setMembers] = useState<string[]>([]);
//   const [fetchedTasks, setFetchedTasks] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { members: fetchedMembers, tasks } = await getTasks2(p_id as string);
//       setMembers(fetchedMembers);
//       setFetchedTasks(tasks);
//     };

//     if (p_id) {
//       fetchData();
//     }
//   }, [p_id]);

//   function formatDateString(dateString: string) {
//     const regex = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}/;
//     const match = dateString.match(regex);
  
//     if (match) {
//       const [, year, month, day] = match;
//       return `${day}/${month}/${year}`;
//     }
  
//     return dateString; // Return the original string if it doesn't match the expected format
//   }

//   async function getTasks2(p_id: string) {
//     const formdata = new FormData();
//     formdata.append("project_id", p_id);

//     try {
//       const response = await fetch(
//         "https://pmt-u972l.ondigitalocean.app/getDiary/",
//         {
//           method: "POST",
//           body: formdata,
//         }
//       );

//       const data = await response.json();
//       console.log("BAKA MONO", data);

//       const tasks = data.diaries.map((diary: any) => ({
//         id: diary.id.toString(), // Convert id to string
//         date: formatDateString(diary.created_at), // Convert created_at to dd/mm/yyyy format
//         status: diary.status,
//         priority: "high", // No priority information in the API response
//         diary: diary.diaryfile,
//         remarks: diary.Remarks.length > 0 ? diary.Remarks[0].remarkstr : "No remarks", // Assuming the first remark is displayed
//         label: "Team Label", // No team information in the API response
//       }));

//       return { members: data.members, tasks };
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       throw error;
//     }
//   }

//   return (
//     <>
//       <div className="border-b">
//         <div className="flex h-16 items-center px-4">
//           {/* <TeamSwitcher /> */}
//           <MainNav className="mx-6" />
//           <div className="ml-auto flex items-center space-x-4">
//             {/* <Search /> */}
//             <UserNav />
//           </div>
//         </div>
//       </div>
//       <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
//         <div className="flex items-center justify-between space-y-2">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight">Diary</h2>
//             <p className="text-muted-foreground">
//               Here&apos;s a view of the weekly diary submitted by {members.join(', ')}!
//             </p>
//           </div>
//         </div>
//         <DataTable data={fetchedTasks} columns={columns} />
//       </div>
//     </>
//   );
// }



