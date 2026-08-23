import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { laptops } from '../mock_data/data';

// Function to seed laptop data
export const seedLaptopData = async () => {
  try {
    const laptopsCollectionRef = collection(db, "laptops");
    
    for (const laptop of laptops) {
      await addDoc(laptopsCollectionRef, {
        ...laptop,
        createdAt: Timestamp.fromDate(new Date())
      });
    }
    
    console.log("Laptop data successfully seeded to Firestore!");
    return true;
  } catch (error) {
    console.error("Error seeding laptop data: ", error);
    return false;
  }
}; 