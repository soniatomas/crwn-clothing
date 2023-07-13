/* this library is just for using Firebase */

import { initializeApp } from 'firebase/app';
import { 
	getAuth, 
	signInWithRedirect, 
	signInWithPopup, 
	GoogleAuthProvider,
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';

// doc method below allows us to retrieve documents/document instances
// in firestore.
// getDoc and setDoc are methods that get and set document data respectively
import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	setDoc, 
	collection,
	writeBatch,
	query
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuF2JDleJ7NqInU1FbcAyGlGHXeWvH86A",
  authDomain: "crwn-clothing-db-st.firebaseapp.com",
  projectId: "crwn-clothing-db-st",
  storageBucket: "crwn-clothing-db-st.appspot.com",
  messagingSenderId: "1074618832248",
  appId: "1:1074618832248:web:2288a1527d356ab428e48d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// For authentication
// GoogleAuthProvider is a class connected to Google auth itself.
const googleProvider = new GoogleAuthProvider();
// you can have many providers as you please, such as Facebook provider, Github provider

// Everytime somebody interacts with our provider, 
// we want to force them to select an account
googleProvider.setCustomParameters( {
	prompt: "select_account"
});

// auth is a singleton class that handles authentication for your application
// and contains the rules for authentication.
// There should be only one auth instance throughout your whole application
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider); 

// instantiate db
export const db = getFirestore();

// method to create a collection in firestore and save documents into the collection
export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
	const collectionRef = collection(db, collectionKey);
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLocaleLowerCase());
		batch.set(docRef, object);
	});
	await batch.commit();
	
} 

export const getCategoriesAndDocuments = async () => {
	const collectionRef = collection(db, 'categories');
	const aQuery = query(collectionRef);

	const querySnapshot = await getDocs(aQuery);
	const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
		const { title, items } = docSnapshot.data();
		acc[title.toLocaleLowerCase()] = items;
		return acc;
	}, {});
	return categoryMap;

}


// method to store authenticated user to firestore
export const createUserDocumentFromAuth = async (
	userAuth, 
	additionalInfo = {}
	) => {
	
			// if we dont get a userAuth then just return and dont execute the rest of the function.
			if (!userAuth) return;
			// checking if there is already an instance of this user
			// in the db.
			// uid is a unique user id provided by Google
			// userDocRef is a document reference
			const userDocRef = doc(db, 'users', userAuth.uid);
			
			// console.log(userDocRef);
			
			// To check if a document exists in the db, use the method getDoc()
			const userSnapshot = await getDoc(userDocRef);
			// console.log(userSnapshot);

			// if user data does not exist, create/set the document with 
			// data from userAuth 
			if (!userSnapshot.exists()) {
				const { displayName, email } = userAuth;
				const createdAt = new Date();
				try {
					await setDoc(userDocRef, {
						displayName,
						email,
						createdAt,
						...additionalInfo
					});
				} catch(error) {
					console.log('Error creating user', error.message);
				}
			}
			// if user data exists, return the user's document reference
			return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if(!email || !password) return;
	return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInUserWithEmailAndPassword = async (email, password) => {
	if(!email || !password) return;
	return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async() => {
	await signOut(auth);
}

// this returns a listener. 
// callback function is executed when auth changes. 
// auth changes when a user signs in or signs out
export const onAuthStateChangedListener = (callback) => {
	onAuthStateChanged(auth, callback);
}

