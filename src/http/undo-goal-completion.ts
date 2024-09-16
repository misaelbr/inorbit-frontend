export async function undoGoalCompletion(goalCompletionId: string) {
  await fetch(`http://localhost:3333/completions/${goalCompletionId}/undo`, {
    method: 'DELETE',
  })
}
