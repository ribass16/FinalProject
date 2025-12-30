import { db } from "./firebaseClient";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Atulizar perfil 
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    return { success: false, error: error.message };
  }
};


export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: "Utilizador nao encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return { success: false, error: error.message };
  }
};

// Atualizar perfil
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, userData);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, error: error.message };
  }
};
