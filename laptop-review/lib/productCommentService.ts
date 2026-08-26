import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "product_comments";

export interface ProductComment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export const productCommentService = {
  // Lấy bình luận của sản phẩm
  getCommentsByProductId: async (productId: string): Promise<ProductComment[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);
      const comments: ProductComment[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          productId: data.productId,
          userId: data.userId,
          username: data.username,
          content: data.content,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          likes: data.likes || 0
        });
      });
      
      return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Lỗi lấy bình luận sản phẩm:", error);
      return [];
    }
  },

  // HACK: Lấy tất cả bình luận cho chatbot
  getAllComments: async (): Promise<ProductComment[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      const comments: ProductComment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          productId: data.productId,
          userId: data.userId,
          username: data.username,
          content: data.content,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          likes: data.likes || 0
        });
      });
      return comments;
    } catch (error) {
      console.error("Lỗi lấy tất cả bình luận:", error);
      return [];
    }
  },

  // Thêm bình luận mới
  addComment: async (commentData: Omit<ProductComment, "id" | "createdAt" | "likes">) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...commentData,
        likes: 0,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Lỗi thêm bình luận sản phẩm:", error);
      throw error;
    }
  },

  // Thích bình luận
  likeComment: async (commentId: string, currentLikes: number) => {
    try {
      const commentRef = doc(db, COLLECTION_NAME, commentId);
      await updateDoc(commentRef, {
        likes: currentLikes + 1
      });
    } catch (error) {
      console.error("Lỗi like bình luận:", error);
      throw error;
    }
  }
};
