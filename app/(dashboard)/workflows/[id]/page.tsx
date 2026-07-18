export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
    
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">
        Workflow <span className="font-medium text-foreground">{id}</span>
      </p>
    </div>
  )
}
