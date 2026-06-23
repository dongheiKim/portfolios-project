import { BrowserRouter, Routes, Route } from "react-router";
import { AppRouters } from "./router";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {AppRouters.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
