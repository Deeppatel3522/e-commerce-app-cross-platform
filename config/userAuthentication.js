import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './firebaseconfig';

export function userAuthentication() {
    const [user, setUser] = useState();

    useEffect(() => {
        const userAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if(user) {
                setUser(user);
            } else {
                setUser(undefined);
            }
        });

        return userAuth;
    }, []);

    return {
        user
    };
}