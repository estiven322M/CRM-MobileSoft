// Archivo: src/redux/slices/peopleSlice.ts

import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import type { RootState } from '../store';

// (Las interfaces 'Person' y 'PeopleState' no cambian)
export interface Person {
  id: string;
  name: string;
  company: string;
  notes: string;
}

interface PeopleState {
  peopleList: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  peopleList: [],
  loading: false,
  error: null,
};

// (El thunk 'fetchPeople' no cambia)
export const fetchPeople = createAsyncThunk(
  'people/fetchPeople',
  async (_, { getState, rejectWithValue }) => {
    // ... (lógica de fetchPeople sin cambios)
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

      const peopleList: Person[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        company: doc.data().company,
        notes: doc.data().notes,
      }));

      return peopleList;
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      return rejectWithValue(error.message);
    }
  },
);

// (El 'createSlice' es donde están los cambios)
const peopleSlice = createSlice({
  name: 'people',
  initialState,
  // Reducers síncronos
  reducers: {
    // Este ya lo tenías
    addPerson(state, action: PayloadAction<Person>) {
      state.peopleList.push(action.payload);
    },
    // Este ya lo tenías
    deletePersonLocal(state, action: PayloadAction<string>) {
      state.peopleList = state.peopleList.filter(
        person => person.id !== action.payload,
      );
    },

    // <-- 1. AÑADIMOS EL REDUCER DE ACTUALIZAR
    // Recibe el objeto 'Person' completo y actualizado
    updatePersonLocal(state, action: PayloadAction<Person>) {
      // Usamos .map para crear un nuevo array
      // Reemplazamos solo el ítem que coincide con el ID
      state.peopleList = state.peopleList.map(person =>
        person.id === action.payload.id ? action.payload : person,
      );
    },
  },

  // (El 'extraReducers' para 'fetchPeople' no cambia)
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

// 8. Exportamos las "acciones" síncronas
export const {
  addPerson,
  deletePersonLocal,
  updatePersonLocal, // <-- 2. EXPORTAMOS LA NUEVA ACCIÓN
} = peopleSlice.actions;

// 9. Exportamos el reducer principal del slice
export default peopleSlice.reducer;