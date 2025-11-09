// Archivo: src/components/CompanyListItem.tsx

import React from 'react';
// <-- 1. IMPORTAMOS IconButton
import { List, Avatar, IconButton } from 'react-native-paper';
import { Company } from '../redux/slices/companiesSlice';

// Definimos qué propiedades (props) recibirá este componente
interface Props {
  company: Company;
  onPress: () => void;
  onDeletePress: () => void; // <-- 2. AÑADIMOS LA PROP DE ELIMINAR
}

const CompanyListItem: React.FC<Props> = ({
  company,
  onPress,
  onDeletePress, // <-- 3. Recibimos la prop
}) => {
  return (
    <List.Item
      title={company.name}
      left={props => <Avatar.Icon {...props} icon="domain" />}
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

export default CompanyListItem;