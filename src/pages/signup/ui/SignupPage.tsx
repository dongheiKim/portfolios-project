import { Link } from "react-router";
import { SignUpForm } from "@/features/auth/sign-up";

export function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e9fff7_0%,_#f7fffc_38%,_#ffffff_100%)] px-4 py-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <header className="max-w-xl space-y-4">
          <p className="inline-flex rounded-full bg-[#dcfaee] px-4 py-1 text-xs font-bold tracking-[0.08em] text-[#0f766e]">
            CREATE ACCOUNT
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#052e2b] md:text-4xl">
            회원가입으로 시작하세요.
            <br />
            쇼핑 경험을 더 간편하게 만듭니다.
          </h1>
          <p className="text-sm leading-6 text-[#33645e] md:text-base">
            가입 후 로그인하면 장바구니 저장, 주문 조회, 최근 본 상품 기능을
            바로 이용할 수 있습니다.
          </p>
        </header>

        <article className="w-full max-w-md rounded-3xl border border-[#d1f0e4] bg-white p-6 shadow-[0_20px_50px_rgba(6,78,59,0.10)] md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#065f58]">회원가입</h2>
            <p className="mt-2 text-sm text-[#4d7b74]">
              기본 정보를 입력하고 바로 서비스를 이용해 보세요.
            </p>
          </div>
          <SignUpForm />
          <p className="mt-6 text-center text-sm text-[#4d7b74]">
            이미 계정이 있나요?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0f766e] hover:underline"
            >
              로그인하기
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
