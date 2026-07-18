import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

import { createWorkflowAction } from "@/features/workflows/actions"
import { listWorkflows } from "@/features/workflows/data"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export async function AppSidebar() {
  const { orgId } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []

  return (
    <Sidebar collapsible="icon" className="border-r-0!">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <OrganizationSwitcher
              hidePersonal
              appearance={{
                elements: {
                  rootBox: "w-full",
                  organizationSwitcherTrigger: "w-full justify-start",
                },
              }}
            />
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <WorkflowNav
          workflows={workflows}
          createWorkflowAction={createWorkflowAction}
        />
      </SidebarContent>

      <SidebarFooter>
        <UserButton
          appearance={{ elements: { rootBox: "w-full" } }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
