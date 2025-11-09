// Archivo: src/screens/EditPersonScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Menu,
  Divider,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';

//  Redux 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Para leer la lista de empresas
import { updatePersonLocal, Person } from '../redux/slices/peopleSlice'; // Importamos Person


// Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const EditPersonScreen = (props: any) => {
  const { navigation, route } = props;
  const { person } = route.params; // Recibimos la persona que vamos a editar

  const dispatch = useDispatch();

  // Leer lista de empresa Redux
  const { companyList } = useSelector((state: RootState) => state.companies);

  // Estados de los formularios
  const [name, setName] = useState(person.name);
  const [notes, setNotes] = useState(person.notes);
  const [isLoading, setIsLoading] = useState(false);

  // Estados del menú
  const [menuVisible, setMenuVisible] = useState(false);
  // Pre-seleccionamos la empresa con la que viene el cliente
  const [selectedCompany, setSelectedCompany] = useState<{ id: string | null; name: string } | null>(
    person.companyId ? { id: person.companyId, name: person.companyName } : null
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  
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

    // Datos a actualizar
    const updatedData = {
      name: name,
      notes: notes,
      companyId: selectedCompany ? selectedCompany.id : null,
      companyName: selectedCompany ? selectedCompany.name : 'Sin empresa',
    };

    try {
      // Actualizar en Firebase
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .doc(person.id) // Usamos el ID del cliente existente
        .update(updatedData); // Usamos .update()

      // Actualizar en Redux
      dispatch(
        updatePersonLocal({
          ...updatedData,
          id: person.id, // Mantenemos el ID original
        } as Person),
      );

      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.error('Error actualizando cliente:', error);
      Alert.alert('Error', 'No se pudo actualizar el cliente.');
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
    // Usamos ScrollView por si la lista de empresas es muy larga
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Editar Cliente</Title>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* MENÚ DESPLEGABLE */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            icon="office-building"
            style={styles.input}
            contentStyle={styles.menuButton}
            labelStyle={{color: '#333'}}
          >
            {/* Mostramos el nombre de la empresa seleccionada */}
            {selectedCompany ? selectedCompany.name : 'Seleccionar una empresa'}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setSelectedCompany(null);
            closeMenu();
          }}
          title="Ninguna / Sin empresa"
        />
        <Divider />
        {companyList.map(company => (
          <Menu.Item
            key={company.id}
            onPress={() => {
              setSelectedCompany(company);
              closeMenu();
            }}
            title={company.name}
          />
        ))}
      </Menu>
      {/*  Fin  */}

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
        onPress={handleUpdate} // Llamamos a handleUpdate
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
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-start',
    paddingTop: 60,
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
  menuButton: {
    height: 50,
    justifyContent: 'center',
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