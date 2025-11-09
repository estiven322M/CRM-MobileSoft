// Archivo: src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,Button,Title,ActivityIndicator,MD2Colors,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }: { navigation: any }) =>{
  // Estados para guardar el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleLogin = async () => {
    // Validar que los campos no estén vacíos
    if (email === '' || password === '') {
      Alert.alert('Error', 'Por favor, introduce correo y contraseña.');
      return; // Detiene la función aquí
    }

    setIsLoading(true); // Activar el cargador

    try {
      // Intentar iniciar sesión con Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);

      // Si tiene éxito:
      console.log('¡Usuario ha iniciado sesión!', userCredential.user.email);
      navigation.navigate('Home');

    } catch (error: any) {
      // Si falla:
      console.log('Error de inicio de sesión:', error.code);
      let errorMessage = 'Ha ocurrido un error. Inténtalo de nuevo.';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo no es válido.';
      }

      Alert.alert('Error al iniciar sesión', errorMessage);

    } finally {
      
      setIsLoading(false); // Desactivar el cargador
    }
  };

  
  if (isLoading) {
    // Si estamos cargando, muestra el spinner
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          animating={true}
          color={MD2Colors.blue500} 
          size="large"
        />
        <Title style={styles.loaderText}>Verificando...</Title>
      </View>
    );
  }

  // Si no estamos cargando, muestra el formulario
  return (
    <View style={styles.container}>
      {/* Un título para la pantalla */}
      <Title style={styles.title}>Iniciar Sesión</Title>

      {/* Campo de texto para el Email */}
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={texto => setEmail(texto)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de texto para la Contraseña */}
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={texto => setPassword(texto)}
        style={styles.input}
        secureTextEntry
      />

      {/* Botón de Inicio de Sesión */}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Entrar
      </Button>
      <Button
        mode="text" 
        onPress={() => navigation.navigate('SignUp')}
        style={styles.button}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
}; 



// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    padding: 20, 
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15, 
  },
  button: {
    marginTop: 10,
    paddingVertical: 5, 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 15,
    fontSize: 18,
  },
});

export default LoginScreen;