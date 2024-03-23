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
import { toast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
  
  export function UserNav() {
    const router = useRouter();
    const handleLogout = async () => {
      const res = await fetch("/api/login", {
        method: "GET",
      });
      if (res.status === 200) {
        const val = await res.json();
        // console.log(val.token.value);
        const signout = await fetch(
          "https://pmt-inajc.ondigitalocean.app/logout/",
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
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