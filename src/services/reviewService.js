import { db } from './firebaseClient';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, getDoc, Timestamp } from 'firebase/firestore';

const reviewsCollection = collection(db, 'reviews');

// Criar nova review
export const createReview = async (reviewData) => {
  try {
    const review = {
      ...reviewData,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(reviewsCollection, review);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao criar review:', error);
    return { success: false, error: error.message };
  }
};

// Buscar reviews mais recentes (para homepage)
export const getRecentReviews = async (limitCount = 3) => {
  try {
    const q = query(
      reviewsCollection, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: reviews };
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    return { success: false, error: error.message };
  }
};

// Buscar reviews de um carro específico
export const getCarReviews = async (carroId) => {
  try {
    const q = query(
      reviewsCollection,
      where('carroId', '==', carroId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: reviews };
  } catch (error) {
    console.error('Erro ao buscar reviews do carro:', error);
    return { success: false, error: error.message };
  }
};

// Verificar se utilizador já fez review para um agendamento
export const hasUserReviewed = async (userId, agendamentoId) => {
  try {
    const q = query(
      reviewsCollection,
      where('userId', '==', userId),
      where('agendamentoId', '==', agendamentoId)
    );
    
    const snapshot = await getDocs(q);
    return { success: true, hasReviewed: !snapshot.empty };
  } catch (error) {
    console.error('Erro ao verificar review:', error);
    return { success: false, error: error.message };
  }
};
