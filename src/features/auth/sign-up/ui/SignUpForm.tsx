import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { signUp } from "../api/signUp";
import { useSignUpForm } from "../model/useSignUpForm";
import { useAuthStore } from "@/features/auth/model/authStore";
import { Button } from "@/shared/ui/Button";

export function SignUpForm() {
  const {
    name,
    email,
    password,
    passwordConfirm,
    errors,
    isLoading,
    setName,
    setEmail,
    setPassword,
    setPasswordConfirm,
    setErrors,
    setIsLoading,
    validate,
  } = useSignUpForm();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { token, user } = await signUp({ name, email, password });
      login(user, token);
      navigate("/");
    } catch {
      setErrors({
        general: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      id: "name",
      label: "이름",
      type: "text",
      value: name,
      onChange: setName,
      error: errors.name,
      autoComplete: "name",
      placeholder: "이름 입력",
    },
    {
      id: "email",
      label: "이메일",
      type: "email",
      value: email,
      onChange: setEmail,
      error: errors.email,
      autoComplete: "email",
      placeholder: "이메일 입력",
    },
    {
      id: "password",
      label: "비밀번호",
      type: "password",
      value: password,
      onChange: setPassword,
      error: errors.password,
      autoComplete: "new-password",
      placeholder: "비밀번호 (8자 이상)",
    },
    {
      id: "passwordConfirm",
      label: "비밀번호 확인",
      type: "password",
      value: passwordConfirm,
      onChange: setPasswordConfirm,
      error: errors.passwordConfirm,
      autoComplete: "new-password",
      placeholder: "비밀번호 재입력",
    },
  ] as const;

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

      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1">
          <label
            htmlFor={field.id}
            className="text-sm font-semibold text-[#334155]"
          >
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            aria-invalid={!!field.error}
            className={`rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[#346aff] focus:ring-4 focus:ring-[#dbe8ff] ${
              field.error ? "border-[#ff8b97]" : "border-[#d7e1ee]"
            }`}
          />
          {field.error && (
            <p className="text-xs text-[#c53045]">{field.error}</p>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between text-sm text-[#64748b]">
        <span>가입 즉시 주문 조회와 장바구니 저장 사용 가능</span>
        <Link
          to="/login"
          className="font-semibold text-[#346aff] hover:underline"
        >
          로그인
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
      >
        회원가입
      </Button>

      <p className="text-center text-sm text-[#64748b]">
        가입을 완료하면 홈, 장바구니, 주문 내역 화면으로 바로 연결됩니다.
      </p>
    </form>
  );
}
