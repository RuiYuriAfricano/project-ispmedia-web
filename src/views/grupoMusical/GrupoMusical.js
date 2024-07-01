import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
  CModalFooter,
  CImage,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { cilGroup, cilMediaPlay, cilPen, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';
import ConfigGrupoMusical from './ConfigGrupoMusical';
import './GrupoMusical.css';
import thumbnail from './img/default-thumbnail.jpeg';
import { isNullOrUndef } from 'chart.js/helpers';

const GrupoMusical = () => {
  if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/login"></Navigate>;
  }
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editGrupoId, setEditGrupoId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define the number of items per page
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await service.grupoMusical.listar();
        setGrupos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este grupo musical?");
    if (confirmDelete) {
      try {
        await service.grupoMusical.excluir(id);
        setGrupos(grupos.filter(grupo => grupo.codGrupoMusical !== id));
      } catch (err) {
        console.error('Erro ao excluir o grupo musical:', err);
      }
    }
  };

  const handleEdit = (id) => {
    setEditGrupoId(id);
    setModalVisible(true);
  };

  const handleModalClose = async (success) => {
    setModalVisible(false);
    setEditGrupoId(null);
    if (success) {
      // Refresh the group list after successful creation/updation
      setLoading(true);
      try {
        const response = await service.grupoMusical.listar();
        setGrupos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedGrupos = grupos.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Listagem dos Grupos Musicais</strong>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Novo Grupo
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable className="text-center" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"><CIcon icon={cilGroup} /></CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                  <CTableHeaderCell scope="col">História</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Data de Criação</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Registo na Aplicação</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Registado Por</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Operações</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedGrupos.map((grupo, index) => {
                  if (grupo.registadopor?.username === user.username || user.tipoDeUtilizador === "admin") {
                    return (
                      <CTableRow key={grupo.codGrupoMusical}>
                        <CTableHeaderCell scope="row">
                          <div className="thumbnail-wrapper" >
                            <Link>
                              <CImage
                                className="thumbnail"
                                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShSzprQCZ58UNKjhlnJ2f0yU-ZKfs6jBo15A&s"} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                alt={grupo.nomeGrupoMusical}
                              />
                              <CIcon icon={cilMediaPlay} className="play-icon" />
                            </Link>
                          </div>
                        </CTableHeaderCell>
                        <CTableDataCell>{grupo.nomeGrupoMusical}</CTableDataCell>
                        <CTableDataCell>{grupo.historia}</CTableDataCell>
                        <CTableDataCell>{new Date(grupo.dataDeCriacao).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{new Date(grupo.dataDeRegisto).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{grupo.registadopor?.username}</CTableDataCell>
                        <CTableDataCell>

                          <Link onClick={() => handleEdit(grupo.codGrupoMusical)}><CIcon icon={cilPen} /></Link>
                          <span>    </span>
                          <Link onClick={() => handleDelete(grupo.codGrupoMusical)}><CIcon icon={cilTrash} /></Link>

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
              {[...Array(Math.ceil(grupos.length / itemsPerPage)).keys()].map(number => (
                <CPaginationItem
                  key={number + 1}
                  active={currentPage === number + 1}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem disabled={currentPage === Math.ceil(grupos.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                Próxima
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalVisible} onClose={() => handleModalClose(false)}>
        <CModalHeader closeButton>
          {editGrupoId ? 'Editar Grupo Musical' : 'Criar Novo Grupo Musical'}
        </CModalHeader>
        <CModalBody>
          <ConfigGrupoMusical idEditGrupo={editGrupoId} onClose={handleModalClose} />
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default GrupoMusical;
