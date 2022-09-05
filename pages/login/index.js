import Link from "next/link";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { getError } from "../../utils/error";
import { useEffect } from "react";
import { useRouter } from "next/router";

function LoginPage() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session?.user, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error, { type: "error" });
      }
    } catch (error) {
      toast.error(getError(error), { type: "error" });
    }
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(submitHandler)} className="mx-auto max-w-md">
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            autoFocus
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="w-full"
            id="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "Password is more than 5 chars" },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button type="submit" className="primary-button">
            Login
          </button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </div>
      </form>
    </Layout>
  );
}

export default LoginPage;
