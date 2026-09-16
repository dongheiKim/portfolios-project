import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app";

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { startMockWorker } = await import("@/mocks/browser");
    await startMockWorker();
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
