// src/firebase/auth.js
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "./config";

// Firebase auth instance
const googleProvider = new GoogleAuthProvider();

// Send sign-in email link
export const sendSignInLink = async (email, actionCodeSettings) => {
  try {
    // Save the email in localStorage so we can retrieve it later
    localStorage.setItem('emailForSignIn', email);
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};



// Complete sign-in with email link
export const completeSignInWithEmailLink = async (email, link) => {
  try {
    const result = await signInWithEmailLink(auth, email, link);
    // Clear email from storage
    localStorage.removeItem('emailForSignIn');
    return { 
      success: true, 
      user: result.user 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};



// Check if the URL contains a sign-in link
export const checkForSignInLink = () => {
  const isLink = isSignInWithEmailLink(auth, window.location.href);
  const email = localStorage.getItem('emailForSignIn');
  
  return { 
    isSignInLink: isLink, 
    email 
  };
};



// Current user
export const getCurrentUser = () => {
  return auth.currentUser;
};



// Sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};



// Auth state observer
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};



// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { 
      success: true, 
      user: result.user 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}




// Delete user account
export const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.delete();
      return { success: true, message: "User account deleted successfully." };
    } else {
      return { success: false, message: "No user is currently signed in." };
    }
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, message: error.message };
  }
};
