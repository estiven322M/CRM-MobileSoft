// Archivo: src/screens/CompanyDetailScreen.tsx

import React from 'react'; // No necesitamos useEffect aquí
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Title, Button } from 'react-native-paper'; // Quitamos FAB, etc.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// --- Redux ---
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
// Importamos las acciones de Personas, ya que esta lista maneja Personas
import { deletePersonLocal } from '../redux/slices/peopleSlice';
// --- Fin Redux ---

import PersonListItem from '../components/PersonListItem'; // <-- REUTILIZAMOS el ítem de Persona

// 1. Recibimos 'props: any' para 'route' y 'navigation'
const CompanyDetailScreen = (props: any) => {
  const { navigation, route } = props;
  // 2. Obtenemos la empresa que se pasó como parámetro
  const { company } = route.params;

  const dispatch: AppDispatch = useDispatch();

  // 3. LEEMOS la lista COMPLETA de clientes desde Redux
  const { peopleList } = useSelector(
    (state: RootState) => state.people,
  );

  // 4. ¡LA MAGIA! Filtramos la lista de clientes
  // Nos quedamos solo con las personas cuyo 'companyId' coincide
  const filteredClients = peopleList.filter(
    person => person.companyId === company.id,
  );

  // 5. Reutilizamos la lógica de 'handleDelete' de PeopleListScreen
  // ¡Podemos borrar clientes desde esta pantalla también!
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

              await firestore()
                .collection('users')
                .doc(userId)
                .collection('contacts')
                .doc(personId)
                .delete();

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

  // --- Renderizado Principal (La Lista) ---
  return (
    <View style={styles.container}>
      {/* 6. El título es el nombre de la empresa */}
      <Title style={styles.title}>{company.name}</Title>
      <Text style={styles.subtitle}>Clientes en esta empresa</Text>

      {/* 7. Usamos la lista de clientes FILTRADA */}
      <FlatList
        data={filteredClients}
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            // Navegamos a Editar Persona (¡sigue funcionando!)
            onPress={() => {
              navigation.navigate('EditPerson', { person: item });
            }}
            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        
        // 8. Mensaje de lista vacía personalizado
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay clientes asignados a esta empresa.</Text>
          </View>
        }
      />

      {/* 9. Un botón simple para volver a la lista de empresas */}
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

// (Estilos similares, sin FAB)
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