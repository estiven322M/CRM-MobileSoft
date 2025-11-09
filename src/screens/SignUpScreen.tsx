// Archivo: src/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator, 
  MD2Colors,
} from 'react-native-paper';

// Importar el módulo de autenticación de Firebase
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Añadir el estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Reemplazar la función 'handleSignUp' completa
  const handleSignUp = async () => {
    // Validar campos vacíos
    if (email === '' || password === '' || confirmPassword === '') {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    // Validar contraseñas
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true); // Activar el cargador

    try {
      // Intentar crear el usuario en Firebase
      await auth().createUserWithEmailAndPassword(email, password);

      // Si tiene éxito:
      setIsLoading(false); // Desactivar el cargador
      Alert.alert(
        '¡Cuenta Creada!',
        'Tu cuenta ha sido registrada exitosamente. Serás redirigido a Iniciar sesión.',
      );
      // Enviar al usuario de vuelta a Login
      navigation.navigate('Login');

    } catch (error: any) {
      // 8. Si falla:
      setIsLoading(false); // Desactivar el cargador
      console.log('Error de registro:', error.code);
      let errorMessage = 'Ha ocurrido un error. Inténtalo de nuevo.';

      // Traducir códigos de error de Firebase
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Esa dirección de correo ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil (debe tener al menos 6 caracteres).';
      }

      Alert.alert('Error al Registrarse', errorMessage);
    }
  };

  
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          animating={true}
          color={MD2Colors.blue500}
          size="large"
        />
        <Title style={styles.loaderText}>Creando cuenta...</Title>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear Cuenta</Title>

      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        label="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.button}
      >
        Registrarse
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
};

// Añadir estilos
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

export default SignUpScreen;