// Archivo: src/components/PersonListItem.tsx

import React from 'react';
// <-- 1. IMPORTAMOS IconButton
import { List, Avatar, IconButton } from 'react-native-paper';
import { Person } from '../redux/slices/peopleSlice';

// Definimos qué propiedades (props) recibirá este componente
interface Props {
  person: Person;
  onPress: () => void; // Para ir a "Detalles"
  onDeletePress: () => void; // <-- 2. AÑADIMOS LA PROP DE ELIMINAR
}

const PersonListItem: React.FC<Props> = ({
  person,
  onPress,
  onDeletePress, // <-- 3. Recibimos la prop
}) => {
  return (
    <List.Item
      title={person.name}
      description={person.company}
      left={props => <Avatar.Icon {...props} icon="account" />}
      onPress={onPress}
      
      // <-- 4. AÑADIMOS EL BOTÓN A LA DERECHA
      right={props => (
        <IconButton
          {...props}
          icon="delete" // Icono de papelera
          onPress={onDeletePress} // Llama a la función de eliminar
        />
      )}
    />
  );
};

export default PersonListItem;