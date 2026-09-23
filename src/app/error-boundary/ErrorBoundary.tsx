import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f4f7fb] px-4 text-center">
            <h1 className="text-2xl font-black text-[#111827]">
              오류가 발생하였습니다.
            </h1>
            <p className="max-w-md text-sm text-[#64748b]">
              예기치 않은 오류가 발생했습니다. 페이지를 새로고침하거나 다시
              시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="rounded-xl bg-[#346aff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1d55ef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
            >
              홈으로 돌아가기
            </button>
          </main>
        )
      );
    }

    return this.props.children;
  }
}
