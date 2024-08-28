import { useState } from "react";
import { SortableFlex } from "./sortable-flex/sortable-flex";


const draggableElementsData = [
  {
    id: "bear",
  },
  {
    id: "cat",
  },
  {
    id: "chicken",
  },
  {
    id: "cow",
  },
  {
    id: "crocodile",
  }
]

export const FlexSortPage = () => {
  const [items2, setItems2] = useState(draggableElementsData)

  return (
    <div className="p-10 flex flex-col items-center gap-20">
      <SortableFlex
        items={items2}
        setItems={setItems2}
        itemNodeFactory={element => (
          <div className="px-4 py-2 bg-black/10 border border-black flex gap-2">
            <div>{element.id}</div>
            <button 
              className="font-bold hover:text-red-500 transition-colors" 
              onClick={() => setItems2(prev => prev.filter(item => item.id !== element.id))}
            >
              x
            </button>
          </div>
        )}
        draggingItemNodeFactory={element => (
          <div className="px-4 py-2 bg-green-500/10 border border-black flex gap-2">
            <div>{element.id}</div>
            <button 
              className="font-bold hover:text-red-500 transition-colors" 
              onClick={() => setItems2(prev => prev.filter(item => item.id !== element.id))}
            >
              x
            </button>
          </div>
        )}
        classNames={{
          dropzone: {
            always: "p-20 border-2 transition gap-2",
            whileDragging: "border-green-500"
          }
        }}
      />
    </div>
  )
}