// fetchData.js
import { db } from '../views/firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const fetchData = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId).collection('Project');
    const snapshot = await userRef.get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

export default fetchData;
