import { NextResponse } from "next/server";
import { User } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    // Lấy dữ liệu từ body request
    const body = await request.json();
    const { userId } = body;

    // Kiểm tra userId
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin userId" },
        { status: 400 }
      );
    }

    // Lấy thông tin người dùng từ Firestore
    const userObj = await User.getFromFirestore(userId);

    if (!userObj) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền admin
    const isAdmin = userObj.isAdmin();

    return NextResponse.json({ 
      success: true,
      isAdmin: isAdmin
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền admin:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
} 