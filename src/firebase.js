// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set, get, update, remove } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiKN2J6_E8rbunc2-svHw4GMEjrYNcjFI",
  authDomain: "crm-autoatelier.firebaseapp.com",
  projectId: "crm-autoatelier",
  storageBucket: "crm-autoatelier.firebasestorage.app",
  messagingSenderId: "634245193456",
  appId: "1:634245193456:web:91d66950a89f32daf9ac35",
  databaseURL: "https://crm-autoatelier-default-rtdb.europe-west1.firebasedatabase.app/",
  measurementId: "G-4ZGTBXELVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const COLLECTION_NAME = 'clients';
const analytics = getAnalytics(app);

export const getClients = async () => {
  try {
    const clientsRef = ref(db, COLLECTION_NAME);
    const snapshot = await get(clientsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    throw error;
  }
};

// Добавить клиента
export const addClient = async (clientData) => {
  try {
    const clientsRef = ref(db, COLLECTION_NAME);
    const newClientRef = push(clientsRef);
    const newClient = {
      ...clientData,
      createdAt: new Date().toISOString()
    };
    await set(newClientRef, newClient);
    return { id: newClientRef.key, ...newClient };
  } catch (error) {
    console.error('Ошибка добавления клиента:', error);
    throw error;
  }
};

// Обновить клиента
export const updateClient = async (id, clientData) => {
  try {
    const clientRef = ref(db, `${COLLECTION_NAME}/${id}`);
    const updatedData = {
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    await update(clientRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error('Ошибка обновления клиента:', error);
    throw error;
  }
};

// Удалить клиента
export const deleteClient = async (id) => {
  try {
    const clientRef = ref(db, `${COLLECTION_NAME}/${id}`);
    await remove(clientRef);
    return { id };
  } catch (error) {
    console.error('Ошибка удаления клиента:', error);
    throw error;
  }
};