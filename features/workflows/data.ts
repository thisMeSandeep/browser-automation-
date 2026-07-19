import { and, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { workflows } from "@/lib/db/schema"

// List all workflows for a given organization
export async function listWorkflows(orgId: string) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt))
}


// Get the single workflow matching both its ID and organization ID
export async function getWorkflow(orgId: string, id: string) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(and(eq(workflows.id, id), eq(workflows.orgId, orgId)))
    .limit(1)

  return workflow
}

// Create a workflow for a given organization
export async function createWorkflow(orgId: string, name: string) {
  const [workflow] = await db
    .insert(workflows)
    .values({ orgId, name })
    .returning()

  return workflow
}
