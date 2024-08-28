import { DraggableElement, DroppableElement } from "@/interfaces/drag-n-drop";
// import { getDroppableContainers } from "@/lib/utils/get-droppable-containers";
import { DragEventHandler, Fragment, useState } from "react";
import classNames from 'classnames'

const draggableElementsData = [
  {
    key: "bear",
  },
  {
    key: "cat",
  },
  {
    key: "chicken",
  },
  {
    key: "cow",
  },
  {
    key: "crocodile",
  }
] satisfies DraggableElement[];

// const droppableElementsData = getDroppableContainers(draggableElementsData);

export const MainPage = () => {
  const [draggingElementId, setDraggingElementId] = useState<DraggableElement["key"]>();
  // const [activeDroppableElement, setActiveDroppableElement] = useState<DroppableElement["key"]>();
  const [activeDroppableElement2, setActiveDroppableElement2] = useState<{
    key: DroppableElement["key"];
    positionX: "right" | "left";
    positionY: "top" | "bottom";
  }>();
 
  const dragStartHandler: DragEventHandler = (event) => {
    const boundingClientRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - boundingClientRect.x;
    const y = event.clientY - boundingClientRect.y;

    event.dataTransfer.setDragImage(event.currentTarget, x, y);

    const elementKey = event.currentTarget.getAttribute("data-key");
    if (elementKey) {
      setTimeout(() => {
        setDraggingElementId(elementKey);
        setActiveDroppableElement2({
          key: elementKey,
          positionX: 'left',
          positionY: 'top'
        })
      })
    }
  }

  const dragEndHandler: DragEventHandler = (event) => {
    const elementKey = event.currentTarget.getAttribute("data-key");
    if (elementKey) {
      setDraggingElementId(undefined);
    }
  }

  // const dragEnterHandler = (event: React.DragEvent<HTMLDivElement>) => {
  //   const elementKey = event.currentTarget.getAttribute("data-key");
  //   if (elementKey) {
  //     setActiveDroppableElement(elementKey);
  //   }
  // }

  // const dragLeaveHandler = (event: React.DragEvent<HTMLDivElement>) => {
  //   if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget as Node)) {
  //     return;
  //   }
  //   const elementKey = event.currentTarget.getAttribute("data-key");
  //   if (elementKey) {
  //     setActiveDroppableElement(undefined);
  //   }
  // }

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const elementKey = event.currentTarget.getAttribute("data-key");
    // if over right part of element
    if (elementKey) {
      const boundingClientRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingClientRect.x;
      const y = event.clientY - boundingClientRect.y;
      setActiveDroppableElement2(prev => {
        const positionX = x > boundingClientRect.width / 2 ? 'right' : 'left';
        const positionY = y > boundingClientRect.height / 2 ? 'bottom' : 'top';
        if (prev?.key === elementKey && prev?.positionX === positionX && prev?.positionY === positionY) {
          return prev
        }
        return {
          key: elementKey,
          positionX,
          positionY
        }
      })
    }
  }

  console.log('rerender')

  const draggableElements = draggableElementsData.map((element) => (
    <Fragment>
      {activeDroppableElement2?.key === element.key && activeDroppableElement2?.positionX === 'left' && (
        <div 
          className="size-[88px] bg-red-500" 
          data-key={element.key}
        ></div>
      )}
      <div
        className={classNames("p-1 border border-black/25", {
          "hidden": draggingElementId === element.key
        })} 
        data-key={element.key}
        draggable
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
        onDragOver={dragOverHandler}
      >
          <img 
            src={`/images/animals/${element.key}.jpg`} 
            alt={element.key} 
            className="size-20 object-cover"
          />
      </div>
      {activeDroppableElement2?.key === element.key && activeDroppableElement2?.positionX === 'right' && (
        <div 
          className="size-[88px] bg-red-500" 
          data-key={element.key}
        ></div>
      )}
    </Fragment>
  ))

  // const droppableElements = droppableElementsData.map((element) => (
  //   <div 
  //     className={classNames("p-3 border-2 border-dashed border-black/25", 
  //       activeDroppableElement === element.key
  //         && (draggingElementId === element.key
  //           ? "border-green-500" 
  //           : "border-red-500")
  //     )}
  //     key={element.key}
  //     onDragEnter={dragEnterHandler}
  //     onDragLeave={dragLeaveHandler}
  //     data-key={element.key}
  //   >
  //     <div className="size-20 flex justify-center items-center">
  //       <div className="truncate">
  //         {element.name}
  //       </div>
  //     </div>
  //   </div>
  // ))

  return (
    <div className="p-5 space-y-10 relative">
      <div className="mx-auto w-fit flex gap-2 transition-[width] p-4 border max-w-80 flex-wrap">
        {draggableElements}
      </div>
      {/* <div className="mx-auto w-fit space-y-2">
          {droppableElements}
      </div> */}
    </div>
  )
}