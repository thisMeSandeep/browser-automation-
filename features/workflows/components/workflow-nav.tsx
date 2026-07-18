"use client"

import { useMemo, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Workflow as WorkflowIcon } from "lucide-react"

import { generateSlug } from "@/features/workflows/lib/generate-slug"
import type { Workflow } from "@/lib/db/schema"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

// Owns both sidebar states. Expanded: the full workflow list. Collapsed: a
// single icon button whose popover holds the list plus a "New workflow" action.
export function WorkflowNav({
  workflows,
  createWorkflowAction,
}: {
  workflows: Workflow[]
  createWorkflowAction: (name: string) => Promise<void>
}) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  const isCollapsed = state === "collapsed" && !isMobile
  const [isPending, startTransition] = useTransition()

  // Names already taken in this org, so we can generate one that doesn't collide.
  const existingNames = useMemo(
    () => new Set(workflows.map((workflow) => workflow.name)),
    [workflows]
  )

  const handleCreate = () => {
    let name = generateSlug()
    while (existingNames.has(name)) {
      name = generateSlug()
    }
    // The action creates the row and redirects to /workflows/{id}.
    startTransition(() => createWorkflowAction(name))
  }

  const workflowList = (
    <SidebarMenu className="gap-1">
      {workflows.map((workflow) => (
        <SidebarMenuItem key={workflow.id}>
          <SidebarMenuButton
            asChild
            isActive={!isCollapsed && pathname === `/workflows/${workflow.id}`}
            className="transition-colors duration-200"
          >
            <Link href={`/workflows/${workflow.id}`}>
              <span>{workflow.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Popover>
            <PopoverTrigger asChild>
              <SidebarMenuButton>
                <WorkflowIcon />
                <span>Workflows</span>
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent side="right" align="start">
              <SidebarMenuButton
                onClick={handleCreate}
                disabled={isPending}
                className="transition-colors duration-200"
              >
                <Plus />
                <span>New workflow</span>
              </SidebarMenuButton>
              <SidebarSeparator className="mx-0" />
              {workflowList}
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupAction
        title="New workflow"
        onClick={handleCreate}
        disabled={isPending}
      >
        <Plus />
        <span className="sr-only">New workflow</span>
      </SidebarGroupAction>
      <SidebarGroupContent>{workflowList}</SidebarGroupContent>
    </SidebarGroup>
  )
}
