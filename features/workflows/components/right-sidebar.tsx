"use client"

import { useState, useTransition } from "react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { Loader2, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"
import type { helloWorld } from "@/trigger/example"

type RunHandle = { runId: string; accessToken: string }

// Statuses that mean the run is no longer in flight.
const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "CANCELED",
  "FAILED",
  "CRASHED",
  "INTERRUPTED",
  "SYSTEM_FAILURE",
  "EXPIRED",
  "TIMED_OUT",
])

// Inspector panel for the workflow editor, docked on the right.
export function RightSidebar({ workflowId }: { workflowId: string }) {
  const [isPending, startTransition] = useTransition()
  const [handle, setHandle] = useState<RunHandle | null>(null)

  function handleRun() {
    startTransition(async () => {
      const { runId, publicAccessToken } = await runWorkflowAction(workflowId)
      setHandle({ runId, accessToken: publicAccessToken })
    })
  }

  return (
    <div className="flex h-full flex-col gap-3 p-2">
      <Button onClick={handleRun} disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <Play />}
        {isPending ? "Starting…" : "Run"}
      </Button>

      {handle ? (
        <RunStatus runId={handle.runId} accessToken={handle.accessToken} />
      ) : null}
    </div>
  )
}

// Subscribes to a single run and renders its live status. Skips payload/output
// since we only render the status badge.
function RunStatus({
  runId,
  accessToken,
}: {
  runId: string
  accessToken: string
}) {
  const { run, error } = useRealtimeRun<typeof helloWorld>(runId, {
    accessToken,
    skipColumns: ["payload", "output"],
  })

  if (error) {
    return (
      <p className="text-sm text-destructive">Error: {error.message}</p>
    )
  }

  if (!run) {
    return <p className="text-sm text-muted-foreground">Connecting…</p>
  }

  const isTerminal = TERMINAL_STATUSES.has(run.status)
  const isFailure = run.status !== "COMPLETED" && isTerminal

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          !isTerminal && "animate-pulse bg-amber-500",
          run.status === "COMPLETED" && "bg-emerald-500",
          isFailure && "bg-destructive"
        )}
      />
      <span className="font-medium">{run.status}</span>
    </div>
  )
}
