// Archivo: src/redux/slices/companiesSlice.ts

import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// (Las interfaces 'Company' y 'CompaniesState' no cambian)
export interface Company {
  id: string;
  name: string;
}

interface CompaniesState {
  companyList: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  companyList: [],
  loading: false,
  error: null,
};

// (El Thunk 'fetchCompanies' no cambia)
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

// (El 'createSlice' es donde están los cambios)
const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  // Reducers síncronos
  reducers: {
    // Este ya lo tenías
    addCompanyLocal(state, action: PayloadAction<Company>) {
      state.companyList.push(action.payload);
    },
    // Este ya lo tenías
    deleteCompanyLocal(state, action: PayloadAction<string>) {
      state.companyList = state.companyList.filter(
        company => company.id !== action.payload,
      );
    },

    // <-- 1. AÑADIMOS EL REDUCER DE ACTUALIZAR
    // Recibe el objeto 'Company' completo y actualizado
    updateCompanyLocal(state, action: PayloadAction<Company>) {
      // Usamos .map para crear un nuevo array
      // Reemplazamos solo el ítem que coincide con el ID
      state.companyList = state.companyList.map(company =>
        company.id === action.payload.id ? action.payload : company,
      );
    },
  },

  // (El 'extraReducers' para 'fetchCompanies' no cambia)
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

// 6. Exportamos acciones y reducer
export const {
  addCompanyLocal,
  deleteCompanyLocal,
  updateCompanyLocal, // <-- 2. EXPORTAMOS LA NUEVA ACCIÓN
} = companiesSlice.actions;

export default companiesSlice.reducer;