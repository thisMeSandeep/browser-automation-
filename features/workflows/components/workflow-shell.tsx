import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Canvas } from "./canvas"
import { RightSidebar } from "./right-sidebar"

// Layout shell for the workflow editor. Sizes in rem (not percentages).
export function WorkflowShell({ workflowId }: { workflowId: string }) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      data-workflow-id={workflowId}
      className="size-full"
    >
      <ResizablePanel minSize="30rem">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel minSize="18rem">
            <Canvas />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="8rem" minSize="6rem">
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Logs
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="16rem" minSize="14rem" maxSize="36rem">
        <RightSidebar workflowId={workflowId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
