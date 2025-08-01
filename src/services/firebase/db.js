import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  getCountFromServer
} from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { functions } from "./config";



// Initialize the callable function
const deleteCloudinaryImage = httpsCallable(functions, 'deleteCloudinaryImage');



export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
    return {
      success: true,
      id: docRef.id,
      message: "Details submitted successfully"
    };
  } catch (error) {
    console.error("Error adding document: ", error);
    return {
      success: false,
      message: error.message
    };
  }
}



//Getting single document by just id
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Document not found"
      };
    }

    return {
      success: true,
      data: { id: docSnap.id, ...docSnap.data() }
    };
  } catch (error) {
    console.error("Error fetching document by ID: ", error);
    return {
      success: false,
      message: error.message
    };
  }
};




// Getting documents with cursor-based pagination and custom queries
export const getDocuments = async (
  collectionName,
  userId = null,
  lastDoc = null,
  pageSize = 10,
  whereConditions = [],
  orderByField = 'createdAt',
  orderByDirection = 'desc'
) => {
  try {
    const collectionRef = collection(db, collectionName);

    const queryConstraints = [];

    // Apply userId condition if given
    if (userId) {
      queryConstraints.push(where("userId", "==", userId));
    }

    // Apply additional where conditions
    whereConditions.forEach(({ field, operator, value }) => {
      queryConstraints.push(where(field, operator, value));
    });

    // Add orderBy
    queryConstraints.push(orderBy(orderByField, orderByDirection));

    // Add pagination
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }

    // Add limit
    queryConstraints.push(limit(pageSize));

    // Final query with all constraints applied
    const q = query(collectionRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const hasMore = querySnapshot.docs.length === pageSize;
    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    
    return {
      success: true,
      data: documents,
      hasMore,
      lastDoc: newLastDoc,
      length: documents.length,
    };
  } catch (error) {
    console.error("Error getting documents:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};




export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return {
      success: true,
      message: "Document updated successfully"
    };
  } catch (error) {
    console.error("Error updating document: ", error);
    return {
      success: false,
      message: error.message
    };
  }
}



export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return {
      success: true,
      message: "Document deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return {
      success: false,
      message: error.message,
    };
  }
};





// Optimized version using batch writes (recommended for better performance)
export const deleteDocumentsByUserIdBatch = async (collectionName, userId) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: true,
        message: `No documents found in ${collectionName} for user ${userId}`,
        deletedCount: 0
      };
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return {
      success: true,
      message: `All documents from ${collectionName} for user ${userId} deleted successfully`,
      deletedCount: querySnapshot.size
    };
  } catch (error) {
    console.error(`Error deleting documents from ${collectionName}: `, error);
    return {
      success: false,
      message: error.message,
      deletedCount: 0
    };
  }
};





// Main function to delete user profile and all associated documents
export const deleteUserProfileComplete = async (memberId, userId) => {
  try {
    const results = {
      user: null,
      memberships: null,
      dayPasses: null,
      payments: null,
      totalDeleted: 0
    };

    // ========= NEW: DELETE IMAGES BEFORE DELETING USER DOCUMENT =========
    try {
      // Get user document to retrieve image URLs
      const userDocRef = doc(db, 'users', memberId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const imagesToDelete = [];

        // Check if profile image exists and has public_id
        if (userData.imageUrl && userData.imageUrl.public_id) {
          imagesToDelete.push(userData.imageUrl.public_id);
        }

        // Check if Aadhar image exists and has public_id
        if (userData.aadharUrl && userData.aadharUrl.public_id) {
          imagesToDelete.push(userData.aadharUrl.public_id);
        }

        // Delete images from Cloudinary if any exist
        if (imagesToDelete.length > 0) {
          const imageDeletePromises = imagesToDelete.map(async (publicId) => {
            try {
              const result = await deleteCloudinaryImage({ publicId });
              return { publicId, success: true, result: result.data };
            } catch (error) {
              console.error(`Failed to delete image ${publicId}:`, error);
              return { publicId, success: false, error: error.message };
            }
          });

          const imageResults = await Promise.all(imageDeletePromises);
          console.log("All images deleted successfully")
        } else {
          console.log("No image to delete")
        }
      }
    } catch (imageError) {
      console.error('Error deleting images:', imageError);
    }

    // Delete associated memberships
    const membershipResult = await deleteDocumentsByUserIdBatch('memberships', userId);
    results.memberships = membershipResult;
    results.totalDeleted += membershipResult.deletedCount;

    // Delete associated dayPasses
    const dayPassResult = await deleteDocumentsByUserIdBatch('dayPasses', userId);
    results.dayPasses = dayPassResult;
    results.totalDeleted += dayPassResult.deletedCount;


    // Delete associated dayPasses
    const paymentResult = await deleteDocumentsByUserIdBatch('payments', userId);
    results.payments = paymentResult;
    results.totalDeleted += paymentResult.deletedCount;

    // Delete user document (assuming the user document ID is the same as userId)
    const userResult = await deleteDocument('users', memberId);
    results.user = userResult;
    if (userResult.success) {
      results.totalDeleted += 1;
    }

    // Check if all operations were successful
    const allSuccess = results.user.success &&
      results.memberships.success &&
      results.dayPasses.success;

    return {
      success: true,
      message: allSuccess
        ? `User profile and all associated documents deleted successfully. Total deleted: ${results.totalDeleted}`
        : "Some operations failed during deletion",
      details: results
    };

  } catch (error) {
    console.error("Error in complete user deletion: ", error);
    return {
      success: false,
      message: error.message,
      details: null
    };
  }
};





export const getNumberOfDocuments = async (collectionName, userId = null, whereConditions = []) => {
  let q = query(collection(db, collectionName));
  try {
    // Apply userId filter if provided
    if (userId) {
      q = query(q, where("userId", "==", userId));
    }
    // Apply additional where conditions
    whereConditions.forEach(condition => {
      const { field, operator, value } = condition;
      q = query(q, where(field, operator, value));
    }
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count
    
  } catch (error) {
    console.error("Error getting document count: ", error);
  }
}