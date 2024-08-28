import { DraggableElement, DroppableElement } from "@/interfaces/drag-n-drop";

type GetDroppableContainers = (draggableElements: DraggableElement[]) => DroppableElement[]

export const getDroppableContainers: GetDroppableContainers = (
  draggableElements
) => {
  return draggableElements.map((element) => ({
    key: element.key,
    name: element.key[0].toUpperCase() + element.key.slice(1),
  }))
}
