import { useState } from 'react';
import FormModal from '../../../Components/Forms/FormModal';

const Tools = () => {
  const [abrirFormModal, setAbrirFormModal] = useState(false);
  const [fieldsForm, setFieldsForm] = useState([]);
  const [endpoint, setEndpoint] = useState('');

  const handleAbrirFormModal = (action) => {
    let fields = [];
    let apiEndpoint = '';

    switch (action) {
      case 'add':
        fields = [
          { name: 'nombre', type: 'text', label: 'Nombre del Artículo' },
          { name: 'precio', type: 'number', label: 'Precio' },
          { name: 'descripcion', type: 'text', label: 'Descripción' },
          // Agrega más campos según sea necesario
        ];
        apiEndpoint = '/api/articulos/agregar';
        break;
      case 'edit':
        fields = [
          { name: 'id', type: 'text', label: 'ID del Artículo' },
          { name: 'nombre', type: 'text', label: 'Nuevo Nombre' },
          { name: 'precio', type: 'number', label: 'Nuevo Precio' },
          // Agrega más campos según sea necesario
        ];
        apiEndpoint = '/api/articulos/modificar';
        break;
      case 'delete':
        fields = [
          { name: 'id', type: 'text', label: 'ID del Artículo' },
          // Tal vez solo necesites el ID para eliminar
        ];
        apiEndpoint = '/api/articulos/eliminar';
        break;
      default:
        break;
    }

    setFieldsForm(fields);
    setEndpoint(apiEndpoint);
    setAbrirFormModal(true);
  };

  const handleCerrarFormModal = () => {
    setAbrirFormModal(false);
    setFieldsForm([]);
    setEndpoint('');
  };

  return (
    <>
      <article className="tools__productos">
        <p onClick={() => handleAbrirFormModal('add')}>Agregar Artículo</p>
        <p onClick={() => handleAbrirFormModal('edit')}>Modificar Artículo</p>
        <p onClick={() => handleAbrirFormModal('delete')}>Eliminar Artículo</p>
      </article>
      {abrirFormModal && (
        <FormModal
          fieldsForm={fieldsForm}
          endpoint={endpoint}
          onClose={handleCerrarFormModal}
        />
      )}
    </>
  );
};

export default Tools;
