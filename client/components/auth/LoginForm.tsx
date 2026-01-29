"use client";

import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import axios from "@/lib/axios";
import { LoginSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

type FormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const handleLoginSubmit = async (data: FieldValues) => {
    toast.loading("Logging in...", { id: "login" });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/v1/auth/login", // ✅ BACKEND URL
        {
          username: data.email,
          password: data.password,
        },
        {
          withCredentials: true, // ✅ MUST be here
        }
      );

      // ✅ If backend returns token in response body
      if (response.data?.access_token) {
        setCookie("token", response.data.access_token, {
          maxAge: 60 * 60 * 24, // 1 day
        });
      }

      toast.success("Logged in successfully!", { id: "login" });
      reset();
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.msg || "Invalid email or password",
        { id: "login" }
      );
    }
  };

  return (
    <div className="sm:max-w-[460px] shadow-sm mx-auto bg-white p-5 border rounded-md">
      <h2 className="text-2xl font-bold pb-5 text-center underline">
        Login
      </h2>

      <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-md border outline-none"
            autoComplete="off"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
