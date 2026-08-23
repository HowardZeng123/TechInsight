// Tạo file mới: components/auth/AdminProtection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/firebase";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function AdminProtection({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userFromStorage = localStorage.getItem('user');
        
        if (!userFromStorage) {
          router.push('/unauthorized');
          return;
        }
        
        const userData = JSON.parse(userFromStorage);
        const userObj = await User.getFromFirestore(userData.uid);
        
        if (!userObj || !userObj.isAdmin()) {
          router.push('/unauthorized');
          return;
        }
        
        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền admin:", error);
        router.push('/unauthorized');
      }
    };
    
    // Đặt timeout ngắn để đảm bảo localStorage sẵn sàng
    const timeoutId = setTimeout(() => {
      checkAdminStatus();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return isAdmin ? children : null;
}