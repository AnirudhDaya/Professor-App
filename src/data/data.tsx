import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export const labels = [
    {
      value: "approve",
      label: "Approve",
    },
    {
      value: "reject",
      label: "Reject",
    },
  
  ]
  
  export const statuses = [
    {
      value: "under review",
      label: "Under Review",
      icon: QuestionMarkCircledIcon,
    },
    
    {
      value: "in progress",
      label: "In Progress",
      icon: StopwatchIcon,
    },
    {
      value: "approve",
      label: "Approved",
      icon: CheckCircledIcon,
    },
    {
      value: "reject",
      label: "Rejected",
      icon: CrossCircledIcon,
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "low",
      icon: ArrowDownIcon,
    },
    {
      label: "Medium",
      value: "medium",
      icon: ArrowRightIcon,
    },
    {
      label: "High",
      value: "high",
      icon: ArrowUpIcon,
    },
  ]