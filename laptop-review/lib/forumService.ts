import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  updatedAt: any;
  views: number;
  likes: number;
  commentCount: number;
}

export interface ForumComment {
  id?: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
}

const POSTS_COLLECTION = "forum_posts";
const COMMENTS_COLLECTION = "forum_comments";

export const forumService = {
  // Create a new post
  async createPost(postData: Omit<ForumPost, "id" | "createdAt" | "updatedAt" | "views" | "likes" | "commentCount">) {
    try {
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        commentCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating forum post:", error);
      throw error;
    }
  },

  // Get all posts, ordered by newest
  async getAllPosts(category?: string) {
    try {
      let q = collection(db, POSTS_COLLECTION) as any;
      
      if (category && category !== 'all') {
        q = query(q, where("category", "==", category), orderBy("createdAt", "desc"));
      } else {
        q = query(q, orderBy("createdAt", "desc"));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumPost[];
    } catch (error) {
      console.error("Error getting forum posts:", error);
      throw error;
    }
  },

  // Get a single post by ID
  async getPostById(id: string) {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Increment views
        await updateDoc(docRef, {
          views: (docSnap.data().views || 0) + 1
        });
        
        return {
          id: docSnap.id,
          ...docSnap.data(),
          views: (docSnap.data().views || 0) + 1
        } as ForumPost;
      }
      return null;
    } catch (error) {
      console.error("Error getting forum post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(id: string) {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
      // Also delete all comments for this post
      const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where("postId", "==", id));
      const commentsSnapshot = await getDocs(commentsQuery);
      const deletePromises = commentsSnapshot.docs.map(commentDoc => deleteDoc(commentDoc.ref));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting forum post:", error);
      throw error;
    }
  },

  // Add a comment to a post
  async addComment(postId: string, commentData: Omit<ForumComment, "id" | "postId" | "createdAt">) {
    try {
      const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
        postId,
        ...commentData,
        createdAt: serverTimestamp()
      });
      
      // Update comment count on post
      const postRef = doc(db, POSTS_COLLECTION, postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        await updateDoc(postRef, {
          commentCount: (postData.commentCount || 0) + 1
        });
        
        // Tạo thông báo cho chủ bài viết (nếu người bình luận khác người đăng)
        if (postData.authorId && postData.authorId !== commentData.authorId) {
          try {
            await addDoc(collection(db, "notification"), {
              title: `${commentData.authorName} đã bình luận bài viết "${postData.title}" của bạn`,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
              read: false,
              userId: postData.authorId,
              postId: postId,
              link: `/forum/${postId}`,
              createdAt: serverTimestamp()
            });
          } catch (notiError) {
            console.error("Lỗi tạo thông báo:", notiError);
          }
        }
      }
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Get comments for a post
  async getCommentsByPostId(postId: string) {
    try {
      const q = query(
        collection(db, COMMENTS_COLLECTION), 
        where("postId", "==", postId)
      );
      
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumComment[];
      
      // Sort locally to avoid needing a Firestore composite index
      return comments.sort((a, b) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return dateA - dateB;
      });
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  }
};
