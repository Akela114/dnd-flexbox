import { FlexSortPage } from "@/pages/flex-sort-page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: import.meta.env.MODE === "development" ? "/" : "/dnd-flexbox",
    element: <FlexSortPage />
  }
])