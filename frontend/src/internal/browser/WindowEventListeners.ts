const onDrop = (event: DragEvent) => {
  event.preventDefault()
}

const onDrag = (event: DragEvent) => {
  event.preventDefault()
}

function AddWindowListeners() {
  window.addEventListener('drop', onDrop)
  window.addEventListener('dragover', onDrag)
}

function RemoveWindowListeners() {
  window.removeEventListener('drop', onDrop)
  window.removeEventListener('dragover', onDrag)
}

export {
  AddWindowListeners,
  RemoveWindowListeners
}