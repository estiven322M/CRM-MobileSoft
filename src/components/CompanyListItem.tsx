// Archivo: src/components/CompanyListItem.tsx

import React from 'react';
import { List, Avatar, IconButton } from 'react-native-paper';
import { Company } from '../redux/slices/companiesSlice';

// Componente que muestra un ítem de empresa dentro de la lista
interface Props {
  company: Company;
  onPress: () => void;       // Acción al tocar el ítem
  onDeletePress: () => void; // Acción al tocar el botón de eliminar
}

const CompanyListItem: React.FC<Props> = ({
  company,
  onPress,
  onDeletePress,
}) => {
  return (
    <List.Item
      title={company.name} // Muestra el nombre de la empresa
      left={props => <Avatar.Icon {...props} icon="domain" />} // Ícono al inicio
      onPress={onPress} // Permite abrir o ver detalles

      // Botón de eliminar al lado derecho
      right={props => (
        <IconButton
          {...props}
          icon="delete"
          onPress={onDeletePress}
        />
      )}
    />
  );
};

export default CompanyListItem;
