// Archivo: App.tsx

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- Importaciones de Redux ---
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// --- Importamos pantallas ---
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PeopleListScreen from './src/screens/PeopleListScreen';
import AddPersonScreen from './src/screens/AddPersonScreen';
import EditPersonScreen from './src/screens/EditPersonScreen';
import HomeTabs from './src/navigation/HomeTabs';
import AddCompanyScreen from './src/screens/AddCompanyScreen';
import EditCompanyScreen from './src/screens/EditCompanyScreen';
import CompanyDetailScreen from './src/screens/CompanyDetailScreen';


// 1. Creamos el "Stack Navigator"
const Stack = createNativeStackNavigator();

// 2. Este es el bloque de código actualizado
const App = () => {
  return (
    // 3. El Provider de Redux envuelve todo
    <Provider store={store}>
      {/* 4. El PaperProvider va dentro */}
      <PaperProvider>
        {/* 5. El NavigationContainer va dentro de PaperProvider */}
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Tus pantallas */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="AddPerson" component={AddPersonScreen} />
            <Stack.Screen name="EditPerson" component={EditPersonScreen} />
            <Stack.Screen name="AddCompany" component={AddCompanyScreen} />
            <Stack.Screen name="EditCompany" component={EditCompanyScreen} />
            <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;