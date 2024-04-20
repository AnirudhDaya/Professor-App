"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent , PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  language: z.string({
    required_error: "Please select a language.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AccountForm() {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
  const handleCheckboxChange = (day:any, column:any) => {
    const checkboxId = `${day}-${column}`;
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (prevSelectedCheckboxes.includes(checkboxId)) {
        return prevSelectedCheckboxes.filter((id) => id !== checkboxId);
      } else {
        return [...prevSelectedCheckboxes, checkboxId];
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule</FormLabel>
              <FormControl>
              <table>
      <thead>
        <tr>
          <th></th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
          <th>6</th>
        </tr>
      </thead>
      <tbody className="">
        <tr>
          <td>Mon</td>
          <td>

            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-1')}
              onChange={() => handleCheckboxChange('Monday', 1)}
              
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-2')}
              onChange={() => handleCheckboxChange('Monday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-3')}
              onChange={() => handleCheckboxChange('Monday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-4')}
              onChange={() => handleCheckboxChange('Monday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-5')}
              onChange={() => handleCheckboxChange('Monday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Monday-6')}
              onChange={() => handleCheckboxChange('Monday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Tue</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-1')}
              onChange={() => handleCheckboxChange('Tuesday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-2')}
              onChange={() => handleCheckboxChange('Tuesday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-3')}
              onChange={() => handleCheckboxChange('Tuesday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-4')}
              onChange={() => handleCheckboxChange('Tuesday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-5')}
              onChange={() => handleCheckboxChange('Tuesday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Tuesday-6')}
              onChange={() => handleCheckboxChange('Tuesday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Wed</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-1')}
              onChange={() => handleCheckboxChange('Wednesday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-2')}
              onChange={() => handleCheckboxChange('Wednesday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-3')}
              onChange={() => handleCheckboxChange('Wednesday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-4')}
              onChange={() => handleCheckboxChange('Wednesday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-5')}
              onChange={() => handleCheckboxChange('Wednesday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Wednesday-6')}
              onChange={() => handleCheckboxChange('Wednesday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Thu</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-1')}
              onChange={() => handleCheckboxChange('Thursday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-2')}
              onChange={() => handleCheckboxChange('Thursday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-3')}
              onChange={() => handleCheckboxChange('Thursday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-4')}
              onChange={() => handleCheckboxChange('Thursday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-5')}
              onChange={() => handleCheckboxChange('Thursday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Thursday-6')}
              onChange={() => handleCheckboxChange('Thursday', 6)}
            />
          </td>
        </tr>
        <tr>
          <td>Fri</td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-1')}
              onChange={() => handleCheckboxChange('Friday', 1)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-2')}
              onChange={() => handleCheckboxChange('Friday', 2)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-3')}
              onChange={() => handleCheckboxChange('Friday', 3)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-4')}
              onChange={() => handleCheckboxChange('Friday', 4)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-5')}
              onChange={() => handleCheckboxChange('Friday', 5)}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={selectedCheckboxes.includes('Friday-6')}
              onChange={() => handleCheckboxChange('Friday', 6)}
            />
          </td>
        </tr>
        {/* Add similar rows for Tuesday, Wednesday, Thursday, and Friday */}
      </tbody>
    </table>
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  )
}