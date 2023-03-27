import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, currentUser, deleteUser as fbDeleteUser } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


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
const firestore = getFirestore(app);
const storage = getStorage(app);

const registerUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

const deleteUser = async (user) => {
    return await fbDeleteUser(user);
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

const saveProfile = async (userId, profileData) => {
    const profileRef = doc(collection(firestore, "Profile"), userId);
    return await setDoc(profileRef, profileData);
};

const getProfile = async (userId) => {
    const profileRef = doc(collection(firestore, "Profile"), userId);
    const profileSnapshot = await getDoc(profileRef);

    if (profileSnapshot.exists()) {
        return profileSnapshot.data();
    } else {
        console.log("No existe el perfil con ese ID");
        return null;
    }
};

const createPublication = async (userId, publicationData) => {
    const publicationRef = collection(firestore, "Publicacion");
    const newPublication = {
        usuario: userId,
        ...publicationData
    };
    return await addDoc(publicationRef, newPublication);
};

const getPublicationsByUser = async (userId) => {
    const publicationRef = collection(firestore, "Publicacion");
    const q = query(publicationRef, where("usuario", "==", userId));
    const querySnapshot = await getDocs(q);
    const publications = [];

    querySnapshot.forEach((doc) => {
        publications.push({ id: doc.id, ...doc.data() });
    });
    return publications;
};

const uploadImageToFirebase = async (image) => {
    try {
        // Crea una referencia al storage de Firebase
        const storage = getStorage(app);

        // Genera un nombre único para el archivo
        const imageName = `image-${Date.now()}.${image.uri.split('.').pop()}`;

        // Crea una referencia al archivo en el storage
        const imageRef = ref(storage, `images/${imageName}`);

        // Convierte la imagen a formato Blob
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (error) => {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image.uri, true);
            xhr.send(null);
        });

        // Sube el Blob al storage de Firebase
        const uploadTask = uploadBytesResumable(imageRef, blob);

        // Escucha el progreso de la subida
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress);
        });

        // Espera a que se complete la subida
        const snapshot = await uploadTask;

        // Libera el blob
        blob.close();

        // Obtiene la URL de la imagen subida
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Retorna la URL de la imagen subida
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image: ', error);
        return null;
    }
};

export {
    auth,
    registerUser,
    deleteUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    saveProfile,
    getProfile,
    createPublication,
    getPublicationsByUser,
    uploadImageToFirebase
};