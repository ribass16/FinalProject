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

// normalizar datas para formato consistente (YYYY-MM-DD)
const normalizarData = (data) => {
  if (!data || typeof data !== 'string') return data;
  
  if (data.includes('/')) {
    const parts = data.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  // Se já é YYYY-MM-DD, retorna como está
  if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return data;
  }
  
  return data;
};

// Criar agendamento
export const createAgendamento = async (data) => {
  try {
    if (!data.data || !data.hora) {
      return { success: false, error: 'Data e hora obrigatórias' };
    }

    const dataNormalizada = normalizarData(data.data);
    
    // Trim hora (remover espaços em branco)
    const horaTrimada = (data.hora || '').trim();

    // verfica se o horário ja esta ocupado
    const q = query(
      agendamentosRef,
      where('data', '==', dataNormalizada),
      where('hora', '==', horaTrimada),
      where('status', 'in', ['pendente', 'confirmado'])
    );

    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.warn(`BLOQUEADO: Horário já ocupado para ${dataNormalizada} às ${horaTrimada}`);
      return { success: false, error: 'Horário já ocupado. Escolha outra hora.' };
    }

    const docRef = await addDoc(agendamentosRef, {
      ...data,
      data: dataNormalizada,
      hora: horaTrimada,
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

    // se tiver concluido o agendamento é apagado
    if (status === 'concluido') {
      await deleteDoc(docRef);
      return { success: true, deleted: true };
    }

    await updateDoc(docRef, { status });
    return { success: true, deleted: false };
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
    const dataNormalizada = normalizarData(data);

    const q = query(
      agendamentosRef,
      where("carroId", "==", carroId),
      where("data", "==", dataNormalizada),
      where("status", "in", ["pendente", "confirmado"]) 
    );

    const snapshot = await getDocs(q);
    const horarios = Array.from(new Set(snapshot.docs.map(d => d.data().hora)));

    return { success: true, data: horarios };
  } catch (error) {
    console.error("Erro ao buscar horários ocupados:", error);
    return { success: false, error: error.message };
  }
};

// Horários ocupados globalmente (independente do carro)
export const getHorariosOcupadosGlobal = async (data) => {
  try {
    const dataNormalizada = normalizarData(data);
    
    // Converter para formato DD/MM/YYYY também (para casos antigos no Firebase)
    let dataPortugues = dataNormalizada;
    if (dataNormalizada && dataNormalizada.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dataNormalizada.split('-');
      dataPortugues = `${day}/${month}/${year}`;
    }


    // Fazer queries para ambos os formatos
    const q1 = query(
      agendamentosRef,
      where('data', '==', dataNormalizada),
      where('status', 'in', ['pendente', 'confirmado'])
    );

    const q2 = query(
      agendamentosRef,
      where('data', '==', dataPortugues),
      where('status', 'in', ['pendente', 'confirmado'])
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    
    const allDocs = [...snap1.docs, ...snap2.docs];
    const horariosSet = new Set();
    
    allDocs.forEach(doc => {
      const hora = (doc.data().hora || '').trim();
      if (hora) horariosSet.add(hora);
    });

    const horarios = Array.from(horariosSet);
    
    return { success: true, data: horarios };
  } catch (error) {
    console.error('[getHorariosOcupadosGlobal] Erro:', error);
    return { success: false, error: error.message };
  }
};
