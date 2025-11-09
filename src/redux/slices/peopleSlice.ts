// Archivo: src/redux/slices/peopleSlice.ts

import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import type { RootState } from '../store';

// Estructura del modelo Person: representa un contacto asociado a una empresa
export interface Person {
  id: string;
  name: string;
  companyId: string | null;
  companyName: string;
  notes: string;
}

// Estructura del estado general del slice
interface PeopleState {
  peopleList: Person[];
  loading: boolean;
  error: string | null;
}
// Estado inicial
const initialState: PeopleState = {
  peopleList: [],
  loading: false,
  error: null,
};

// Acción asíncrona que obtiene los contactos del usuario autenticado
export const fetchPeople = createAsyncThunk(
  'people/fetchPeople',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = auth().currentUser?.uid;

      if (!userId) {
        return rejectWithValue('Usuario no autenticado.');
      }

      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('contacts')
        .get();

      
        // Mapeamos los datos de Firestore a nuestro tipo Person
      const peopleList: Person[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        companyId: doc.data().companyId, 
        companyName: doc.data().companyName, 
        notes: doc.data().notes,
      }));
      

      return peopleList;
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      return rejectWithValue(error.message);
    }
  },
);

// Slice principal para manejar la lista de personas
const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    // Agrega una persona localmente al estado
    addPerson(state, action: PayloadAction<Person>) {
      state.peopleList.push(action.payload);
    },
    // Elimina una persona por su ID  
    deletePersonLocal(state, action: PayloadAction<string>) {
      state.peopleList = state.peopleList.filter(
        person => person.id !== action.payload,
      );
    },
    // Actualiza los datos de una persona existente
    updatePersonLocal(state, action: PayloadAction<Person>) {
      state.peopleList = state.peopleList.map(person =>
        person.id === action.payload.id ? action.payload : person,
      );
    },
  },

  // Manejo de estados de carga y error del thunk fetchPeople
  extraReducers: builder => {
    builder
      .addCase(fetchPeople.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPeople.fulfilled,
        (state, action: PayloadAction<Person[]>) => {
          state.peopleList = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportación de las acciones y el reducer
export const {
  addPerson,
  deletePersonLocal,
  updatePersonLocal,
} = peopleSlice.actions;

export default peopleSlice.reducer;