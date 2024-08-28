import { CustomRouterProvider } from './router'
// @ts-expect-error missing declaration
import { enableDragDropTouch } from "./drag-drop-touch.esm.min.js";

enableDragDropTouch();

import './index.css'

export const App = () => {
  return <CustomRouterProvider />
}

   