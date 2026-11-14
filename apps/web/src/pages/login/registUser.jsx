import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AuthField,
  AuthLayout,
  authControlClass,
  FormNotice,
  primaryButtonClass,
} from "../../components/auth-layout.jsx";
import { apiRequest } from "../../lib/api.js";
import { useReferenceData } from "../../lib/use-reference-data.js";

function isWhatsApp(value) {
  const phone = value.replace(/[\s()-]/g, "");
  return /^(?:\+62|0)8\d{7,11}$/.test(phone);
}

export default function RegisUser() {
  const navigate = useNavigate();
  const { data: referenceData, status: referenceStatus } = useReferenceData();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birth_date: "",
    district: "",
    password: "",
    password_confirmation: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice("");
  }

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = {};

    if (values.name.trim().length < 2) nextErrors.name = "Masukkan nama lengkap.";
    if (!values.email.trim()) {
      nextErrors.email = "Masukkan alamat email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!values.phone.trim()) {
      nextErrors.phone = "Masukkan nomor WhatsApp.";
    } else if (!isWhatsApp(values.phone)) {
      nextErrors.phone = "Gunakan nomor WhatsApp Indonesia yang valid.";
    }
    if (!values.district) nextErrors.district = "Pilih kecamatan.";
    if (values.password.length < 8) nextErrors.password = "Gunakan minimal 8 karakter.";
    if (!values.password_confirmation) {
      nextErrors.password_confirmation = "Ulangi kata sandi.";
    } else if (values.password !== values.password_confirmation) {
      nextErrors.password_confirmation = "Kata sandi belum sama.";
    }
    if (!values.consent) nextErrors.consent = "Persetujuan diperlukan untuk membuat akun.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setNotice("");
      return;
    }

    setIsSubmitting(true);
    setNotice("");
    try {
      await apiRequest("/api/register/community", {
        method: "POST",
        body: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone,
          gender: values.gender || null,
          birth_date: values.birth_date || null,
          district: values.district,
          password: values.password,
          password_confirmation: values.password_confirmation,
          consent: values.consent,
        },
      });

      navigate("/login", {
        replace: true,
        state: { registrationNotice: "Pendaftaran akun berhasil. Silakan masuk dengan email dan kata sandi." },
      });
    } catch (error) {
      const fieldErrors = error.payload?.errors;
      if (fieldErrors) {
        setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]])));
      }
      setNotice(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout width="wide">
      <section className="rounded-2xl border border-[#DDE5DC] bg-white p-6 shadow-[0_10px_32px_rgba(24,58,46,0.04)] sm:p-9 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#1C6B4A]">
            Akun penerima
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183A2E] sm:text-[34px]">
            Buat akun SIPANA
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#63756B] sm:text-base">
            Daftar untuk mengklaim makanan gratis di sekitar.
          </p>
        </div>

        <form className="mt-8 space-y-6" noValidate onSubmit={submit}>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <AuthField id="name" label="Nama lengkap" error={errors.name}>
              <input
                autoComplete="name"
                className={authControlClass}
                id="name"
                name="name"
                onChange={updateField}
                placeholder="Nama kamu"
                type="text"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </AuthField>

            <AuthField id="email" label="Email" error={errors.email} hint={!errors.email ? "Digunakan untuk masuk ke SIPANA" : undefined}>
              <input
                autoComplete="email"
                className={authControlClass}
                id="email"
                name="email"
                onChange={updateField}
                placeholder="nama@email.com"
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
              />
            </AuthField>

            <AuthField
              id="phone"
              label="Nomor WhatsApp"
              error={errors.phone}
              hint={!errors.phone ? "Untuk informasi pengambilan" : undefined}
            >
              <input
                autoComplete="tel"
                className={authControlClass}
                id="phone"
                inputMode="tel"
                name="phone"
                onChange={updateField}
                placeholder="08xx xxxx xxxx"
                type="tel"
                value={values.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
              />
            </AuthField>

            <AuthField id="gender" label="Jenis kelamin" error={errors.gender} hint={!errors.gender ? "Opsional" : undefined}>
              <select
                className={`${authControlClass} ${values.gender ? "" : "text-[#829187]"}`}
                id="gender"
                name="gender"
                onChange={updateField}
                value={values.gender}
                aria-invalid={Boolean(errors.gender)}
                aria-describedby={errors.gender ? "gender-error" : "gender-hint"}
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="prefer_not_to_say">Memilih tidak menjawab</option>
              </select>
            </AuthField>

            <AuthField id="birth_date" label="Tanggal lahir" error={errors.birth_date} hint={!errors.birth_date ? "Opsional" : undefined}>
              <input
                autoComplete="bday"
                className={authControlClass}
                id="birth_date"
                max={new Date().toISOString().slice(0, 10)}
                name="birth_date"
                onChange={updateField}
                type="date"
                value={values.birth_date}
                aria-invalid={Boolean(errors.birth_date)}
                aria-describedby={errors.birth_date ? "birth_date-error" : "birth_date-hint"}
              />
            </AuthField>

            <AuthField id="district" label="Kecamatan" error={errors.district}>
              <select
                className={`${authControlClass} ${values.district ? "" : "text-[#829187]"}`}
                id="district"
                name="district"
                disabled={referenceStatus.type !== "ready"}
                onChange={updateField}
                value={values.district}
                aria-invalid={Boolean(errors.district)}
                aria-describedby={errors.district ? "district-error" : undefined}
              >
                <option value="">Pilih kecamatan</option>
                {referenceData.districts.map((district) => (
                  <option key={district.key} value={district.key}>
                    {district.label}
                  </option>
                ))}
              </select>
              {referenceStatus.type === "error" ? <p className="mt-1 text-sm text-[#A33B32]" role="alert">Daftar kecamatan belum dapat dimuat. Muat ulang halaman.</p> : null}
            </AuthField>

            <AuthField id="password" label="Kata sandi" error={errors.password}>
              <input
                autoComplete="new-password"
                className={authControlClass}
                id="password"
                minLength={8}
                name="password"
                onChange={updateField}
                placeholder="Minimal 8 karakter"
                type="password"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
            </AuthField>

            <AuthField id="password_confirmation" label="Ulangi kata sandi" error={errors.password_confirmation}>
              <input
                autoComplete="new-password"
                className={authControlClass}
                id="password_confirmation"
                minLength={8}
                name="password_confirmation"
                onChange={updateField}
                placeholder="Masukkan ulang kata sandi"
                type="password"
                value={values.password_confirmation}
                aria-invalid={Boolean(errors.password_confirmation)}
                aria-describedby={errors.password_confirmation ? "password_confirmation-error" : undefined}
              />
            </AuthField>
          </div>

          <div>
            <label className="flex min-h-11 items-start gap-3 rounded-lg text-sm leading-6 text-[#52645A]">
              <input
                checked={values.consent}
                className="mt-1 size-5 shrink-0 rounded border-[#BCCBBE] accent-[#1C6B4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
                name="consent"
                onChange={updateField}
                type="checkbox"
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                Saya setuju dengan{" "}
                <Link className="font-semibold text-[#1C6B4A] underline underline-offset-2" to="/ketentuan-pengguna">
                  syarat layanan
                </Link>{" "}
                dan{" "}
                <Link className="font-semibold text-[#1C6B4A] underline underline-offset-2" to="/kebijakan-privasi">
                  kebijakan privasi
                </Link>
                .
              </span>
            </label>
            {errors.consent ? (
              <p className="mt-1 text-sm text-[#A33B32]" id="consent-error">
                {errors.consent}
              </p>
            ) : null}
          </div>

          <button
            className={primaryButtonClass}
            disabled={!values.consent || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Membuat akun…" : "Buat akun"}
          </button>
          {notice ? <FormNotice tone="error">{notice}</FormNotice> : null}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E7ECE6] pt-5 text-sm">
          <p className="text-[#52645A]">Sudah punya akun?</p>
          <Link className="font-semibold text-[#1C6B4A] hover:text-[#183A2E]" to="/login">
            Masuk
          </Link>
          <Link className="font-semibold text-[#1C6B4A] hover:text-[#183A2E]" to="/regist-umkm">
            Daftar sebagai UMKM
          </Link>
        </div>
      </section>
    </AuthLayout>
  );
}
