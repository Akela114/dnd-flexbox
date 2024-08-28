import { FlexSortPage } from "@/pages/flex-sort-page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/dnd-flexbox/",
    element: <FlexSortPage />
  }
])