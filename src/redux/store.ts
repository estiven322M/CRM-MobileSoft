// Archivo: src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
// Importamos el reducer de nuestro "peopleSlice"
import peopleReducer from './slices/peopleSlice';

// 1. Creamos el store
export const store = configureStore({
  // 2. "reducer" es un mapa de todos nuestros slices
  reducer: {
    // Le decimos que el 'peopleReducer' manejará la parte 'people' del estado
    people: peopleReducer,
    // (Aquí añadiremos el slice de 'companies' en el futuro)
  },
});

// 3. Tipos útiles para TypeScript (nos ayudarán a autocompletar)
// Infiere el tipo del estado completo
export type RootState = ReturnType<typeof store.getState>;
// Infiere el tipo de la función 'dispatch'
export type AppDispatch = typeof store.dispatch;