// Archivo: src/screens/DashboardScreen.tsx

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// 1. Importamos Card y Title
import { Title, Card, Avatar, Text } from 'react-native-paper';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Pantalla principal del CRM, mostando resumen general (clientes y empresas)
const DashboardScreen = () => {
  // Obener listas de personas y empresas desde Redux
  const { peopleList } = useSelector((state: RootState) => state.people);
  const { companyList } = useSelector((state: RootState) => state.companies);

  // Calcular los totales
  const totalClients = peopleList.length;
  const totalCompanies = companyList.length;

  return (
    // Usamos ScrollView para que se vea bien si añadimos más tarjetas
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Resumen del CRM</Title>

      {/* Tarjeta para Clientes */}
      <Card style={styles.card}>
        <Card.Title
          title="Total de Clientes"
          left={props => <Avatar.Icon {...props} icon="account-group" />}
        />
        <Card.Content>
          {/* Mostramos el número total */}
          <Text style={styles.cardNumber}>{totalClients}</Text>
        </Card.Content>
      </Card>

      {/*Tarjeta para Empresas */}
      <Card style={styles.card}>
        <Card.Title
          title="Total de Empresas"
          left={props => <Avatar.Icon {...props} icon="office-building" />}
        />
        <Card.Content>
          <Text style={styles.cardNumber}>{totalCompanies}</Text>
        </Card.Content>
      </Card>

      {/*  */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  card: {
    marginBottom: 20, // Espacio entre tarjetas
  },
  cardNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'right', // Alinea el número a la derecha
    paddingRight: 10,
    color: '#6200ee', // Color principal
  },
});

export default DashboardScreen;