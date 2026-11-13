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

const districts = ["Karawang Barat", "Telukjambe Timur", "Karawang Timur"];
const businessTypes = [
  "Warung makan",
  "Toko roti dan kue",
  "Katering",
  "Kedai minuman",
  "Lainnya",
];
const acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

function isWhatsApp(value) {
  const phone = value.replace(/[\s()-]/g, "");
  return /^(?:\+62|0)8\d{7,11}$/.test(phone);
}

function validateFile(file, label) {
  if (!file) return `Pilih ${label.toLowerCase()}.`;
  if (!acceptedFileTypes.includes(file.type))
    return "Gunakan foto JPG, PNG, atau WebP.";
  if (file.size > maxFileSize) return "Ukuran file maksimal 5 MB.";
  return "";
}

export default function RegisUmkm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    owner: "",
    email: "",
    phone: "",
    business: "",
    businessType: "",
    district: "",
    address: "",
    password: "",
    passwordConfirmation: "",
  });
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState({ businessProof: null });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice("");
  }

  function updateFile(event) {
    const { name, files: selectedFiles } = event.target;
    const file = selectedFiles?.[0] ?? null;
    setFiles((current) => ({ ...current, [name]: file }));
    setErrors((current) => ({
      ...current,
      [name]: validateFile(file, "foto usaha"),
    }));
    setNotice("");
  }

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = {};

    if (step === 2) {
      if (!values.email.trim()) {
        nextErrors.email = "Masukkan email untuk masuk ke SIPANA.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        nextErrors.email = "Masukkan alamat email yang valid.";
      }
      if (values.password.length < 8)
        nextErrors.password = "Gunakan minimal 8 karakter.";
      if (!values.passwordConfirmation) {
        nextErrors.passwordConfirmation = "Ulangi kata sandi.";
      } else if (values.password !== values.passwordConfirmation) {
        nextErrors.passwordConfirmation = "Kata sandi belum sama.";
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setNotice("");
        return;
      }

      setIsSubmitting(true);
      setNotice("");
      const payload = new FormData();
      payload.append("owner", values.owner.trim());
      payload.append("email", values.email.trim());
      payload.append("phone", values.phone);
      payload.append("business", values.business.trim());
      payload.append("businessType", values.businessType);
      payload.append("district", values.district);
      payload.append("address", values.address.trim());
      payload.append("password", values.password);
      payload.append("password_confirmation", values.passwordConfirmation);
      payload.append("business_proof", files.businessProof);

      try {
        const result = await apiRequest("/api/register/umkm", {
          method: "POST",
          body: payload,
        });
        navigate("/login", {
          replace: true,
          state: { registrationNotice: result.message },
        });
      } catch (error) {
        const fieldMap = {
          business_proof: "businessProof",
          password_confirmation: "passwordConfirmation",
        };
        const fieldErrors = error.payload?.errors;
        if (fieldErrors) {
          setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [fieldMap[field] ?? field, messages[0]])));
        }
        setNotice(error.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (values.owner.trim().length < 2)
      nextErrors.owner = "Masukkan nama pemilik.";
    if (!values.phone.trim()) {
      nextErrors.phone = "Masukkan nomor kontak.";
    } else if (!isWhatsApp(values.phone)) {
      nextErrors.phone = "Gunakan nomor WhatsApp Indonesia yang valid.";
    }
    if (values.business.trim().length < 2)
      nextErrors.business = "Masukkan nama usaha.";
    if (!values.businessType) nextErrors.businessType = "Pilih jenis usaha.";
    if (!values.district) nextErrors.district = "Pilih kecamatan yang tersedia.";
    if (values.address.trim().length < 5)
      nextErrors.address = "Masukkan alamat usaha yang jelas.";

    const proofError = validateFile(files.businessProof, "foto usaha");
    if (proofError) nextErrors.businessProof = proofError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setNotice("");
    } else {
      setStep(2);
      setNotice("");
    }
  }

  return (
    <AuthLayout width="wide">
      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-[#63756B]">
        <Link
          className="rounded font-semibold text-[#1C6B4A] hover:text-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
          to="/regist-user"
        >
          ← Pilih jenis akun
        </Link>
        <span className="shrink-0">
          Daftar UMKM <span aria-hidden="true">·</span> Langkah {step} dari 2
        </span>
      </div>

      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1C6B4A]">
          {step === 1 ? "Gabung sebagai pemberi" : "Akses akun UMKM"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183A2E] sm:text-[34px]">
          {step === 1 ? "Daftarkan usaha kulinermu" : "Buat akses akun"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#63756B] sm:text-base">
          {step === 1
            ? "Profil usaha akan ditinjau admin sebelum kamu dapat memposting."
            : "Gunakan email dan kata sandi ini untuk masuk ke SIPANA."}
        </p>
      </div>

      <form
        className="rounded-2xl border border-[#DDE5DC] bg-white p-5 shadow-[0_10px_32px_rgba(24,58,46,0.04)] sm:p-8 lg:p-9"
        noValidate
        onSubmit={submit}
      >
        {step === 1 ? (
          <>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <AuthField id="owner" label="Nama pemilik" error={errors.owner}>
                <input
                  autoComplete="name"
                  className={authControlClass}
                  id="owner"
                  name="owner"
                  onChange={updateField}
                  placeholder="Nama sesuai identitas"
                  type="text"
                  value={values.owner}
                  aria-invalid={Boolean(errors.owner)}
                  aria-describedby={errors.owner ? "owner-error" : undefined}
                />
              </AuthField>

              <AuthField id="phone" label="Nomor kontak" error={errors.phone}>
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
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </AuthField>

              <AuthField
                id="business"
                label="Nama usaha"
                error={errors.business}
              >
                <input
                  autoComplete="organization"
                  className={authControlClass}
                  id="business"
                  name="business"
                  onChange={updateField}
                  placeholder="Nama UMKM kuliner"
                  type="text"
                  value={values.business}
                  aria-invalid={Boolean(errors.business)}
                  aria-describedby={
                    errors.business ? "business-error" : undefined
                  }
                />
              </AuthField>

              <AuthField
                id="businessType"
                label="Jenis usaha"
                error={errors.businessType}
              >
                <select
                  className={`${authControlClass} ${values.businessType ? "" : "text-[#829187]"}`}
                  id="businessType"
                  name="businessType"
                  onChange={updateField}
                  value={values.businessType}
                  aria-invalid={Boolean(errors.businessType)}
                  aria-describedby={
                    errors.businessType ? "businessType-error" : undefined
                  }
                >
                  <option value="">Pilih jenis usaha</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </AuthField>

              <AuthField
                id="district"
                label="Kecamatan"
                error={errors.district}
              >
                <select
                  className={`${authControlClass} ${values.district ? "" : "text-[#829187]"}`}
                  id="district"
                  name="district"
                  onChange={updateField}
                  value={values.district}
                  aria-invalid={Boolean(errors.district)}
                  aria-describedby={
                    errors.district ? "district-error" : undefined
                  }
                >
                  <option value="">Pilih kecamatan</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </AuthField>

              <AuthField
                id="address"
                label="Alamat usaha"
                error={errors.address}
              >
                <input
                  autoComplete="street-address"
                  className={authControlClass}
                  id="address"
                  name="address"
                  onChange={updateField}
                  placeholder="Alamat pickup"
                  type="text"
                  value={values.address}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                />
              </AuthField>
            </div>

            <div className="mt-7">
              <div className="mt-3 w-full">
                {[
                  { id: "businessProof", label: "Foto usaha" },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <label
                      className="flex min-h-32 w-full cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#B9CBB9] bg-[#F5F7F1] px-5 py-5 text-sm font-semibold text-[#1C6B4A] transition-colors hover:border-[#1C6B4A] hover:bg-[#F0F5EC] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#1C6B4A] sm:px-7"
                      htmlFor={id}
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-2xl"
                      >
                        +
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base">
                          {files[id]?.name ?? label}
                        </span>
                        <span className="mt-1 block text-xs font-normal text-[#63756B]">
                          JPG, PNG, WebP · Maks. 5 MB
                        </span>
                      </span>
                      <input
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        id={id}
                        name={id}
                        onChange={updateFile}
                        type="file"
                        aria-invalid={Boolean(errors[id])}
                        aria-describedby={
                          errors[id] ? `${id}-error` : undefined
                        }
                      />
                    </label>
                    {errors[id] ? (
                      <p
                        className="mt-1.5 text-sm text-[#A33B32]"
                        id={`${id}-error`}
                      >
                        {errors[id]}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#63756B]">
              Syarat penggunaan UMKM akan diminta sebelum posting pertama.
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 rounded-xl border border-[#DDE5DC] bg-[#F8FAF6] p-4 text-sm sm:grid-cols-2 sm:p-5">
              <div>
                <p className="text-[#63756B]">Pemilik</p>
                <p className="mt-1 font-semibold text-[#183A2E]">
                  {values.owner}
                </p>
              </div>
              <div>
                <p className="text-[#63756B]">Nama usaha</p>
                <p className="mt-1 font-semibold text-[#183A2E]">
                  {values.business}
                </p>
              </div>
              <div>
                <p className="text-[#63756B]">Nomor kontak</p>
                <p className="mt-1 font-semibold text-[#183A2E]">
                  {values.phone}
                </p>
              </div>
              <div>
                <p className="text-[#63756B]">Email untuk masuk</p>
                <p className="mt-1 break-all font-semibold text-[#183A2E]">
                  {values.email || "Belum diisi"}
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <AuthField
                id="email"
                label="Email"
                error={errors.email}
                hint={!errors.email ? "Digunakan untuk masuk ke SIPANA" : undefined}
              >
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
                id="password"
                label="Kata sandi"
                error={errors.password}
                hint={!errors.password ? "Minimal 8 karakter" : undefined}
              >
                <input
                  autoComplete="new-password"
                  className={authControlClass}
                  id="password"
                  minLength={8}
                  name="password"
                  onChange={updateField}
                  placeholder="Buat kata sandi"
                  type="password"
                  value={values.password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : "password-hint"
                  }
                />
              </AuthField>
              <AuthField
                id="passwordConfirmation"
                label="Ulangi kata sandi"
                error={errors.passwordConfirmation}
              >
                <input
                  autoComplete="new-password"
                  className={authControlClass}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  onChange={updateField}
                  placeholder="Masukkan ulang kata sandi"
                  type="password"
                  value={values.passwordConfirmation}
                  aria-invalid={Boolean(errors.passwordConfirmation)}
                  aria-describedby={
                    errors.passwordConfirmation
                      ? "passwordConfirmation-error"
                      : undefined
                  }
                />
              </AuthField>
            </div>
          </div>
        )}

        {step === 2 ? (
          <button
            className="mt-5 rounded text-sm font-semibold text-[#1C6B4A] hover:text-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
            onClick={() => {
              setStep(1);
              setErrors({});
              setNotice("");
            }}
            type="button"
          >
            ← Kembali ke data usaha
          </button>
        ) : null}
        <button className={`${primaryButtonClass} mt-5`} disabled={isSubmitting} type="submit">
          {step === 1 ? "Lanjutkan" : isSubmitting ? "Menyimpan akun…" : "Buat akun UMKM"}
        </button>
        {notice ? (
          <div className="mt-4">
            <FormNotice>{notice}</FormNotice>
          </div>
        ) : null}
      </form>

      <p className="mt-5 text-center text-sm text-[#52645A]">
        Sudah punya akun?{" "}
        <Link
          className="font-semibold text-[#1C6B4A] hover:text-[#183A2E]"
          to="/login"
        >
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
