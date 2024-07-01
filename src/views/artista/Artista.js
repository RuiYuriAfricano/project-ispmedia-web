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
  CAvatar,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { Link, Navigate } from 'react-router-dom';
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
import { isNullOrUndef } from 'chart.js/helpers';
const Artista = () => {

  if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/login"></Navigate>;
  }

  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [artistaToEdit, setArtistaToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define the number of items per page
  const user = JSON.parse(localStorage.getItem("loggedUser"));

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedGrupos = artistas.slice(startIndex, startIndex + itemsPerPage);

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
                  {artistas.map((artista, index) => {

                    if (artista.registadopor?.username === user.username || user.tipoDeUtilizador === "admin") {
                      return (
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
                      )
                    }

                  }

                  )}
                </CTableBody>
              </CTable>
              <CPagination align="center" className="mt-3">
                <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </CPaginationItem>
                {[...Array(Math.ceil(artistas.length / itemsPerPage)).keys()].map(number => (
                  <CPaginationItem
                    key={number + 1}
                    active={currentPage === number + 1}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === Math.ceil(artistas.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                  Próxima
                </CPaginationItem>
              </CPagination>
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
