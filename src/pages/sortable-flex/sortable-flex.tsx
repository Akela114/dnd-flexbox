import classnames from "classnames";
import { Dispatch, DragEventHandler, ElementRef, Fragment, ReactNode, SetStateAction, useCallback, useRef, useState } from "react";
import { isPointInTriangle } from "./is-point-in-triangle";

enum E_DROP_POSITION {
  prev = 'prev',
  next = 'next',
}

type DropData = {
  itemId: string;
  position: E_DROP_POSITION;
}

type DragData<T> = {
  item: T;
  elementWidth: number;
}

type SortableFlexProps<T extends {id: string}> = {
  classNames?: {
    dropzone?: {
      always?: string;
      whileDragging?: string;
    };
  }
  items: T[];
  itemNodeFactory: (data: T) => ReactNode;
  draggingItemNodeFactory: (data: T) => ReactNode;
  setItems: Dispatch<SetStateAction<T[]>>;
};

export const SortableFlex = <T extends {id: string}>({
  classNames, items, itemNodeFactory, draggingItemNodeFactory, setItems
}: SortableFlexProps<T>) => {
  const itemsContainerRef = useRef<ElementRef<"div">>(null);
  const [dragData, setDragData] = useState<DragData<T>>();
  const [dropData, setDropData] = useState<DropData>();

  const setDropDataWithCheck = useCallback((data: DropData) => {
    setDropData(prev => {
      if (prev?.itemId === data.itemId && prev?.position === data.position) {
        return prev
      }
      return data
    })
  }, [setDropData]);

  const dragStartHandler: DragEventHandler = (event) => {
    const elementId = event.currentTarget.getAttribute("data-id");
    const dragStartItem = items.find(item => item.id === elementId)
    if (dragStartItem) {
      const boundingClientRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingClientRect.x;
      const y = event.clientY - boundingClientRect.y;

      event.dataTransfer.setDragImage(event.currentTarget, x, y);
      event.dataTransfer.effectAllowed = "move";

      setTimeout(() => {
        setDragData({ item: dragStartItem, elementWidth: boundingClientRect.width });
        setDropData({
          itemId: dragStartItem.id,
          position: E_DROP_POSITION.prev
        })
      })
    }
  }

  const dragEndHandler: DragEventHandler = (event) => {
    event.preventDefault()
    if (dragData && dropData && dragData.item.id !== dropData.itemId) {
      setItems(prev => {
        const filteredItems = prev.filter(item => item.id !== dragData.item.id);
        const insertIdx = filteredItems.findIndex(item => item.id === dropData.itemId);
        if (insertIdx !== -1) {
          filteredItems.splice(insertIdx + (dropData.position === 'next' ? 1 : 0), 0, dragData.item)
        }
        return filteredItems
      })
    }
    setDragData(undefined);
    setDropData(undefined);
  }

  const dragOverHandler: DragEventHandler = (event) => {
    event.preventDefault();
    const elementId = event.currentTarget.getAttribute("data-id");
    if (dragData && elementId && itemsContainerRef.current) {
      const boundingClientRect = event.currentTarget.getBoundingClientRect();
      const position = isPointInTriangle(
        { x: event.clientX, y: event.clientY }, 
        { x: boundingClientRect.x, y: boundingClientRect.y },
        { x: boundingClientRect.x + boundingClientRect.width, y: boundingClientRect.y },
        { x: boundingClientRect.x, y: boundingClientRect.y + boundingClientRect.height }
      ) ? E_DROP_POSITION.prev : E_DROP_POSITION.next;
      setDropDataWithCheck({
        itemId: elementId,
        position
      })
    }
  }

  const lastElementDragOverHandler: DragEventHandler = (event) => {
    event.preventDefault();
    if (dragData) {
      const boundingClientRect = event.currentTarget.getBoundingClientRect();
      const position = isPointInTriangle(
        { x: event.clientX, y: event.clientY }, 
        { x: boundingClientRect.x, y: boundingClientRect.y },
        { x: boundingClientRect.x + boundingClientRect.width, y: boundingClientRect.y },
        { x: boundingClientRect.x, y: boundingClientRect.y + boundingClientRect.height }
      ) ? E_DROP_POSITION.prev : E_DROP_POSITION.next;
      const item = position === E_DROP_POSITION.prev ? items[0] : items[items.length - 1];
      setDropDataWithCheck({
        itemId: item.id,
        position
      })
    }
  }

  const itemsContainerDragLeaveHandler: DragEventHandler = (event) => {
    event.preventDefault();
    if (!dragData || !event.relatedTarget || event.currentTarget.contains(event.relatedTarget as Node)) {
      return
    }
    setDropDataWithCheck({
      itemId: dragData.item.id,
      position: E_DROP_POSITION.prev
    })
  }

  const itemElements = items.map(item => (
    <Fragment key={item.id}>
      {dragData && dropData?.itemId === item.id && dropData?.position === E_DROP_POSITION.prev && (
        draggingItemNodeFactory(dragData.item)
      )}
      <div
        className={classnames("cursor-grab", {
          "hidden": dragData?.item.id === item.id
        })}
        data-id={item.id}
        draggable
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
        onDragOver={dragOverHandler}
      >
        {itemNodeFactory(item)}
      </div>
      {dragData && dropData?.itemId === item.id && dropData?.position === E_DROP_POSITION.next && (
        draggingItemNodeFactory(dragData.item)
      )}
    </Fragment>
  ))

  return (
    <div 
      className={classnames(
        "flex flex-wrap",
        classNames?.dropzone?.always,
        dragData && classNames?.dropzone?.whileDragging
      )}
      ref={itemsContainerRef}
      onDragLeave={itemsContainerDragLeaveHandler}
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
    >
      {itemElements}
      <div className="flex-1" onDragOver={lastElementDragOverHandler} />
    </div>
  );
}