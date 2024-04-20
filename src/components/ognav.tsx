"use client"
import { usePathname } from "next/navigation";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export function OgNav() {
    const pathname = usePathname()
    if(pathname.includes("login")){
        return(
          <></>
        )
    }
    return (
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav />
            </div>
          </div>
        </div>
    );

}