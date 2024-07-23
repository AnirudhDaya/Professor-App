"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"

export function UserNav() {
  const router = useRouter();
  const [role,setRole] = useState<string | null>("")

  function handleRole(value: string) {
    
    localStorage.setItem('role', value);
    toast({
      title: 'Successfully Switched Role',
      description: `You are now ${value}`,
      
    })
    router.push("/");
    window.location.reload();
    // You can optionally perform additional actions here, such as updating the UI or making an API call with the selected role
  }
  useEffect(() => {
    // Perform localStorage action
    setRole(localStorage.getItem('role'))
  }, [])
  const handleLogout = async () => {
    const res = await fetch("/api/login", {
      method: "GET",
    });
    if (res.status === 200) {
      const val = await res.json();
      // console.log(val.token.value);
      const signout = await fetch(
        "https://pmt-u972l.ondigitalocean.app/logout/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${val.token.value}`,
          },
        }
      );
      if (signout.status === 200) {
        const logout = await fetch("/api/logout", {
          method: "POST",
        });
        if (logout.status === 200) {
          toast({
            title: "Success",
            description: "Logging you out, thank you!",
          })
          router.push("/login", { scroll: false });
        }
      }
    } else {
      toast({
        title: "Error",
        description: "No session found",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Welcome</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <Select onValueChange={handleRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coordinator">Coordinator</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}