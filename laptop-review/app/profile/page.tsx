"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { useToast } from "@/hooks/use-toast";
import { auth, User, changeUserPassword } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameChangeSuccess, setNameChangeSuccess] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUserData = localStorage.getItem("user");

      if (!storedUserData) {
        router.push("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUserData);
        
        // Get the current Firebase user
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setCurrentUser(firebaseUser);
            
            // Get user data from local storage
            setDisplayName(userData.displayName || userData.email.split("@")[0]);
            
            // Create a User object
            const userObj = new User(
              userData.uid, 
              userData.email, 
              userData.displayName || userData.email.split("@")[0],
              [],
              userData.role || 'user'
            );
            
            setUser(userObj);
            setLoading(false);
          } else {
            router.push("/login");
          }
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setNameChangeSuccess(false);
      const success = await user.updateProfile(displayName);
      
      if (success) {
        // Update localStorage
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          userData.displayName = displayName;
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        setNameChangeSuccess(true);
        toast({
          title: "Cập nhật thành công",
          description: "Tên hiển thị đã được cập nhật",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật tên:", error.message);
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật tên hiển thị",
        variant: "destructive",
      });
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordChangeSuccess(false);
    
    // Check password match
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu mới không khớp với xác nhận mật khẩu");
      return;
    }
    
    // Check password length
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại để thực hiện thao tác này",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Change password
      await changeUserPassword(currentUser, newPassword);
      
      setPasswordChangeSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Cập nhật thành công",
        description: "Mật khẩu đã được thay đổi",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Lỗi khi thay đổi mật khẩu:", error.message);
      toast({
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Thông tin cá nhân</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl text-gray-600 dark:text-gray-300">
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Thay đổi tên hiển thị</h3>
              
              <form onSubmit={handleChangeName} className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Cập nhật
                </button>
                
                {nameChangeSuccess && (
                  <p className="text-green-500 dark:text-green-400 text-sm mt-2">
                    Tên hiển thị đã được cập nhật thành công!
                  </p>
                )}
              </form>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Thay đổi mật khẩu</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">
                  {passwordError}
                </p>
              )}
              
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cập nhật mật khẩu
              </button>
              
              {passwordChangeSuccess && (
                <p className="text-green-500 dark:text-green-400 text-sm mt-2">
                  Mật khẩu đã được thay đổi thành công!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 