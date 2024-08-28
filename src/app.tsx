import { CustomRouterProvider } from './router'
import { enableDragDropTouch } from 'drag-drop-touch'

import './index.css'

enableDragDropTouch();



export const App = () => {
  return <CustomRouterProvider />
}

   