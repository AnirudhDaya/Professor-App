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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MainNav } from "@/components/main-nav";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { UserNav } from "@/components/user-nav";

import { Copy } from "lucide-react";
// import copy from "copy-to-clipboard";
import { MdOutlineExitToApp } from "react-icons/md";
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
import { MdPerson, MdGroupAdd, MdAdd } from "react-icons/md";
import { Icon } from "@radix-ui/react-select";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-nav";

export default function DashboardPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [teamCode, setTeamcode] = useState<string>("");
  const [teamName, setTeamname] = useState<string>("");
  const [cardData, setCardData] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const class_name = searchParams?.class
  const handleSubmit = async () => {
    const res = await fetch("/api/login", {
      method: "GET",
    });
    if (res.status === 200) {
      const val = await res.json();
      console.log(teamName);
      const data = new FormData();
      data.append("name", teamName);
      const createdTeam = await fetch(
        "https://pmt-inajc.ondigitalocean.app/create_team/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${val.token.value}`,
            // "Content-Type": "application/json",
          },
          body: data, // Include team name in request body
        }
      );
      console.log(createdTeam);
      if (createdTeam.status === 201) {
        const team = await createdTeam.json();
        console.log(team.code);
        toast({
          title: "Success",
          description: "Team created successfully",
        });
        localStorage.setItem("teamCode", team.code);
        localStorage.setItem("teamName", team.name);
        window.location.reload();
      } else {
        toast({
          title: "Error!",
          description: "Failed to create team",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error!",
        description: "No session exists",
        variant: "destructive",
      });
    }
  };

  const handleJoin = async () => {
    const res = await fetch("/api/login", {
      method: "GET",
    });
    if (res.status === 200) {
      const val = await res.json();
      console.log(teamName);
      const data = new FormData();
      // data.append("code", teamCode);
      const createdTeam = await fetch(
        "https://pmt-inajc.ondigitalocean.app//join_team/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${val.token.value}`,
            // "Content-Type": "application/json",
          },
          body: data, // Include team name in request body
        }
      );
      console.log(createdTeam);
      if (createdTeam.status === 201) {
        const team = await createdTeam.json();
        console.log(team.code);
        toast({
          title: "Success!",
          description: "You have joined a team successfully",
        });
        localStorage.setItem("teamCode", team.code);
        localStorage.setItem("teamName", team.name);
        window.location.reload();
      } else {
        toast({
          title: "Error!",
          description: "Failed to join team",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error!",
        description: "No sessions found",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: any) => {
    setTeamname(e.target.value);
  };

  const handleCopy = () => {
    // copy(
    //   `Hola compadre, únete a mi pandilla "${teamName}" ahora. Aquí está el código del equipo: "${teamCode}"`
    // );
    // setCopied(true);
    // toast({
    //   title: "Message",
    //   description: "Invite code copied to clipboard",
    // });
  };

  const handleLeaveTeam = async () => {
    const res = await fetch("/api/login", {
      method: "GET",
    });
    if (res.status === 200) {
      const val = await res.json();
      // console.log(teamName);
      // data.append("code", teamCode);
      const leftTeam = await fetch(
        "https://pmt-inajc.ondigitalocean.app/leave_team/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${val.token.value}`,
            // "Content-Type": "application/json",
          },
        }
      );
      if (leftTeam.status == 200) {
        const data = await leftTeam.json();
        toast({
          title: "Success",
          description: data.detail,
        });
        localStorage.removeItem("teamName");
        localStorage.removeItem("teamCode");
        window.location.reload();
      }
    }
  };    

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: `${class_name}`, href: `/class?name=${class_name}` },
    { label: "Manage" },
  ];
  useEffect(() => {
    const teamCodeFromStorage = localStorage.getItem("teamCode") || "";
    const teamNameFromStorage = localStorage.getItem("teamName") || "";

    setTeamcode(teamCodeFromStorage);
    setTeamname(teamNameFromStorage);

    console.log("teamCode", teamCodeFromStorage); // Log the value to see if it's empty
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/login", {
        method: "GET",
      });
      if (res.status === 200) {
        const val = await res.json();
        console.log(val.token.value);
        const teamDetails = await fetch(
          "https://pmt-inajc.ondigitalocean.app/team_members/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${val.token.value}`,
            },
          }
        );
        console.log(teamDetails);
        if (teamDetails.status === 200) {
          const data = await teamDetails.json();
          setCardData(data.members);
        } else if (teamDetails.status === 400) {
          const data = await teamDetails.json();
          toast({
            title: "Darn!",
            description: "Join or create a new team",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch team details",
            variant: "destructive",
          });
        }
      }
    }
    fetchData();
  }, []);


  return (
    <>
     
      
        <div className="flex-1 space-y-4 p-8 pt-6">
        <BreadcrumbWithCustomSeparator breadcrumbItems={breadcrumbItems}/>
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Manage Reviewers</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamCode ? (
              <>
                {cardData.map((member: string) => (
                  <Card className="cursor-pointer bg-slate-800" key={member}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex-grow"></div>{" "}
                      {/* This div takes up the remaining space, pushing the icon to the right */}
                      <MdPerson /> {/* Icon */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{member}</div>
                    </CardContent>
                  </Card>
                ))}

                <Dialog>
                  <DialogTrigger>
                    <Card className="cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex-grow"></div>{" "}
                        {/* This div takes up the remaining space, pushing the icon to the right */}
                        <MdGroupAdd /> {/* Icon */}
                      </CardHeader>{" "}
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Add Reviewer
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a new Reviewer</DialogTitle>
                      <DialogDescription>
                        Copy the code and send it to your friend.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input
                          id="text"
                          defaultValue={teamCode}
                          readOnly
                        />
                      </div>
                      <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy onClick={handleCopy} className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Card className="cursor-pointer bg-red-500">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex-grow"></div>{" "}
                        {/* This div takes up the remaining space, pushing the icon to the right */}
                        <MdOutlineExitToApp /> {/* Icon */}
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Leave Team</div>
                      </CardContent>
                    </Card>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        remove you from this team.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveTeam}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger>
                    <Card className="cursor-pointer bg-blue-600">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {/* <MdGroupAdd /> */}
                          Create Team
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Start a party
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new Team</DialogTitle>
                      <DialogDescription>
                        Bring your gang together.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Team Name
                        </Label>
                        <Input
                          id="name"
                          value={teamName} // Set input value from teamName state
                          onChange={handleInputChange}
                           // Update teamName state on input change
                          placeholder="Amogus"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSubmit}
                        color="white"
                        type="submit"
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger>
                    <Card className="cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Join a team</div>
                        <p className="text-xs text-muted-foreground">
                          Got invited to a party
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enter Team Code</DialogTitle>
                      <DialogDescription>
                        <Input />
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button onClick={handleJoin} color="white" type="submit">
                        Join
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* Other dialogs */}
          </div>
        </div>
      
    </>
  );
}
