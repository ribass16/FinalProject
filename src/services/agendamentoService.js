import { db } from "./firebaseClient";
import { 
  collection, 
  addDoc, 
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  where
} from "firebase/firestore";

const agendamentosRef = collection(db, "agendamentos");

// Criar agendamento
export const createAgendamento = async (data) => {
  try {
    const docRef = await addDoc(agendamentosRef, {
      ...data,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, error: error.message };
  }
};

// atualiza em tempo real
export const subscribeAgendamentos = (callback) => {
  const q = query(agendamentosRef, orderBy("createdAt", "desc"));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const agendamentos = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(agendamentos);
  }, (error) => {
    console.error("Erro ao escutar agendamentos:", error);
    callback([]);
  });

  return unsubscribe;
};

// Atualizar status do agendamento
export const updateAgendamentoStatus = async (id, status) => {
  try {
    const docRef = doc(db, "agendamentos", id);
    await updateDoc(docRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: error.message };
  }
};

// Apagar agendamento
export const deleteAgendamento = async (id) => {
  try {
    await deleteDoc(doc(db, "agendamentos", id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao apagar agendamento:", error);
    return { success: false, error: error.message };
  }
};

// Buscar agendamentos de um utilizador específico
export const getUserAgendamentos = async (userId) => {
  try {
    const q = query(agendamentosRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    const agendamentos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: agendamentos };
  } catch (error) {
    console.error("Erro ao buscar agendamentos do utilizador:", error);
    return { success: false, error: error.message };
  }
};

// ver horários ocupados para um carro numa data específica
export const getHorariosOcupados = async (carroId, data) => {
  try {
    const q = query(
      agendamentosRef, 
      where("carroId", "==", carroId),
      where("data", "==", data),
      where("status", "in", ["pendente", "confirmado"]) 
    );
    const snapshot = await getDocs(q);
    
    const horarios = snapshot.docs.map(doc => doc.data().hora);
    
    return { success: true, data: horarios };
  } catch (error) {
    console.error("Erro ao buscar horários ocupados:", error);
    return { success: false, error: error.message };
  }
};
