import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { signIn } from "../api/signIn";
import { useSignInForm } from "../model/useSignInForm";
import { useAuthStore } from "@/features/auth/model/authStore";
import { Button } from "@/shared/ui/Button";

export function SignInForm() {
  const {
    email,
    password,
    errors,
    isLoading,
    setEmail,
    setPassword,
    setErrors,
    setIsLoading,
    validate,
  } = useSignInForm();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { token, user } = await signIn({ email, password });
      login(user, token);
      navigate("/");
    } catch (err) {
      setErrors({ general: "이메일 또는 비밀번호가 올바르지 않습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.general && (
        <p
          role="alert"
          className="rounded-2xl border border-[#ffd3d8] bg-[#fff5f6] px-4 py-3 text-sm text-[#c53045]"
        >
          {errors.general}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-[#334155]">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#346aff] focus:ring-4 focus:ring-[#dbe8ff] ${
            errors.email ? "border-[#ff8b97]" : "border-[#d7e1ee]"
          }`}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-[#c53045]">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-[#334155]"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#346aff] focus:ring-4 focus:ring-[#dbe8ff] ${
            errors.password ? "border-[#ff8b97]" : "border-[#d7e1ee]"
          }`}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-[#c53045]">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-[#64748b]">
        <span>와우회원 혜택과 주문 조회를 이어서 이용</span>
        <Link
          to="/signup"
          className="font-semibold text-[#346aff] hover:underline"
        >
          회원가입
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        로그인
      </Button>

      <p className="text-center text-sm text-[#64748b]">
        로그인하면 장바구니와 주문 내역이 안전하게 저장됩니다.
      </p>
    </form>
  );
}
