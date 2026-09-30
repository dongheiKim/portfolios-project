import { useState } from "react";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/features/auth/model/passwordPolicy";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  general?: string;
}

export function useSignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "이름을 입력해 주세요.";
    if (!email) {
      newErrors.email = "이메일을 입력해 주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력해 주세요.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`;
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      newErrors.password = `비밀번호는 ${MAX_PASSWORD_LENGTH}자 이하여야 합니다.`;
    }
    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해 주세요.";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
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
  };
}
