import toposort from "toposort"
import { logger, task } from "@trigger.dev/sdk"

import { getWorkflow } from "@/features/workflows/data"
import { Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executors"

export const runWorkflowTask = task({
  id: "run-workflow",
  run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }) => {
    const workflow = await getWorkflow(orgId, workflowId)

    if (!workflow?.graph) {
      throw new Error(`Workflow ${workflowId} does not have a graph`)
    }

    const { nodes, edges } = workflow.graph

    const byId = new Map(nodes.map((node) => [node.id, node]))

    const connected = new Set(
      edges.flatMap((edge) => [edge.source, edge.target])
    )

    const order = toposort
      .array(
        nodes.map((node) => node.id),
        edges.map((edge) => [edge.source, edge.target])
      )
      .filter((id) => connected.has(id))

    logger.log(`Running workflow ${workflow.name}`, { steps: order.length })

    let stagehand: Stagehand | undefined

    // Function to get or initialize Stagehand
    const getStagehand = async () => {
      if (stagehand) {
        return stagehand
      }

      // Initialize Stagehand
      stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY!,
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
        model: process.env.STAGEHAND_MODEL || "google/gemini-2.5-flash",
        disablePino: true,
      })

      await stagehand.init()

      return stagehand
    }

    for (const id of order) {
      const node = byId.get(id)
      logger.log(`Running step ${node?.data.title}`)

      const executer =
        nodeExecutors[node?.data.type as keyof typeof nodeExecutors]
      if (executer) {
        await executer({
          values: node?.data.values || {},
          getStagehand,
        })
      }
    }
    await stagehand?.close()
    return { steps: order.length }
  },
})
