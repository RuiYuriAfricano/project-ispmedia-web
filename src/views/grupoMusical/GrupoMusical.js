import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  CImage
} from '@coreui/react';
import { cilGroup, cilMediaPlay, cilPen, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';
import ConfigGrupoMusical from './ConfigGrupoMusical';
import './GrupoMusical.css';
import thumbnail from './img/default-thumbnail.jpeg';

const GrupoMusical = () => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editGrupoId, setEditGrupoId] = useState(null);

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
                {grupos.map((grupo, index) => (
                  <CTableRow key={grupo.codGrupoMusical}>
                    <CTableHeaderCell scope="row">
                      <div className="thumbnail-wrapper" >
                        <Link>
                          <CImage
                            className="thumbnail"
                            src={thumbnail} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
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
                ))}
              </CTableBody>
            </CTable>
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
