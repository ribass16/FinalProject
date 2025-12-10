// src/services/firestoreService.js
import { db } from "./firebaseClient";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy 
} from "firebase/firestore";

// Referência à coleção
const automoveisRef = collection(db, "automoveis");

// Escuta em tempo real
export const subscribeAutomoveis = (callback) => {
  const q = query(automoveisRef, orderBy("createdAt", "desc"));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(cars);
  }, (error) => {
    console.error("Erro ao escutar automóveis:", error);
    callback([]);
  });

  return unsubscribe;
};

// Buscar todos os automóveis (uma vez)
export const getAllAutomoveis = async () => {
  try {
    const snapshot = await getDocs(automoveisRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar automóveis:", error);
    return [];
  }
};

// Adicionar novo automóvel
export const addAutomovel = async (carData) => {
  try {
    const docRef = await addDoc(automoveisRef, {
      ...carData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar automóvel:", error);
    return { success: false, error: error.message };
  }
};

// Atualizar automóvel existente
export const updateAutomovel = async (id, carData) => {
  try {
    const docRef = doc(db, "automoveis", id);
    await updateDoc(docRef, {
      ...carData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar automóvel:", error);
    return { success: false, error: error.message };
  }
};

// Deletar automóvel
export const deleteAutomovel = async (id) => {
  try {
    const docRef = doc(db, "automoveis", id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar automóvel:", error);
    return { success: false, error: error.message };
  }
};
