import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./component/layout/Layout";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <h1>Home</h1> },
      { path: "/about", element: <h1>About</h1> },
      { path: "/contact", element: <h1>Contact</h1> },
      { path: "*", element: <h1>Not Found</h1> },
    ],
  },
]);

import "./App.css";

function App() {
  return <RouterProvider router={browserRouter}></RouterProvider>;
}

export default App;
