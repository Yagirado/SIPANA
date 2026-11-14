import { Link } from "react-router";

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
          <Link className="hover:text-[#183A2E]" to="/ketentuan-pengguna">
            Ketentuan Pengguna
          </Link>
          <Link className="hover:text-[#183A2E]" to="/kebijakan-privasi">
            Kebijakan Privasi
          </Link>
        </nav>
      </div>
    </footer>
  );
}
