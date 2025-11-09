// Archivo: src/screens/AddPersonScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator, // <-- 1. Importar el cargador
  MD2Colors,
} from 'react-native-paper';

// --- Redux ---
import { useDispatch } from 'react-redux';
import { addPerson } from '../redux/slices/peopleSlice';
// --- Fin Redux ---

// --- Firebase ---
// <-- 2. Importar firestore y auth
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// --- Fin Firebase ---

const AddPersonScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- 3. Añadir estado de carga

  // <-- 4. Convertir la función en 'async'
  const handleSave = async () => {
    // Validar que el nombre no esté vacío
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    // <-- 5. Obtener el ID del usuario actual
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión de nuevo.');
      return;
    }

    setIsLoading(true); // Activar el cargador

    // Datos del nuevo cliente
    const newPersonData = {
      name: name,
      company: company,
      notes: notes,
    };

    try {
      // <-- 6. Guardar en Firestore
      // Estructura: /users/{userId}/contacts/{auto-id}
      // Esto crea un documento nuevo dentro de una sub-colección "contacts"
      // que pertenece al usuario que está logueado.
      const docRef = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .add(newPersonData); // '.add' genera un ID automático

      // <-- 7. Guardar en Redux (¡con el ID real de Firestore!)
      // Despachamos la acción 'addPerson' con el ID que nos dio Firestore.
      dispatch(
        addPerson({
          ...newPersonData,
          id: docRef.id, // Usamos el ID real de la base de datos
        }),
      );

      navigation.goBack(); // Regresar a la lista (ya no necesitamos el loader aquí)

    } catch (error) {
      setIsLoading(false); // Asegurarse de quitar el cargador si hay un error
      console.error('Error guardando cliente:', error);
      Alert.alert('Error', 'No se pudo guardar el cliente en la base de datos.');
    }
    // No ponemos 'setIsLoading(false)' aquí porque la navegación desmonta la pantalla.
  };

  // <-- 8. Renderizar el cargador si isLoading es true
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={MD2Colors.blue500} />
        <Title style={styles.loaderText}>Guardando...</Title>
      </View>
    );
  }

  // El formulario (return principal)
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Añadir Nuevo Cliente</Title>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Compañía"
        value={company}
        onChangeText={setCompany}
        style={styles.input}
      />

      <TextInput
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      {/* <-- 9. Deshabilitar botones mientras carga */}
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        disabled={isLoading} 
      >
        Guardar Cliente
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.button}
        disabled={isLoading}
      >
        Cancelar
      </Button>
    </View>
  );
};

// <-- 10. Añadir estilos para el cargador
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 15,
    fontSize: 18,
  },
});

export default AddPersonScreen;