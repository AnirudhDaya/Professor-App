import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Proma AI Login",
  description: "Login to your Proma AI account",
};

export default function LoginPage() {
  return (
    
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-proma-950">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      ></Link>
      <div className="relative flex flex-col items-center justify-center w-dvw h-full">
        <div className="flex items-center justify-center">
          <Image
            src="/Looper-4.png"
            alt="Background"
            width={800}
            height={600}
            loading="lazy"
            // objectFit="cover"
            className="w-[75vw] max-h-full"
          />
        </div>
        <div className="flex gap-[20em] md:translate-y-[-25em] lg:translate-y-[-30em] px-5">
          <div className="flex flex-col items-center justify-center">
            <div>
              <Image
                src="/PromaLogo.png"
                alt="Background"
                width={1080}
                height={600}
                loading="lazy"
                className="w-[25vw] max-h-full"
              />
            </div>
            <p className="text-xs lg:text-sm xl:text-base">"Here for all your Project Management needs"</p>
          </div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <h1 className="text-4xl font-semibold tracking-tight text-center">
              Login
            </h1>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
