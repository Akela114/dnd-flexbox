import { RouterProvider as RouterProvider } from "react-router-dom"
import { router } from "./config"

export const CustomRouterProvider = () => {
  return <RouterProvider router={router} />
}