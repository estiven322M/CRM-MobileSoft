// Archivo: App.tsx

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importaciones Redux
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Importar pantallas
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PeopleListScreen from './src/screens/PeopleListScreen';
import AddPersonScreen from './src/screens/AddPersonScreen';
import EditPersonScreen from './src/screens/EditPersonScreen';
import HomeTabs from './src/navigation/HomeTabs';
import AddCompanyScreen from './src/screens/AddCompanyScreen';
import EditCompanyScreen from './src/screens/EditCompanyScreen';
import CompanyDetailScreen from './src/screens/CompanyDetailScreen';


// Crear el "Stack Navigator"
const Stack = createNativeStackNavigator();


const App = () => {
  return (
    
    <Provider store={store}>
      {/*El PaperProvider va dentro */}
      <PaperProvider>
        {/*El NavigationContainer va dentro de PaperProvider */}
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Pantallas */}
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