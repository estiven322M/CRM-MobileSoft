// Archivo: src/screens/CompanyDetailScreen.tsx

import React from 'react'; 
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Title, Button } from 'react-native-paper'; 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { deletePersonLocal } from '../redux/slices/peopleSlice';
// --- Fin Redux ---

import PersonListItem from '../components/PersonListItem'; // Reutilizar componenete Persona

// Pantalla que muestra los detalles de una empesa y sus clientes asociados
const CompanyDetailScreen = (props: any) => {
  const { navigation, route } = props;
  const { company } = route.params; // Empesa seleccionada desde la lista

  const dispatch: AppDispatch = useDispatch();

  // Obener personas desde Redux
  const { peopleList } = useSelector(
    (state: RootState) => state.people,
  );

  // Filtrar las personas que pertenecen a esta empesa
  const filteredClients = peopleList.filter(
    person => person.companyId === company.id,
  );

  
  // Eliminar un cliente
  const handleDelete = (personId: string) => {
    Alert.alert(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar a este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth().currentUser?.uid;
              if (!userId) throw new Error('Usuario no encontrado');

              // Eliminar registro de Firestore
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('contacts')
                .doc(personId)
                .delete();

                // ACtualizar el estado local
                dispatch(deletePersonLocal(personId));
            } catch (err) {
              console.error('Error al eliminar:', err);
              Alert.alert('Error', 'No se pudo eliminar el cliente.');
            }
          },
        },
      ],
    );
  };

  
  return (
    <View style={styles.container}>
      {/* El título es el nombre de la empresa */}
      <Title style={styles.title}>{company.name}</Title>
      <Text style={styles.subtitle}>Clientes en esta empresa</Text>

      {/* Usamos la lista de clientes FILTRADA */}
      <FlatList
        data={filteredClients}
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            // Navegar a editar persona
            onPress={() => {
              navigation.navigate('EditPerson', { person: item });
            }}
            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay clientes asignados a esta empresa.</Text>
          </View>
        }
      />

      {/* Un botón simple para volver a la lista de empresas */}
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Volver
      </Button>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  button: {
    margin: 10,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default CompanyDetailScreen;