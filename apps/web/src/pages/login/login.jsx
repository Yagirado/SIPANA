import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { dashboardPathByRole } from "../../config/dashboard-navigation.js";
import {
  AuthField,
  AuthLayout,
  authControlClass,
  FormNotice,
  primaryButtonClass,
} from "../../components/auth-layout.jsx";

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, status, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const registrationNotice = location.state?.registrationNotice;

  if (status === "authenticated") {
    return <Navigate to={dashboardPathByRole[user?.role] ?? "/dashboard"} replace />;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setNotice("");
  }

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("");
    try {
      const account = await login({ email: values.email.trim(), password: values.password });
      const returnPath = location.state?.from;
      const safeCommunityReturn = typeof returnPath === "string" && returnPath.startsWith("/") && !returnPath.startsWith("//");
      navigate(account.role === "community" && safeCommunityReturn ? returnPath : dashboardPathByRole[account.role] ?? "/", { replace: true });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout width="compact">
      <section className="rounded-2xl border border-[#DDE5DC] bg-white p-6 shadow-[0_10px_32px_rgba(24,58,46,0.04)] sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#1C6B4A]">
          Selamat datang kembali
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183A2E] sm:text-[34px]">
          Masuk ke SIPANA
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#63756B] sm:text-base">
          Masuk ke akun warga, UMKM, atau administrator.
        </p>

        {registrationNotice ? (
          <div className="mt-5">
            <FormNotice>{registrationNotice}</FormNotice>
          </div>
        ) : null}

        <form className="mt-8 space-y-5" noValidate onSubmit={submit}>
          <AuthField id="email" label="Email">
            <input
              autoComplete="username"
              className={authControlClass}
              id="email"
              name="email"
              onChange={updateField}
              placeholder="nama@email.com"
              type="email"
              value={values.email}
              required
            />
          </AuthField>

          <AuthField id="password" label="Kata sandi">
            <div className="relative">
              <input
                autoComplete="current-password"
                className={`${authControlClass} pr-12`}
                id="password"
                name="password"
                onChange={updateField}
                placeholder="Kata sandi"
                type={showPassword ? "text" : "password"}
                value={values.password}
                required
              />
              <button
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid size-12 place-items-center rounded-r-xl text-[#1C6B4A] transition-colors hover:text-[#183A2E] focus-visible:outline-2 focus-visible:outline-[#1C6B4A]"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
              </button>
            </div>
          </AuthField>

          <div className="flex justify-end">
            <p className="text-xs text-[#63756B]">Pemulihan kata sandi belum tersedia.</p>
          </div>

          <button className={primaryButtonClass} disabled={isSubmitting} type="submit">
            {isSubmitting ? "Memeriksa akun…" : "Masuk"}
          </button>

          {notice ? <FormNotice tone="error">{notice}</FormNotice> : null}
        </form>

        <div className="mt-6 border-t border-[#E7ECE6] pt-5">
          <p className="text-sm text-[#52645A]">Belum punya akun?</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link className="text-[#1C6B4A] hover:text-[#183A2E]" to="/regist-user">
              Daftar sebagai anggota
            </Link>
            <Link className="text-[#1C6B4A] hover:text-[#183A2E]" to="/regist-umkm">
              Daftarkan UMKM
            </Link>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}
