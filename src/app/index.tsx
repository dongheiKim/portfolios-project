import { BrowserRouter, Routes, Route } from "react-router";
import { AppRouters } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./providers";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {AppRouters.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
