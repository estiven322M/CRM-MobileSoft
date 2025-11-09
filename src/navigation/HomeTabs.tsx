// Archivo: src/navigation/HomeTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Se importan las tres pantallas que apaecerán en la barra inferior
import DashboardScreen from '../screens/DashboardScreen'; // <-- NUEVA
import PeopleListScreen from '../screens/PeopleListScreen';
import CompanyListScreen from '../screens/CompanyListScreen';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard" //  Empezar en el Dashboard
        screenOptions={({ route }) => ({
        headerShown: false, // Oculta el encabezado por defecto
        tabBarActiveTintColor: '#6200ee', // Color cando la pestaña está activa
        tabBarInactiveTintColor: 'gray', // Color cuando está inactiva

        // Asignación de íconos según la pestaña
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'account'; // Valor por defecto

          if (route.name === 'Dashboard') { 
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Clientes') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Empresas') {
            iconName = focused ? 'office-building' : 'office-building-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* --- Añadir las tres pestañas --- */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} /> 
      <Tab.Screen name="Clientes" component={PeopleListScreen} />
      <Tab.Screen name="Empresas" component={CompanyListScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;