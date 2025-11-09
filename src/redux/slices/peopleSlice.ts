// Archivo: src/redux/slices/peopleSlice.ts

import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import type { RootState } from '../store';

// 1. Esta interfaz AHORA ES CORRECTA
export interface Person {
  id: string;
  name: string;
  companyId: string | null;
  companyName: string;
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

// (El thunk 'fetchPeople' es donde estaba el error)
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

      // 2. 👇👇 ¡AQUÍ ESTÁ LA CORRECCIÓN! 👇👇
      // Mapeamos los campos correctos de Firebase a nuestra interfaz
      const peopleList: Person[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        companyId: doc.data().companyId, // <-- CORREGIDO
        companyName: doc.data().companyName, // <-- CORREGIDO
        notes: doc.data().notes,
      }));
      // 👆👆 FIN DE LA CORRECCIÓN 👆👆

      return peopleList;
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      return rejectWithValue(error.message);
    }
  },
);

// (El 'createSlice' está bien como lo tenías)
const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    addPerson(state, action: PayloadAction<Person>) {
      state.peopleList.push(action.payload);
    },
    deletePersonLocal(state, action: PayloadAction<string>) {
      state.peopleList = state.peopleList.filter(
        person => person.id !== action.payload,
      );
    },
    updatePersonLocal(state, action: PayloadAction<Person>) {
      state.peopleList = state.peopleList.map(person =>
        person.id === action.payload.id ? action.payload : person,
      );
    },
  },

  // (El 'extraReducers' está bien)
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

// (Las exportaciones están bien)
export const {
  addPerson,
  deletePersonLocal,
  updatePersonLocal,
} = peopleSlice.actions;

export default peopleSlice.reducer;