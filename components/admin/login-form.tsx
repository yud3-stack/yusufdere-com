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
        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="E-posta adresin"
          aria-describedby={state?.error ? "login-error" : undefined}
        />
      </div>
      <div>
        <label htmlFor="password">Şifre</label>
        <div className="admin-password-field">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Şifren"
            aria-describedby={state?.error ? "login-error" : undefined}
          />
          <button
            type="button"
            className="admin-password-toggle"
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(value => !value)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
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
        {pending ? (
          <LoaderCircle size={18} className="admin-spin" />
        ) : (
          <ArrowRight size={18} />
        )}
      </button>
    </form>
  );
}
