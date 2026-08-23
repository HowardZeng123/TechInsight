import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  where
} from 'firebase/firestore';

// News Services
export const newsService = {
  // Get all news items
  getAll: async () => {
    try {
      const newsCollectionRef = collection(db, "news");
      const q = query(newsCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting news: ", error);
      throw error;
    }
  },
  
  // Get a specific news item by ID
  getById: async (id) => {
    try {
      const newsDocRef = doc(db, "news", id);
      const docSnapshot = await getDoc(newsDocRef);
      
      if (docSnapshot.exists()) {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting news item: ", error);
      throw error;
    }
  },
  
  // Get latest news items with a limit
  getLatest: async (itemCount = 3) => {
    try {
      const newsCollectionRef = collection(db, "news");
      const q = query(
        newsCollectionRef, 
        orderBy("createdAt", "desc"),
        limit(itemCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting latest news: ", error);
      throw error;
    }
  },
  
  // Add a new news item
  add: async (newsItem) => {
    try {
      const newsCollectionRef = collection(db, "news");
      const docRef = await addDoc(newsCollectionRef, {
        ...newsItem,
        createdAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding news item: ", error);
      throw error;
    }
  }
};

// Articles Services
export const articleService = {
  // Get all articles
  getAll: async () => {
    try {
      const articlesCollectionRef = collection(db, "articles");
      const q = query(articlesCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting articles: ", error);
      throw error;
    }
  },
  
  // Get a specific article by ID
  getById: async (id) => {
    try {
      const articleDocRef = doc(db, "articles", id);
      const docSnapshot = await getDoc(articleDocRef);
      
      if (docSnapshot.exists()) {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting article: ", error);
      throw error;
    }
  },
  
  // Get latest articles with a limit
  getLatest: async (itemCount = 3) => {
    try {
      const articlesCollectionRef = collection(db, "articles");
      const q = query(
        articlesCollectionRef, 
        orderBy("createdAt", "desc"),
        limit(itemCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting latest articles: ", error);
      throw error;
    }
  },
  
  // Add a new article
  add: async (article) => {
    try {
      const articlesCollectionRef = collection(db, "articles");
      const docRef = await addDoc(articlesCollectionRef, {
        ...article,
        createdAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding article: ", error);
      throw error;
    }
  }
};

// Laptop Services
export const laptopService = {
  // Get all laptops
  getAll: async () => {
    try {
      const laptopsCollectionRef = collection(db, "laptops");
      const querySnapshot = await getDocs(laptopsCollectionRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting laptops: ", error);
      throw error;
    }
  },
  
  // Get a specific laptop by ID
  getById: async (id) => {
    try {
      console.log("Đang tìm laptop với ID:", id);
      
      // Trước tiên thử tìm bằng ID Firestore
      const laptopDocRef = doc(db, "laptops", id);
      const docSnapshot = await getDoc(laptopDocRef);
      
      if (docSnapshot.exists()) {
        console.log("Đã tìm thấy laptop bằng Firestore ID");
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } 
      
      // Nếu không tìm thấy bằng ID, thử tìm bằng slug/ID đơn giản
      console.log("Không tìm thấy bằng Firestore ID, thử tìm bằng slug:", id);
      const laptopsCollectionRef = collection(db, "laptops");
      const q = query(laptopsCollectionRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log("Đã tìm thấy laptop bằng ID đơn giản");
        const docSnap = querySnapshot.docs[0];
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      console.log("Không tìm thấy laptop với ID:", id);
      return null;
    } catch (error) {
      console.error("Error getting laptop: ", error);
      throw error;
    }
  },
  
  // Get a specific laptop by slug/friendly ID
  getBySlug: async (slug) => {
    try {
      const laptopsCollectionRef = collection(db, "laptops");
      const q = query(laptopsCollectionRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } else {
        // Trả về null nếu không tìm thấy
        return null;
      }
    } catch (error) {
      console.error("Error getting laptop by slug: ", error);
      throw error;
    }
  },
  
  // Search laptops by name or specs
  search: async (query) => {
    try {
      const laptopsCollectionRef = collection(db, "laptops");
      const querySnapshot = await getDocs(laptopsCollectionRef);
      
      // Perform client-side filtering
      // Note: For a production app, consider using Firebase extensions like Algolia
      const results = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(laptop => {
          const searchTerms = query.toLowerCase().split(' ');
          return searchTerms.some(term => 
            laptop.name.toLowerCase().includes(term) ||
            laptop.specs.cpu.toLowerCase().includes(term) ||
            laptop.specs.gpu.toLowerCase().includes(term)
          );
        });
      
      return results;
    } catch (error) {
      console.error("Error searching laptops: ", error);
      throw error;
    }
  },
  
  // Add a new laptop
  add: async (laptop) => {
    try {
      const laptopsCollectionRef = collection(db, "laptops");
      const docRef = await addDoc(laptopsCollectionRef, {
        ...laptop,
        createdAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding laptop: ", error);
      throw error;
    }
  }
};

// Smartphone Services
export const smartphoneService = {
  // Get all smartphones
  getAll: async () => {
    try {
      const smartphonesCollectionRef = collection(db, "smartphones");
      const querySnapshot = await getDocs(smartphonesCollectionRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting smartphones: ", error);
      throw error;
    }
  },
  
  // Get a specific smartphone by ID
  getById: async (id) => {
    try {
      const smartphoneDocRef = doc(db, "smartphones", id);
      const docSnapshot = await getDoc(smartphoneDocRef);
      
      if (docSnapshot.exists()) {
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } 
      
      const smartphonesCollectionRef = collection(db, "smartphones");
      const q = query(smartphonesCollectionRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error getting smartphone: ", error);
      throw error;
    }
  },
  
  // Get a specific smartphone by slug
  getBySlug: async (slug) => {
    try {
      const smartphonesCollectionRef = collection(db, "smartphones");
      const q = query(smartphonesCollectionRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        return {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting smartphone by slug: ", error);
      throw error;
    }
  },
  
  // Search smartphones
  search: async (query) => {
    try {
      const smartphonesCollectionRef = collection(db, "smartphones");
      const querySnapshot = await getDocs(smartphonesCollectionRef);
      
      const results = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(phone => {
          const searchTerms = query.toLowerCase().split(' ');
          return searchTerms.some(term => 
            phone.name.toLowerCase().includes(term) ||
            phone.specs.soc.toLowerCase().includes(term)
          );
        });
      
      return results;
    } catch (error) {
      console.error("Error searching smartphones: ", error);
      throw error;
    }
  },
  
  // Add a new smartphone
  add: async (smartphone) => {
    try {
      const smartphonesCollectionRef = collection(db, "smartphones");
      const docRef = await addDoc(smartphonesCollectionRef, {
        ...smartphone,
        createdAt: Timestamp.fromDate(new Date())
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding smartphone: ", error);
      throw error;
    }
  }
};
