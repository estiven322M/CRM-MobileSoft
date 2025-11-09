// Archivo: src/components/PersonListItem.tsx

import React from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { Person } from '../redux/slices/peopleSlice';

// Componente para mostrar una persona dentro de la lista
interface Props {
  person: Person;
  onPress: () => void; // Acción al tocar el ítem (por ejemplo, ver detalles)
  onDeletePress: () => void; // Acción al tocar el botón de eliminar
}

const PersonListItem: React.FC<Props> = ({
  person,
  onPress,
  onDeletePress, 
}) => {
  return (
    <List.Item
      title={person.name} // Muestra el nombre de la persona
      description={person.companyName || 'Sin empresa'} // Si no tiene empresa asignada, muestra un texto por defecto
      left={props => <Avatar.Icon {...props} icon="account" />}
      onPress={onPress}
      
      // Botón para eliminar a la derecha
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