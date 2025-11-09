// Archivo: src/screens/AddPersonScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
// --- 1. IMPORTAMOS Menu y Divider ---
import {
  TextInput,
  Button,
  Title,
  Menu,
  Divider,
} from 'react-native-paper';

// --- Redux ---
// --- 2. IMPORTAMOS useSelector y RootState ---
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Para leer la lista de empresas
import { addPerson, Person } from '../redux/slices/peopleSlice'; // Importamos Person
// --- Fin Redux ---

// --- Firebase ---
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// --- Fin Firebase ---

const AddPersonScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  // --- 3. LEEMOS LA LISTA DE EMPRESAS DE REDUX ---
  const { companyList } = useSelector((state: RootState) => state.companies);

  // Estados del formulario
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false); // (Lo añadiremos después)

  // --- 4. ESTADOS PARA EL MENÚ DESPLEGABLE ---
  const [menuVisible, setMenuVisible] = useState(false);
  // Guardamos el objeto de empresa seleccionado (o null)
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    // --- 5. PREPARAMOS LOS DATOS PARA GUARDAR ---
    const newPersonData = {
      name: name,
      notes: notes,
      // Guardamos el ID y el nombre de la empresa seleccionada
      companyId: selectedCompany ? selectedCompany.id : null,
      companyName: selectedCompany ? selectedCompany.name : 'Sin empresa',
    };

    try {
      // Guardar en Firestore
      const docRef = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .add(newPersonData);

      // Guardar en Redux (con el ID real)
      dispatch(
        addPerson({
          ...newPersonData,
          id: docRef.id,
        } as Person), // Le decimos a TS que esto es una Persona
      );

      navigation.goBack();
    } catch (error) {
      console.error('Error guardando cliente:', error);
      Alert.alert('Error', 'No se pudo guardar el cliente.');
    }
  };

  return (
    // Usamos ScrollView por si la lista de empresas es muy larga
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Añadir Nuevo Cliente</Title>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* --- 6. EL NUEVO MENÚ DESPLEGABLE --- */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        // El 'anchor' es el botón que abre el menú
        anchor={
          <Button
            mode="outlined" // Estilo de borde
            onPress={openMenu}
            icon="office-building"
            style={styles.input}
            contentStyle={styles.menuButton}
            labelStyle={{color: '#333'}}
          >
            {selectedCompany ? selectedCompany.name : 'Seleccionar una empresa'}
          </Button>
        }
      >
        {/* Opción para "Ninguna" */}
        <Menu.Item
          onPress={() => {
            setSelectedCompany(null);
            closeMenu();
          }}
          title="Ninguna / Sin empresa"
        />
        <Divider />
        {/* Mapeamos la lista de empresas desde Redux */}
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
      {/* --- FIN DEL MENÚ --- */}

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
        onPress={handleSave}
        style={styles.button}
      >
        Guardar Cliente
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Tuvimos que cambiar el 'justifyContent' para que funcione el ScrollView
  container: {
    flexGrow: 1, 
    padding: 20,
    justifyContent: 'flex-start', // Alinea al inicio
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
  // Estilo para el botón del menú
  menuButton: {
    height: 50,
    justifyContent: 'center',
  },
});

export default AddPersonScreen;