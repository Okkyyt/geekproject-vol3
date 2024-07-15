// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,addDoc,doc,Timestamp} from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// FirebaseAuthの初期化
const auth = initializeAuth(app, {
  // AsyncStorageを提供して認証状態を永続化する
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, addDoc,doc,Timestamp,auth};