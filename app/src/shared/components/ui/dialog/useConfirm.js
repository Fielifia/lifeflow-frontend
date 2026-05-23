const confirm = useConfirm()

const handleDelete = async () => {
  const accepted = await confirm({
    title: 'Delete workout?',
    description: 'This cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  })

  if (!accepted) {
    return
  }

  deleteWorkout()
}
