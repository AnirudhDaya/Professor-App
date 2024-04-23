"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://proma-ai-uw7kj.ondigitalocean.app/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Tokens", data.token);
        const token = data["token"];

        try {
          const setCookieResponse = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (setCookieResponse.status === 200) {
            toast({
              title: "Success",
              description: "Redirecting to dashboard",
            });
            // router.push("/", { scroll: false });
            
            window.location.href = "/"
          } else {
            toast({
              title: "Fail",
              description: "Failed to set cookie",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Error setting cookie",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              required
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Password"
              required
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
