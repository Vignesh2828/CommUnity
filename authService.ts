import { FIREBASE_AUTH } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const register = async(email:string, password:string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        return userCredential.user
    } catch (error) {
        throw error
    }
};

export const login = async(email:string, password:string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH,email,password)
        return userCredential.user
    } catch (error) {
        throw error
    }
}

export const logout = async () => {
    try {
        await signOut(FIREBASE_AUTH);
        console.log("User successfully logged out");
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};
