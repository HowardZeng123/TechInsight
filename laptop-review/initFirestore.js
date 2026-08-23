// initFirestore.js
// A script to initialize Firestore with sample data
import { seedAllData } from './utils/seedData.js';

console.log('Starting to seed Firestore database with data...');

// This function initializes your Firestore database with mock data
async function initializeFirestore() {
  try {
    const result = await seedAllData();
    
    if (result) {
      console.log('Successfully seeded Firestore database with data!');
    } else {
      console.error('Failed to seed Firestore database.');
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

// Run the initialization function
initializeFirestore();