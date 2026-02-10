import { db } from "./firebaseClient";
import { collection, addDoc, deleteDoc, query, where, onSnapshot, getDocs } from "firebase/firestore";

const favoritosRef = collection(db, "favoritos");

// Adicionar aos favoritos
export const addFavorito = async (userId, carId) => {
  try {
    // Verifica se ja existe
    const q = query(favoritosRef, where("userId", "==", userId), where("carId", "==", carId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { success: false, error: "Carro ja esta nos favoritos" };
    }
    
    await addDoc(favoritosRef, {
      userId,
      carId,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    return { success: false, error: error.message };
  }
};

// Remover dos favoritos
export const removeFavorito = async (userId, carId) => {
  try {
    const q = query(favoritosRef, where("userId", "==", userId), where("carId", "==", carId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
      return { success: true };
    }
    
    return { success: false, error: "Favorito nao encontrado" };
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return { success: false, error: error.message };
  }
};

// Escutar favoritos do utilizador
export const subscribeFavoritos = (userId, callback) => {
  const q = query(favoritosRef, where("userId", "==", userId));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const favoritos = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(favoritos);
  }, (error) => {
    console.error("Erro ao escutar favoritos:", error);
    callback([]);
  });

  return unsubscribe;
};

// Verificar se carro esta nos favoritos
export const isFavorito = async (userId, carId) => {
  try {
    const q = query(favoritosRef, where("userId", "==", userId), where("carId", "==", carId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    return false;
  }
};
