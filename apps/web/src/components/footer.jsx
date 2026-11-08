export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div>
          <p className="font-bold">
            SIPANA <span className="mt-2 text-[10px] text-[#63756B]">© {new Date().getFullYear()}</span>
          </p>
          <p className="mt-1 text-sm text-[#63756B]">
            Pangan berlebih, manfaat bersama · Karawang
          </p>
        </div>
        <nav
          aria-label="Navigasi footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#52645A]"
        >
          <a className="hover:text-[#183A2E]" href="/ketentuan-pengguna">
            Ketentuan Pengguna
          </a>
          <a className="hover:text-[#183A2E]" href="/kebijakan-privasi">
            Kebijakan Privasi
          </a>
        </nav>
      </div>
    </footer>
  );
}
