// Archivo: src/screens/EditCompanyScreen.tsx

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
import { Company } from '../redux/slices/companiesSlice';
import { updateCompanyLocal } from '../redux/slices/companiesSlice';


const EditCompanyScreen = (props: any) => {
  const { navigation, route } = props;
  const { company } = route.params;

  const dispatch = useDispatch();

  const [name, setName] = useState(company.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre de la empresa es obligatorio.');
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar Firebase
      await firestore()
        .collection('companies')
        .doc(company.id)
        .update({
          name: name,
        });

      
      // Crear el objeto 'Company' completo y actualizado
      const updatedCompany = {
        id: company.id,
        name: name,
      };
      // Hacer la acción a Redux para actualizar la lista local
      dispatch(updateCompanyLocal(updatedCompany));

      // Volver a la lista
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.error('Error actualizando empresa:', error);
      Alert.alert('Error', 'No se pudo actualizar la empresa.');
    }
  };

  
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
      <Title style={styles.title}>Editar Empresa</Title>

      <TextInput
        label="Nombre de la Empresa"
        value={name}
        onChangeText={setName}
        style={styles.input}
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

// Estilos
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

export default EditCompanyScreen;