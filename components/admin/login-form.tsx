"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { login } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="admin-login-form" aria-busy={pending}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111827]">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="E-posta adresin"
          aria-describedby={state?.error ? "login-error" : undefined}
          className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#FF9F1C]"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#111827]">
          Şifre
        </label>
        <div className="admin-password-field"><input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="Şifren"
          aria-describedby={state?.error ? "login-error" : undefined}
          className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#FF9F1C]"
        /><button type="button" className="admin-password-toggle" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      </div>
      {state?.error ? (
        <p id="login-error" role="alert" className="admin-error">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="admin-button primary admin-login-submit"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        {pending ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowRight size={18} />}
      </button>
    </form>
  );
}


