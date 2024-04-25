// import { promises as fs } from "fs"
import { usePathname } from 'next/navigation';
import { columns } from "@/components/schedule-columns"
import { DataTable } from "@/components/data-table"
import { taskSchema } from "@/data/schema"
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";



//  async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "src/data/tasks.json")
//   )
//   // W:\Projects\professor_app\src\data\tasks.json
  
//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

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
    // console.log("BAKA MONE", data);

    // // Extract the required data from the API response
    const tasks = data.map((project: any) => ({
      id: project.project.id.toString(), // Convert id to string
      title: project.project.title, 
      status: project.project.status,
      label: project.project.team, // Assuming 'team' is the label
      priority: 'high', // No priority information in the API response
      teamMembers: project.members, // No team members information in the API response
      // abstract: project.project.abstract,
      // researchPapers: project.research_papers,
      reports: project.reports, // No reports information in the API response
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export default async function Schedule({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("baka baka");
  const class_name = searchParams?.class
//   const currentPage = usePathname();
//   const pathSegments = currentPage.split('/');
//   const pptName = pathSegments[pathSegments.length - 1];

//   const tasks = await getTasks()
  const tasks = await getTasks2(class_name as string)
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?class=${class_name}` },
    { label: "Schedule",  href: `/class/schedule?class=${class_name}` },
    { label: params.slug },
  ];
  return (
    <> 
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Schedule of {params.slug} of {class_name}</h2>
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




