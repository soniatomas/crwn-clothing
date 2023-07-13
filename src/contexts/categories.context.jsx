import { createContext, useState, useEffect } from 'react';

// 2 imports below is used to save SHOP_DATA into Firebase;
// import { addCollectionAndDocuments } from '../utils/firebase/firebase.utils';
// import SHOP_DATA from '../shop-data.js';
import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
	categoriesMap: {},
});

export const CategoriesProvider = ({ children }) => {
	const [categoriesMap, setCategoriesMap] = useState({});
	// the use effect below is used to write the SHOP_DATA objects into firestore db
	// in Firebase.
	/*
	useEffect(() => {
		addCollectionAndDocuments('categories', SHOP_DATA);
	}, []);
	*/

	// hook to query products from firestore db 
	useEffect(() => {
		const getCategoriesMap = async () => {
			const categoryMap = await getCategoriesAndDocuments('categories');
			// console.log(categoryMap);
			setCategoriesMap(categoryMap);
		};
		
		getCategoriesMap();
	}, []);

	const value = { categoriesMap };
	return (
		<CategoriesContext.Provider value={value}> {children} </CategoriesContext.Provider>
	);
}