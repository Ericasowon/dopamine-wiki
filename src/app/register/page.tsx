"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "회원가입 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🌿</div>
          <h1 className="text-xl font-bold text-gray-800">회원가입</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "이름", type: "text", placeholder: "홍길동" },
            { key: "username", label: "사용자 이름", type: "text", placeholder: "gildong (영문, 숫자, _)" },
            { key: "email", label: "이메일", type: "email", placeholder: "email@example.com" },
            { key: "password", label: "비밀번호", type: "password", placeholder: "8자 이상" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={f.placeholder} />
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} style={{ backgroundColor: "#1a6e3c" }} className="w-full text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" style={{ color: "#1a6e3c" }} className="font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}
