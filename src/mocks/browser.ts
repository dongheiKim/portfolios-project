import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

export function startMockWorker() {
  return worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}
