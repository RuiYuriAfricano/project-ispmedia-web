import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CAvatar
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { cilPen, cilPeople, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';
import ConfigArtista from './ConfigArtista';
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
const Artista = () => {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [artistaToEdit, setArtistaToEdit] = useState(null);

  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await service.artista.listar();
        setArtistas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchArtistas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este artista?");
    if (confirmDelete) {
      try {
        await service.artista.excluir(id);
        setArtistas(artistas.filter((artista) => artista.codArtista !== id));
      } catch (err) {
        console.error('Erro ao excluir o artista:', err);
      }
    }
  };

  const openModal = (artista = null) => {
    setArtistaToEdit(artista);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setArtistaToEdit(null);
  };

  const handleSaveArtista = async () => {
    // Re-fetch the list of artists after saving
    try {
      const response = await service.artista.listar();
      setArtistas(response.data);
      closeModal();
    } catch (err) {
      console.error('Erro ao recarregar a lista de artistas:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Listagem dos Artistas</strong>
              <CButton color="primary" onClick={() => openModal()}>
                <CIcon icon={cilPlus} className="mr-2" />
                Novo Artista
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable className="text-center" align="middle" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="text-center" scope="col"><CIcon icon={cilPeople} /></CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Nome</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Gênero Musical</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Grupo Musical</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Registado por</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Operações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {artistas.map((artista, index) => (
                    <CTableRow key={artista.codArtista}>
                      <CTableHeaderCell scope="row"><CAvatar size="md" src={avatar1} status='success' /></CTableHeaderCell>
                      <CTableDataCell>{artista.nomeArtista}</CTableDataCell>
                      <CTableDataCell>{artista.generoMusical}</CTableDataCell>
                      <CTableDataCell>{artista.grupoMusical?.nomeGrupoMusical}</CTableDataCell>
                      <CTableDataCell>{artista.registadopor?.username}</CTableDataCell>
                      <CTableDataCell>

                        <Link onClick={() => openModal(artista)}><CIcon icon={cilPen} /></Link>
                        <span>    </span>
                        <Link onClick={() => handleDelete(artista.codArtista)}><CIcon icon={cilTrash} /></Link>

                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={closeModal}>
        <CModalHeader closeButton>{artistaToEdit ? 'Editar Artista' : 'Criar Novo Artista'}</CModalHeader>
        <CModalBody>
          <ConfigArtista artista={artistaToEdit} onSave={handleSaveArtista} closeModal={closeModal} />
        </CModalBody>
      </CModal>
    </>
  );
};

export default Artista;
