// Importa as funções do SDK que precisas
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Inicializa a app Firebase
const app = initializeApp(firebaseConfig);

// Exporta a Firestore para usar em toda a app
export const db = getFirestore(app);
