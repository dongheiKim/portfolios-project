import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  {
    ignores: ["dist", "coverage", "node_modules"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // 타입 인지 린트 규칙(예: no-floating-promises 등)을 켜고 싶다면
        // project: true, tsconfigRootDir: import.meta.dirname 을 추가하세요.
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      // Vite HMR 경계를 벗어나는 export만 경고 (컴포넌트 파일에서 상수/훅 export는 허용)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // 미사용 변수는 에러이지만, _로 시작하는 인자/변수는 의도적 무시로 허용
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
);
