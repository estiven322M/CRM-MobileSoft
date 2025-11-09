// Archivo: src/screens/EditPersonScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Person } from '../redux/slices/peopleSlice';

// --- Redux ---
import { useDispatch } from 'react-redux';
// <-- 1. IMPORTAMOS LA NUEVA ACCIÓN
import { updatePersonLocal } from '../redux/slices/peopleSlice';
// --- Fin Redux ---


// (Usamos la corrección 'props: any' que nos funcionó)
const EditPersonScreen = (props: any) => {
  const { navigation, route } = props;
  const { person } = route.params;

  const dispatch = useDispatch();

  const [name, setName] = useState(person.name);
  const [company, setCompany] = useState(person.company);
  const [notes, setNotes] = useState(person.notes);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    setIsLoading(true);

    const updatedData = {
      name: name,
      company: company,
      notes: notes,
    };

    try {
      // 1. Actualizar Firebase
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .doc(person.id)
        .update(updatedData);

      // <-- 2. ¡LA LÓGICA DE REDUX!
      // Creamos el objeto 'Person' completo y actualizado
      const updatedPerson = {
        id: person.id,
        ...updatedData,
      };
      // Despachamos la acción a Redux para actualizar la lista local
      dispatch(updatePersonLocal(updatedPerson));

      // 3. Volver a la lista
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.error('Error actualizando:', error);
      Alert.alert('Error', 'No se pudo actualizar el cliente.');
    }
  };

  // (El resto del componente 'return', 'if (isLoading)', etc. no cambia)

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={MD2Colors.blue500} />
        <Title style={styles.loaderText}>Actualizando...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Editar Cliente</Title>

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

      <Button
        mode="contained"
        onPress={handleUpdate}
        style={styles.button}
        disabled={isLoading}
      >
        Guardar Cambios
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

// (Estilos - sin cambios)
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

export default EditPersonScreen;