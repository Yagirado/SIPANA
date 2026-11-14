const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

let csrfRequest;

export class ApiError extends Error {
  constructor(message, { status = 0, payload = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function readCookie(name) {
  const prefix = `${name}=`;
  const value = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);

  return value ? decodeURIComponent(value) : "";
}

async function ensureCsrfCookie() {
  if (!csrfRequest) {
    csrfRequest = fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
      credentials: "include",
      headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
    }).then((response) => {
      if (!response.ok) {
        throw new ApiError("Layanan belum dapat memulai sesi aman.", {
          status: response.status,
        });
      }
    }).catch((error) => {
      csrfRequest = null;
      throw error instanceof ApiError
        ? error
        : new ApiError("Tidak dapat terhubung ke SIPANA. Periksa koneksi lalu coba lagi.");
    });
  }

  return csrfRequest;
}

export async function apiRequest(path, { method = "GET", body } = {}) {
  const normalizedMethod = method.toUpperCase();
  const mutatesState = !["GET", "HEAD", "OPTIONS"].includes(normalizedMethod);

  if (mutatesState) await ensureCsrfCookie();

  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  const csrfToken = readCookie("XSRF-TOKEN");
  if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: normalizedMethod,
      credentials: "include",
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke SIPANA. Periksa koneksi lalu coba lagi.");
  }

  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const validationMessage = payload?.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : null;
    throw new ApiError(
      validationMessage ?? payload?.message ?? "Permintaan belum dapat diproses. Coba lagi.",
      { status: response.status, payload },
    );
  }

  return payload;
}

export async function apiDownload(path) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      credentials: "include",
      headers: { Accept: "text/csv, application/json", "X-Requested-With": "XMLHttpRequest" },
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke SIPANA. Periksa koneksi lalu coba lagi.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(payload?.message ?? "Berkas belum dapat diunduh. Coba lagi.", { status: response.status, payload });
  }

  return response.blob();
}
