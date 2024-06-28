import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { service } from './../../services';
import ConfigGrupoDeAmigos from './ConfigGrupoDeAmigos';
import './GrupoDeAmigos.css';
import thumbnail from './img/default-thumbnail.png';

const GrupoDeAmigos = () => {
  const { id } = useParams();

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
      const response = await service.grupoDeAmigos.listar();
      if (id != undefined) {
        const responde2 = await service.membrosDasListas.listar();

        const filtro = responde2.data.filter((item) => item.fkListaDePartilha === parseInt(id))
        const gruposDaListaDePartilha = response.data.filter((item) => {
          const search = filtro.find((v) => v.fkGrupoDeAmigos === item.codGrupoDeAmigos)
          if (search) return item
        })
        setGrupos(gruposDaListaDePartilha);
      }
      else {
        setGrupos(response.data);
      }

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
        await service.grupoDeAmigos.excluir(id);
        setGrupos(grupos.filter(grupo => grupo.codGrupoDeAmigos !== id));
      } catch (err) {
        console.error('Erro ao excluir o grupo de amigos:', err);
      }
    }
  };

  const handleEdit = (id) => {
    setEditGrupoId(id);
    setModalVisible(true);
  };

  const handleEntrarNoGrupo = async (codGrupoDeAmigos, codCriador, nomeDoGrupo) => {

    const addMembro = {
      "fkUtilizador": user.codUtilizador,
      "fkGrupoDeAmigos": codGrupoDeAmigos,
      "estado": 0,
      "isOwner": 0,
    };

    try {
      let response;
      response = await service.membrosDosGrupos.add(addMembro);

      if (response?.status === 201 || response?.status === 200) {

        alert("Pedido enviado, aguarde a resposta.");
        fetchGrupos()
        fetchMembros()

        const response2 = service.notificacao.add({
          "fkUtilizador": Number(codCriador),
          "utilizadorOrigem": user.username,
          "textoNotificacao": "O utilizador " + user.username + ", deseja entrar no grupo " + nomeDoGrupo + ".",

        })

        console.log(response2)
      } else {
        alert("Erro ao entrar no grupo.");
      }
    } catch (error) {
      console.log("Erro ao conectar com o servidor!, ", error);
    }
  };

  const handleModalClose = async (success) => {
    setModalVisible(false);
    setEditGrupoId(null);
    if (success) {
      setLoading(true);
      try {
        const response = await service.grupoDeAmigos.listar();
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
            <strong>Meus Grupos de Amigos</strong>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Novo Grupo
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="group-grid">
              {selectedGrupos.map((grupo) => (
                <div className="group-card" key={grupo.codGrupoDeAmigos}>
                  <Link to={(membros.some((membro) => membro.fkGrupoDeAmigos === grupo.codGrupoDeAmigos && membro.estado === 1) || grupo.fkCriador === user.codUtilizador || user.tipoDeUtilizador === 'admin') ? `/grupoConteudo/${grupo.codGrupoDeAmigos}` : `#`} className='ligacao'>
                    <div className="thumbnail-wrapper">
                      <CImage className="thumbnail4" src="https://www.rockstarmarketing.co.uk/wp-content/uploads/Facebook-Ads-In-Groups-Cover.jpg" alt={grupo.nomeDoGrupo} onError={(e) => e.target.src = '/img/default-thumbnail.png'} />
                      {
                        (membros.some((membro) => membro.fkGrupoDeAmigos === grupo.codGrupoDeAmigos && membro.estado === 1) || grupo.fkCriador === user.codUtilizador || user.tipoDeUtilizador === 'admin') && (<CIcon icon={cilMediaPlay} className="play-icon" />)
                      }

                    </div>
                    <div className="group-info">
                      <h5>{grupo.nomeDoGrupo}</h5>
                      <p>{grupo.utilizador?.username}</p>
                      <p>{new Date(grupo.dataDeCriacao).toLocaleDateString()}</p>
                    </div>
                  </Link>
                  <div className="group-actions">
                    {
                      (membros.some((membro) => membro.fkGrupoDeAmigos === grupo.codGrupoDeAmigos && membro.estado === 1) || grupo.fkCriador === user.codUtilizador) &&
                      (
                        <>
                          <Link className='ligacao' onClick={() => handleEdit(grupo.codGrupoDeAmigos)}><CIcon icon={cilPen} /></Link>
                          <Link className='ligacao' onClick={() => handleDelete(grupo.codGrupoDeAmigos)}><CIcon icon={cilTrash} /></Link>
                        </>
                      )
                    }
                    {
                      (!membros.some((membro) => membro.fkGrupoDeAmigos === grupo.codGrupoDeAmigos) && grupo.fkCriador !== user.codUtilizador) &&
                      (
                        <>
                          <Link className='ligacao' onClick={() => handleEntrarNoGrupo(grupo.codGrupoDeAmigos, grupo.fkCriador, grupo.nomeDoGrupo)}>
                            Entrar no Grupo</Link>
                        </>
                      )
                    }

                    {
                      (membros.some((membro) => membro.fkGrupoDeAmigos === grupo.codGrupoDeAmigos && membro.estado === 0) && grupo.fkCriador !== user.codUtilizador) &&
                      (
                        <>
                          <Link className='ligacao'>
                            Pedido Enviado </Link>
                        </>
                      )
                    }
                  </div>
                </div>
              ))}
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
          {editGrupoId ? 'Editar Grupo de Amigos' : 'Criar Novo Grupo de Amigos'}
        </CModalHeader>
        <CModalBody>
          <ConfigGrupoDeAmigos idEditGrupo={editGrupoId} onClose={handleModalClose} />
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default GrupoDeAmigos;
