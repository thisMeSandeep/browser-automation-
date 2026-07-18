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


// Get a workflow by its ID and organization ID
export async function createWorkflow(orgId: string, name: string) {
  const [workflow] = await db
    .insert(workflows)
    .values({ orgId, name })
    .returning()

  return workflow
}
