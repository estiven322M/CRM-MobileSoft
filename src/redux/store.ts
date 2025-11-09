// Archivo: src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from './slices/peopleSlice';
import companiesReducer from './slices/companiesSlice';

// Configuración principal del store de Redux
export const store = configureStore({
  // Cada slice se asocia a una clave dentro del estado global
  reducer: {
    // Le decimos que el 'peopleReducer' manejará la parte 'people' del estado
    people: peopleReducer, // Maneja la información de personas
    companies: companiesReducer, // Maneja la información de empresas
  },
});

// Tipos derivados para usar con TypeScript
// Permiten obtener autocompletado y tipado seguro en el proyecto
export type RootState = ReturnType<typeof store.getState>;

// Representa la estructura completa del estado global
export type AppDispatch = typeof store.dispatch;