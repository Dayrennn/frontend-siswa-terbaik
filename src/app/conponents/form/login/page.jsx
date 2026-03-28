"use client";
import { useState } from "react";
import { useLoginMutation } from "../../../../hooks/api/userSliceAPI";
import { setCredentials } from "../../../../hooks/api/authSliceAPI";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      const user = result.data;
      dispatch(setCredentials({ user }));

      // redirect sesuai role
      switch (user.role) {
        case "Admin":
          router.push("/dashboard/admin");
          break;

        case "Guru":
          router.push("/dashboard/guru");
          break;

        case "WaliKelas":
          router.push("/dashboard/wali-kelas");
          break;

        case "KepalaSekolah":
          router.push("/dashboard/kepala-sekolah");
          break;

        case "WakilKepalaSekolah":
          router.push("/dashboard/wakil-kepala-sekolah");
          break;

        default:
          router.push("/login");
      }
    } catch (err) {
      console.error("Login gagal", err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
