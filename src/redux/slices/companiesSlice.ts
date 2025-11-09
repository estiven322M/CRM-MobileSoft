// Archivo: src/redux/slices/companiesSlice.ts

import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Definicion del tipo de dato para una empresa
export interface Company {
  id: string;
  name: string;
}

// Estructura del estado dentro del slice
interface CompaniesState {
  companyList: Company[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: CompaniesState = {
  companyList: [],
  loading: false,
  error: null,
};

// Acción asíncrona: obtiene la lista de empresas desde Firestore
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    // ... (lógica de fetchCompanies sin cambios)
    try {
      const snapshot = await firestore().collection('companies').get();

      const companiesList: Company[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));

      return companiesList;
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      return rejectWithValue(error.message);
    }
  },
);

// Definicion del slice
const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  // Reducers síncronos: modifican el estado directamente
  reducers: {
    // Agrega una empresa localmente
    addCompanyLocal(state, action: PayloadAction<Company>) {
      state.companyList.push(action.payload);
    },
    // Elimina una empresa por su ID
    deleteCompanyLocal(state, action: PayloadAction<string>) {
      state.companyList = state.companyList.filter(
        company => company.id !== action.payload,
      );
    },
    // Actualiza los datos de una empresa existente
    updateCompanyLocal(state, action: PayloadAction<Company>) {
      // Usamos .map para crear un nuevo array
      // Reemplazamos solo el ítem que coincide con el ID
      state.companyList = state.companyList.map(company =>
        company.id === action.payload.id ? action.payload : company,
      );
    },
  },

  // Reducers adicionales para manejar el ciclo de vida de fetchCompanies
  extraReducers: builder => {
    builder
      .addCase(fetchCompanies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.companyList = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportación de las acciones y del reducer
export const {
  addCompanyLocal,
  deleteCompanyLocal,
  updateCompanyLocal, 
} = companiesSlice.actions;

export default companiesSlice.reducer;