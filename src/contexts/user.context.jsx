import { createContext, useState, useEffect } from 'react';
import { onAuthStateChangedListener,
		createUserDocumentFromAuth
 } from '../utils/firebase/firebase.utils';

// The actual value you want to access
// This is the context and each context needs a provider.
// In my case the provider for this UserContext is UserProvider below.
export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
});

// The provider
// a component that will wrap around any other components that
// need access to the values in the context. 
// For components to use the context, they need to be wrapped into a provider,
// This component receives children which will be the components that need to access the UserContext.
// The provider has a value tag that holds the actual contextual value of the UserContext
export const UserProvider = ({ children }) => {
	// use hook to initialize UserContext to null
	const [currentUser, setCurrentUser] = useState(null);
	// setting the value tag so that currentUser and setCurrentUser setfunction can be
	// passed to the children 
	const value = { currentUser, setCurrentUser };

	// useEffect hook used for observable listener pattern
	// this will mount listener to context
	// this will stop listening once component unmounts
	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener((user) => {
			if (user) {
				// create user document if a user is authenticated
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
			console.log(user);
		})
		return unsubscribe;
	}, []);

	return <UserContext.Provider value={value}>
		{children}
	</UserContext.Provider>
}

