// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-4435897080-6fb95',
  appId: '1:771559727473:web:68df855f30d6ea9c3c96d0',
  apiKey: 'AIzaSyD_aeXd9dpI47EcTnd60umqApvqMOQxbxA',
  authDomain: 'studio-4435897080-6fb95.firebaseapp.com',
  measurementId: 'G-XXXXXXXXXX', // Replace with your measurement ID if you have one
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
