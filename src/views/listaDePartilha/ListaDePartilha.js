import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CImage,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { cilPlus, cilMediaPlay, cilTrash, cilPen, cilUserPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from '../../services';
import ConfigListaDePartilha from './ConfigListaDePartilha';
import './ListaDePartilha.css';
import thumbnail from './img/listaDePartilha.png';
import { isNullOrUndef } from 'chart.js/helpers';

const ListaDePartilha = () => {

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
  const [membros, setMembros] = useState([]);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");

  const fetchGrupos = async () => {
    try {
      const response = await service.listaDePartilha.listar();
      setGrupos(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este grupo de amigos?");
    if (confirmDelete) {
      try {
        await service.listaDePartilha.excluir(id);
        setGrupos(grupos.filter(grupo => grupo.codListaDePartilha !== id));
      } catch (err) {
        console.error('Erro ao excluir o grupo de amigos:', err);
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
      setLoading(true);
      try {
        const response = await service.listaDePartilha.listar();
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

  const fetchMembros = async () => {
    try {
      const response = await service.membrosDosGrupos.listar();
      if (response?.status === 201) {
        const membrosFiltrado = response.data.filter(membro => membro.fkUtilizador === user.codUtilizador);
        setMembros(membrosFiltrado);
      } else {
        setMsgDoAlert("Erro ao carregar membros do grupo");
        setCorDoAlert("danger");
      }
    } catch (error) {
      setMsgDoAlert("Erro ao conectar com o servidor!");
      setCorDoAlert("danger");
    }
  };
  useEffect(() => {
    fetchMembros();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedGrupos = grupos.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Minhas Listas de Partilhas</strong>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Nova Lista
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="group-grid">
              {selectedGrupos.map((grupo) => {
                if (grupo.fkUtilizador === user.codUtilizador) {
                  return (
                    <div className="group-card" key={grupo.codListaDePartilha}>
                      <Link to={`/grupoDeAmigos/${grupo.codListaDePartilha}`} className='ligacao'>
                        <div className="thumbnail-wrapper">
                          <CImage className="thumbnail6" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0CIO6_ntQDhXt-Whvp7VYlSu9vraSLf-IKg&s" alt={grupo.nomeDoGrupo} onError={(e) => e.target.src = '/img/default-thumbnail.png'} />
                          {
                            (<CIcon icon={cilMediaPlay} className="play-icon" />)
                          }

                        </div>
                        <div className="group-info">
                          <h5>{grupo.nomeDaLista}</h5>
                          <p>{grupo.utilizador?.username}</p>
                          <p>{new Date(grupo.dataDeCriacao).toLocaleDateString()}</p>
                        </div>
                      </Link>
                      <div className="group-actions">

                        <>
                          <Link className='ligacao' onClick={() => handleEdit(grupo.codListaDePartilha)}><CIcon icon={cilPen} /></Link>
                          <Link className='ligacao' onClick={() => handleDelete(grupo.codListaDePartilha)}><CIcon icon={cilTrash} /></Link>
                        </>

                      </div>
                    </div>
                  )
                }
              }
              )}
            </div>
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
          {editGrupoId ? 'Editar Lista de Partilha' : 'Criar Nova Lista de Partilha'}
        </CModalHeader>
        <CModalBody>
          <ConfigListaDePartilha idEditGrupo={editGrupoId} onClose={handleModalClose} />
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default ListaDePartilha;
