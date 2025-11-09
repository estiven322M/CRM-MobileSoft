// Archivo: src/screens/PeopleListScreen.tsx

import React, { useEffect } from 'react';
// <-- 1. IMPORTAMOS Alert
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import {
  Title,
  Button,
  ActivityIndicator,
  MD2Colors,
  FAB,
} from 'react-native-paper';

// <-- 2. IMPORTAMOS auth y firestore
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// --- Redux ---
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
// <-- 3. IMPORTAMOS la nueva acción
import { fetchPeople, deletePersonLocal } from '../redux/slices/peopleSlice';
// --- Fin Redux ---

import PersonListItem from '../components/PersonListItem';

const PeopleListScreen = ({ navigation }: { navigation: any }) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const { peopleList, loading, error } = useSelector(
    (state: RootState) => state.people,
  );

  const handleSignOut = async () => {
    // ... (esta función no cambia)
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // <-- 4. CREAMOS LA FUNCIÓN DE ELIMINAR
  const handleDelete = (personId: string) => {
    // 4.1. Preguntar al usuario (Confirmación)
    Alert.alert(
      'Eliminar Cliente',
      '¿Estás seguro de que deseas eliminar a este cliente? Esta acción no se puede deshacer.',
      [
        // Botón 1: Cancelar
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        // Botón 2: Eliminar (Acción)
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // 4.2. Eliminar de Firebase
            try {
              const userId = auth().currentUser?.uid;
              if (!userId) throw new Error('Usuario no encontrado');

              // Ir a la "carpeta" contacts y borrar el documento con ese ID
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('contacts')
                .doc(personId)
                .delete();

              // 4.3. Eliminar de Redux (local)
              // Solo se ejecuta si Firebase tuvo éxito
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

  // --- (Renderizado condicional 'loading' y 'error' no cambian) ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={MD2Colors.blue500} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error al cargar: {error}</Text>
      </View>
    );
  }

  // --- Renderizado Principal (La Lista) ---
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Lista de Clientes (CRM)</Title>

      <FlatList
        data={peopleList}
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            onPress={() => {
              navigation.navigate('EditPerson', { person: item });
            }}
            // <-- 5. PASAMOS LA FUNCIÓN AL ÍTEM
            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          // ... (esto no cambia)
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aún no hay clientes.</Text>
          </View>
        }
      />

      <Button mode="contained" onPress={handleSignOut} style={styles.button}>
        Cerrar Sesión
      </Button>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddPerson')}
      />
    </View>
  );
};

// --- (Estilos no cambian) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 15,
  },
  button: {
    margin: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PeopleListScreen;