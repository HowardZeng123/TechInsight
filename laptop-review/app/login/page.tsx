"use client";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider, User, createUserAccount, signInUser, signInWithGoogle } from "@/lib/firebase";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the OOP function from firebase.js
      const user = await signInUser(email, password);
      
      // Check if user is null before storing in localStorage
      if (!user) {
        throw new Error("Authentication failed");
      }
  
      // Store user info consistently with the register page
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0]
      }));
  
      console.log("User logged in:", user);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đã quay trở lại!",
        variant: "default",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không chính xác",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Use the OOP function from firebase.js
      const user = await signInWithGoogle();
      if (!user) {
        throw new Error("Authentication failed");
      }
      // Store user info consistently with the register page
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      console.log("User signed in with Google:", user);
      toast({
        title: "Đăng nhập thành công",
        description: "Đã đăng nhập bằng tài khoản Google",
        variant: "default",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      toast({
        title: "Đăng nhập thất bại",
        description: "Không thể đăng nhập bằng Google",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập email để khôi phục mật khẩu",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email đã gửi",
        description: "Email khôi phục mật khẩu đã được gửi đến hộp thư của bạn",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error.message);
      toast({
        title: "Gửi email thất bại",
        description: "Không thể gửi email khôi phục mật khẩu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex justify-center mb-6">
            <img
              src="/TechInsight_Logo.png"
              alt="Logo"
              className="w-16 h-16"
            />
          </div>
          <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-white">Đăng nhập</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition duration-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Đăng nhập
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 transition duration-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <img
              src="/google-icon.svg"
              alt="Google Icon"
              className="w-5 h-5 mr-2"
            />
            Đăng nhập bằng google
          </button>
          <p className="text-sm text-center">
            <button
              onClick={handleForgotPassword}
              className="text-black hover:underline dark:text-gray-300"
            >
              Quên mật khẩu?
            </button>
          </p>
          <p className="mt-4 text-sm text-center dark:text-gray-300">
            Không có tài khoản?{" "}
            <a href="/register" className="text-black hover:underline dark:text-gray-100">
              Tạo tại khoản ngay
            </a>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}