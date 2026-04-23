import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB8AZKnTBJZimzbGbq7BGYv4uz2taCjSBY',
  authDomain: 'blood-b5985.firebaseapp.com',
  databaseURL: 'https://blood-b5985-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'blood-b5985',
  storageBucket: 'blood-b5985.firebasestorage.app',
  messagingSenderId: '646417482360',
  appId: '1:646417482360:web:a242c910963432b073e38d',
  measurementId: 'G-THH9TZ4GSG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Analytics only in browser (optional; may fail with ad blockers)
if (typeof window !== 'undefined') {
  try {
    getAnalytics(app);
  } catch (_) {}
}
