import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Mật khẩu bí mật để xác thực quyền đặt admin (nên đặt trong biến môi trường)
const ADMIN_SECRET = process.env.ADMIN_SECRET || "SecretKey";
export async function POST(request: Request) {
  try {
    // Lấy dữ liệu từ body request
    const body = await request.json();
    const { userId, secretKey } = body;

    // Kiểm tra mật khẩu bí mật
    if (secretKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Kiểm tra userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin userId" },
        { status: 400 }
      );
    }

    // Lấy thông tin người dùng từ Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Cập nhật quyền admin cho người dùng
    await updateDoc(userRef, {
      role: "admin"
    });

    return NextResponse.json({ 
      success: true,
      message: "Đã đặt người dùng thành admin thành công"
    });
  } catch (error) {
    console.error("Lỗi khi đặt người dùng thành admin:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
} 