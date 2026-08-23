// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User as FirebaseUser, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

export const firebaseConfig = {

  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Add Google Provider

// User class for OOP approach with TypeScript
export class User {
  uid: string;
  email: string;
  displayName: string;
  favoriteItems: string[];
  role: string;

  constructor(uid: string, email: string, displayName: string = '', favoriteItems: string[] = [], role: string = 'user') {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.favoriteItems = favoriteItems;
    this.role = role;
  }

    // Phương thức kiểm tra admin
    isAdmin(): boolean {
      return this.role === 'admin';
    }

  // Save user to Firestore
  async saveToFirestore(): Promise<boolean> {
    try {
      await setDoc(doc(db, "users", this.uid), {
        email: this.email,
        displayName: this.displayName,
        favoriteItems: this.favoriteItems,
        createdAt: new Date(),
        role: this.role,
      }, { merge: true });
      return true;
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      return false;
    }
  }

  // Get user data from Firestore
  static async getFromFirestore(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new User(
          uid,
          data.email,
          data.displayName || '',
          data.favoriteItems || [],
          data.role || 'user'
        );
      } else {
        console.log("No user document found!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      return null;
    }
  }

  // Add item to favorites
  async addFavoriteItem(itemId: string): Promise<boolean> {
    try {
      this.favoriteItems.push(itemId);
      await updateDoc(doc(db, "users", this.uid), {
        favoriteItems: arrayUnion(itemId)
      });
      return true;
    } catch (error) {
      console.error("Error adding favorite item:", error);
      return false;
    }
  }

  // Remove item from favorites
  async removeFavoriteItem(itemId: string): Promise<boolean> {
    try {
      this.favoriteItems = this.favoriteItems.filter(item => item !== itemId);
      await updateDoc(doc(db, "users", this.uid), {
        favoriteItems: arrayRemove(itemId)
      });
      return true;
    } catch (error) {
      console.error("Error removing favorite item:", error);
      return false;
    }
  }

  // Check if an item is in favorites
  isFavorite(itemId: string): boolean {
    return this.favoriteItems.includes(itemId);
  }
  
  // Get all favorite items
  getFavorites(): string[] {
    return this.favoriteItems;
  }
  
  // Update user profile
  async updateProfile(newDisplayName: string): Promise<boolean> {
    try {
      this.displayName = newDisplayName;
      await updateDoc(doc(db, "users", this.uid), {
        displayName: newDisplayName
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      return false;
    }
  }
}

// Authentication helper functions
export const createUserAccount = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = new User(userCredential.user.uid, email, '', [], 'user');
    await newUser.saveToFirestore();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await User.getFromFirestore(userCredential.user.uid);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    let userObj = await User.getFromFirestore(user.uid);
    
    // If not, create a new user document
    if (!userObj) {
      userObj = new User(user.uid, user.email || '', user.displayName || '', [], 'user');
      await userObj.saveToFirestore();
    }
    
    return userObj;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Hàm để đặt người dùng thành admin
export const setUserAsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error("Không tìm thấy người dùng với ID:", uid);
      return false;
    }
    
    await updateDoc(userRef, {
      role: "admin"
    });
    
    console.log("Đã đặt người dùng thành admin:", uid);
    return true;
  } catch (error) {
    console.error("Lỗi khi đặt người dùng thành admin:", error);
    return false;
  }
};

// Hàm đổi mật khẩu
export const changeUserPassword = async (user: FirebaseUser, newPassword: string): Promise<boolean> => {
  try {
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    throw error;
  }
};
