"use client"

import { columns } from "@/components/diary-columns"
import { DataTable } from "@/components/data-table"
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";
import { useState, useEffect } from "react";


export default function Submissions({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const class_name = searchParams?.class
  const p_id = searchParams?.id
  const [members, setMembers] = useState<string[]>([]);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?class=${class_name}` },
    { label: "Submissions", href:`/class/submissions?class=${class_name}` },
    {label: "Diary"}
  ];
  useEffect(() => {
    const fetchData = async () => {
      const { members: fetchedMembers, tasks } = await getTasks2(p_id as string);
      setMembers(fetchedMembers);
      setFetchedTasks(tasks);
    };

    if (p_id) {
      fetchData();
    }
  }, [p_id]);

  function formatDateString(dateString: string) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}/;
    const match = dateString.match(regex);
  
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
  
    return dateString; // Return the original string if it doesn't match the expected format
  }

  async function getTasks2(p_id: string) {
    const formdata = new FormData();
    formdata.append("project_id", p_id);

    try {
      const response = await fetch(
        "https://pmt-u972l.ondigitalocean.app/getDiary/",
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await response.json();
      console.log("BAKA MONO", data);

      if(response.status == 404){
          return {members: [],tasks: []};
      }
      const tasks = data.diaries.map((diary: any) => ({
        id: diary.id.toString(), // Convert id to string
        date: formatDateString(diary.created_at), // Convert created_at to dd/mm/yyyy format
        status: diary.status,
        priority: "high", // No priority information in the API response
        diary: diary.diaryfile || "",
        remarks: diary.Remarks.length > 0 ? diary.Remarks[0].remarkstr : "No remarks", // Assuming the first remark is displayed
        label: "Team Label", // No team information in the API response
      }));

      return { members: data.members, tasks };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems} />
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold tracking-tight mb-4">No Submissions Yet</h2>
            <p className="text-muted-foreground mb-6">There are no diary submissions for this project so far.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Diary</h2>
                <p className="text-muted-foreground">
                  Here&apos;s a view of the weekly diary submitted by {members.join(', ')}!
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


