// Archivo: src/screens/AddCompanyScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';

// Firebase y Redux 
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { addCompanyLocal } from '../redux/slices/companiesSlice';


// Tipado básico para recibir la prop de navegación
type Props = {
  navigation: any;
};

const AddCompanyScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Maneja el guardado de una nueva empresa
  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre de la empresa es obligatorio.');
      return;
    }

    setIsLoading(true);

    try {
      // Guarda la empesa en Firestore
      const docRef = await firestore().collection('companies').add({
        name: name,
      });

      // Actualiza el estado global para reflejar el cambio sin recargar
      dispatch(
        addCompanyLocal({
          id: docRef.id,
          name: name,
        }),
      );

      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      setIsLoading(false);
      console.error('Error guardando empresa:', error);
      Alert.alert('Error', 'No se pudo guardar la empresa.');
    }
  };

  // Muestra un indicador de carga mientras se guarda la empresa
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={MD2Colors.blue500} />
        <Title style={styles.loaderText}>Guardando...</Title>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Añadir Nueva Empresa</Title>

      <TextInput
        label="Nombre de la Empresa"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        disabled={isLoading}
      >
        Guardar Empresa
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

// (Estilos idénticos a los de AddPersonScreen)
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

export default AddCompanyScreen;