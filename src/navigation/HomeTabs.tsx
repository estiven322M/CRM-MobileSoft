// Archivo: src/navigation/HomeTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- 1. IMPORTAMOS LAS 3 PANTALLAS ---
import DashboardScreen from '../screens/DashboardScreen'; // <-- NUEVA
import PeopleListScreen from '../screens/PeopleListScreen';
import CompanyListScreen from '../screens/CompanyListScreen';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      // Definimos la pestaña inicial
      initialRouteName="Dashboard" // <-- NUEVO: Empezar en el Dashboard
      
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',

        // --- 2. ACTUALIZAMOS LA LÓGICA DE ICONOS ---
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'account'; 

          if (route.name === 'Dashboard') { // <-- NUEVA LÓGICA
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
      {/* --- 3. AÑADIMOS LAS 3 PESTAÑAS --- */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} /> 
      <Tab.Screen name="Clientes" component={PeopleListScreen} />
      <Tab.Screen name="Empresas" component={CompanyListScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;