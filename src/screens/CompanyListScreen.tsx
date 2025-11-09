// Archivo: src/screens/CompanyListScreen.tsx

import React, { useEffect } from 'react';
// Importamos Alert
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import {
  Title,
  Button, // <-- Asegúrate de que Button esté importado (para el logout)
  ActivityIndicator,
  MD2Colors,
  FAB,
} from 'react-native-paper';

// Importamos auth y firestore
import auth from '@react-native-firebase/auth'; // <-- Necesario para el logout
import firestore from '@react-native-firebase/firestore';

// --- Redux ---
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
// Importamos la nueva acción
import { fetchCompanies, deleteCompanyLocal } from '../redux/slices/companiesSlice';
// --- Fin Redux ---

import CompanyListItem from '../components/CompanyListItem';

const CompanyListScreen = ({ navigation }: { navigation: any }) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const { companyList, loading, error } = useSelector(
    (state: RootState) => state.companies,
  );
  
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login'); // Asume que 'Login' está en el stack principal
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleDelete = (companyId: string) => {
    Alert.alert(
      'Eliminar Empresa',
      '¿Estás seguro de que deseas eliminar esta empresa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('companies')
                .doc(companyId)
                .delete();

              dispatch(deleteCompanyLocal(companyId));
            } catch (err) {
              console.error('Error al eliminar empresa:', err);
              Alert.alert('Error', 'No se pudo eliminar la empresa.');
            }
          },
        },
      ],
    );
  };

  // --- (Renderizado condicional 'loading' y 'error') ---
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
      <Title style={styles.title}>Lista de Empresas</Title>
      
      {/* Botón de Logout temporalmente aquí */}
      <Button mode="contained" onPress={handleSignOut} style={styles.button}>
        Cerrar Sesión
      </Button>

      <FlatList
        data={companyList}
        renderItem={({ item }) => (
          <CompanyListItem
            company={item}
            
            // --- 👇👇 ¡AQUÍ ESTÁ LA CORRECCIÓN! 👇👇 ---
            // Cambiamos el destino de 'EditCompany' a 'CompanyDetail'
            onPress={() => {
              // Navegamos a 'CompanyDetail' y le pasamos el 'item' (la empresa)
              navigation.navigate('CompanyDetail', { company: item });
            }}
            // --- 👆👆 FIN DE LA CORRECCIÓN 👆👆 ---

            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aún no hay empresas.</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddCompany')}
      />
    </View>
  );
};

// --- (Estilos) ---
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
    marginHorizontal: 10,
    marginBottom: 10,
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

export default CompanyListScreen;