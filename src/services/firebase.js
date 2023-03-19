import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, currentUser } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
//import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCB4fyVo5lAfHw93OFly-leCqXwe6fVz38",
    authDomain: "ddam-05-ingra.firebaseapp.com",
    projectId: "ddam-05-ingra",
    storageBucket: "ddam-05-ingra.appspot.com",
    messagingSenderId: "490022488281",
    appId: "1:490022488281:web:0a9ac058c96ccdc4c916c8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//export const firestore = getFirestore();
//export const storage = getStorage();

const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = async () => {
    return await signOut(auth);
};

const getCurrentUser = async () => {
    return await currentUser(auth);
};

export {
    auth,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};