import { auth, db } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { DriveData } from '@/app/types/drive';

// Kullanıcı kimlik doğrulama işlemleri
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Kullanıcı profilini Firestore'a kaydet
    await setDoc(doc(db, 'users', user.uid), {
      email,
      displayName,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Sürüş verisi işlemleri
export const saveDriveData = async (driveData: DriveData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı oturum açmamış');

    const driveRef = await addDoc(collection(db, 'drives'), {
      ...driveData,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });

    return driveRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserDriveHistory = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı oturum açmamış');

    const drivesRef = collection(db, 'drives');
    const q = query(
      drivesRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const driveHistory: DriveData[] = [];

    querySnapshot.forEach((doc) => {
      driveHistory.push(doc.data() as DriveData);
    });

    return driveHistory;
  } catch (error) {
    throw error;
  }
};