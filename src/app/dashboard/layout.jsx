// app/dashboard/layout.jsx
"use client";
import Sidebar from "../conponents/sidebar/page";
import { useGetMeQuery } from "../../hooks/api/userSliceAPI";
import { setCredentials } from "../../hooks/api/authSliceAPI";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials({ user: data.data }));
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-60 flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
