const confirm = useConfirm()

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete workout?',
    description: 'This cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })

  if (!confirmed) {
    return
  }

  await deleteWorkout()
}
