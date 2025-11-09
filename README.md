# CRM MobileSoft

Bienvenido a `CRMMobileSoft`, una aplicación móvil de gestión de relaciones con clientes (CRM) completamente funcional. Este proyecto fue construido desde cero utilizando React Native (CLI) y Firebase.

La aplicación permite a los usuarios gestionar clientes y empresas a través de una base de datos en la nube, con autenticación segura y una arquitectura de estado global.

---

## Funcionalidades principales

Esta aplicación implementa una arquitectura sólida y profesional que incluye:

* **Autenticación completa:** flujo de registro (`SignUpScreen`) e inicio de sesión (`LoginScreen`) conectado a **Firebase Auth**.
* **Base de datos en la nube:** todos los datos de clientes y empresas se guardan permanentemente en **Firestore**, permitiendo la persistencia de datos entre sesiones.
* **Gestión de estado global:** se utiliza **Redux Toolkit** como el "cerebro" central de la app para gestionar las listas de clientes y empresas, permitiendo que la interfaz de usuario reaccione instantáneamente a los cambios.
* **Navegación anidada:** se utiliza **React Navigation** para crear un flujo de usuario robusto:
    * Un **Stack Navigator** principal que maneja el flujo de "Autenticación" (Login/Registro) y las pantallas "modales" (como Añadir/Editar).
    * Un **Bottom Tab Navigator** (Pestañas) para la interfaz principal de la app (Dashboard, Clientes, Empresas).
* **CRUD completo:**
    * Funcionalidad completa de **Crear, Leer, Actualizar y Eliminar (CRUD)** para Clientes.
    * Funcionalidad completa de **CRUD** para Empresas.
* **Relaciones de datos (CRM):** los Clientes están **vinculados** a las Empresas.
    * Al crear un cliente, se puede seleccionar una empresa de la lista (leída desde Redux).
    * Al ver una empresa, se puede navegar a una pantalla de detalles que muestra una lista filtrada de todos los clientes que pertenecen a esa empresa.
* **Dashboard de resumen:** una pantalla de inicio que muestra estadísticas clave en tiempo real (total de clientes, total de empresas) leídas directamente desde el estado de Redux.

---

## Pila tecnológica (Tech Stack)

* **Framework:** React Native (CLI)
* **Lenguaje:** TypeScript
* **Base de Datos:** Firebase Firestore
* **Autenticación:** Firebase Auth
* **Gestión de Estado:** Redux Toolkit
* **Navegación:** React Navigation (Stack, Tabs)
* **UI (Componentes):** React Native Paper
* **Iconos:** React Native Vector Icons

---

## Cómo empezar

Siga los pasos para ejecutar el proyecto en su  máquina local.

### 1. Requisitos 

Asegurarse de tener el entorno de desarrollo de React Native (CLI) configurado.
* [Guía de Configuración Oficial](https://reactnative.dev/docs/set-up-your-environment) (Selecciona "React Native CLI", tu "Development OS" y "Android" como "Target OS").
* Node.js (LTS)
* JDK (v17)
* Android Studio (para el SDK de Android)

> **⚠️ ¡Importante! Configuración de Firebase**
>
> Este proyecto requiere una conexión a Firebase para funcionar. Para ejecutarlo localmente, se debe:
> 1.  Crear un propio proyecto gratuito en la [Consola de Firebase](https://console.firebase.google.com/).
> 2.  Activar **Auth** (con el proveedor de email/contraseña).
> 3.  Activar **Firestore** (en modo de prueba).
> 4.  Registrar una nueva app de Android en el proyecto de Firebase (el nombre del paquete es `com.crmmobilesoft`).
> 5.  Descargar el archivo `google-services.json` que Firebase da.
> 6.  Colocar ese archivo `google-services.json` en la carpeta `CRMMobileSoft/android/app/`.

### 2. Instalación

Clona el repositorio y, desde la raíz del proyecto, instala todas las dependencias:

```sh
npm install

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
