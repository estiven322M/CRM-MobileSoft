// Archivo: src/screens/AddPersonScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
// Importar componenetes visuales de react-native-paper
import {
  TextInput,
  Button,
  Title,
  Menu,
  Divider,
} from 'react-native-paper';

//  Redux y tipos globales

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Para leer el estado global
import { addPerson, Person } from '../redux/slices/peopleSlice'; // Accion y tipo de persona
// Fin de Redux

// Importar de Firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Componente principal de la pantalla "Añadir Persona"
const AddPersonScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();

  // Leer la lista de empresas guardadas en Redux
  const { companyList } = useSelector((state: RootState) => state.companies);

  // Estados del formulario
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  // Estados del menú desplegable
  const [menuVisible, setMenuVisible] = useState(false);
  // Guardamos el objeto de empresa seleccionado (o null)
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Función para guardar persona
  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    // Verificar que el usuario esté autenticado en Firebase
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    // Peparar los datos para Firestore
    const newPersonData = {
      name: name,
      notes: notes,
      companyId: selectedCompany ? selectedCompany.id : null,
      companyName: selectedCompany ? selectedCompany.name : 'Sin empresa',
    };

    try {
      // Guardamos en la subcolección 'contacts' dentro del usuario actual
      const docRef = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .add(newPersonData);

      // Luego, actualizamos el estado local en Redux (sin esperar recarga)
      dispatch(
        addPerson({
          ...newPersonData,
          id: docRef.id,
        } as Person), // Le decimos a TS que esto es una Persona
      );

      // Regresar a la pantalla anterior
      navigation.goBack();
    } catch (error) {
      // Si algo falla, mostramos alerta
      console.error('Error guardando cliente:', error);
      Alert.alert('Error', 'No se pudo guardar el cliente.');
    }
  };

  // INTERFAZ GRAFICA
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

      {/* --- MENÚ DESPLEGABLE PARA SELECCIONAR EMPRESA--- */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
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