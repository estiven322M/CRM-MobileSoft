// Archivo: src/navigation/HomeTabs.tsx

import React from 'react';
// 1. Importamos el creador de pestañas
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 2. Importamos el icono (¡ya lo teníamos instalado!)
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 3. Importamos las dos pantallas que irán en las pestañas
import PeopleListScreen from '../screens/PeopleListScreen';
import CompanyListScreen from '../screens/CompanyListScreen';

// 4. Creamos el navegador de pestañas
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    // 5. Definimos el Navegador
    <Tab.Navigator
      // 6. Opciones para todas las pestañas
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultamos el título superior en cada pestaña
        tabBarActiveTintColor: '#6200ee', // Color de la pestaña activa
        tabBarInactiveTintColor: 'gray', // Color de la pestaña inactiva

        // 7. ¡LA MAGIA! Función para definir el icono
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'account'; // Icono por defecto

          if (route.name === 'Clientes') {
            // Icono para Clientes
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Empresas') {
            // Icono para Empresas
            iconName = focused ? 'office-building' : 'office-building-outline';
          }

          // Devolvemos el componente de Icono
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 8. Definimos nuestras dos pestañas */}
      <Tab.Screen name="Clientes" component={PeopleListScreen} />
      <Tab.Screen name="Empresas" component={CompanyListScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;