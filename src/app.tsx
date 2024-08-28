import { CustomRouterProvider } from './router'
import { enableDragDropTouch } from "./drag-drop-touch.esm.min.js";

enableDragDropTouch();

import './index.css'

export const App = () => {
  return <CustomRouterProvider />
}

   