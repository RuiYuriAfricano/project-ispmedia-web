import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { cilPencil, cilTrash, cilShare, cilMagnifyingGlass, cilPlus, cilEyedropper, cilMediaPlay } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';
import ConfigAlbum from './ConfigAlbum';

const Album = () => {
  const navigate = useNavigate(); // Initialize useNavigateconst navigate = useNavigate(); // Initialize useNavigate
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfigVisible, setModalConfigVisible] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState(null);
  const [albumDetalhes, setAlbumDetalhes] = useState({});
  const user = JSON.parse(localStorage.getItem("loggedUser"));//isPublicGroup

  useEffect(() => {
    const fetchAlbuns = async () => {
      try {
        const response = await service.album.listar();
        if (response.status === 201) {
          setAlbuns(response.data);
          setLoading(false);
        }

      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAlbuns();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este álbum?");
    if (confirmDelete) {
      try {
        await service.album.excluir(id);
        setAlbuns(albuns.filter(album => album.codAlbum !== id));
      } catch (err) {
        console.error('Erro ao excluir o álbum:', err);
      }
    }
  };

  const handlePlay = (id) => {

    navigate(`/albumReproducao/${id}`);

  };

  const handleShowDetails = (album) => {
    setAlbumDetalhes(album);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setEditAlbumId(id);
    setModalConfigVisible(true);
  };

  const handleModalConfigClose = async (success) => {
    setModalConfigVisible(false);
    setEditAlbumId(null);
    if (success) {
      // Refresh the group list after successful creation/updation
      setLoading(true);
      try {
        const response = await service.album.listar();
        setAlbuns(response.data);
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Define the number of items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedGAlbuns = albuns.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cardStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
  };

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
    alignItems: 'flex-start',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '30px',
    width: '50px',
    textAlign: 'center'
  };

  const iconStyle = {
    marginRight: '0.5rem',
    color: '#000'
  };

  const cardBodyStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  };

  const imageStyle = {
    marginBottom: '1rem',
    width: '270px',
    height: '200px',
  };

  return (
    <>
      <CRow className="justify-content-center mt-2">
        <CCol sm="12" className="mb-3 d-flex justify-content-end">

          <CButton color="primary" onClick={() => setModalConfigVisible(true)}>
            <CIcon icon={cilPlus} className="me-2" />
            Inserir Novo Álbum
          </CButton>

        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {selectedGAlbuns.map((album) => {
          if (album.registadopor?.username === user.username || user.tipoDeUtilizador === "admin") {
            return (

              <CCol lg="6" sm="12" xl="4" md="6" key={album.codAlbum}>
                <CCard style={cardStyle}>
                  <CCardHeader>
                    <h5>{album.tituloAlbum}</h5>
                  </CCardHeader>
                  <CCardBody style={cardBodyStyle}>
                    <img src={`https://localhost:3333/album/downloadCapa/${album.codAlbum}`} alt={album.tituloAlbum} style={imageStyle} />
                    <div style={buttonGroupStyle}>
                      <CButton color="secondary" style={buttonStyle}>

                        <Link onClick={() => handleEdit(album.codAlbum)} style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}> <CIcon icon={cilPencil} size="lg" style={iconStyle} /></Link>
                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => handleDelete(album.codAlbum)}>

                        <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}><CIcon icon={cilTrash} size="lg" style={iconStyle} /></Link>

                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => handlePlay(album.codAlbum)}>

                        <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                          <CIcon icon={cilMediaPlay} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => handleShowDetails(album)}>

                        <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                          <CIcon icon={cilMagnifyingGlass} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            )
          }
        }

        )}

        <CPagination align="center" className="mt-3">
          <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Anterior
          </CPaginationItem>
          {[...Array(Math.ceil(albuns.length / itemsPerPage)).keys()].map(number => (
            <CPaginationItem
              key={number + 1}
              active={currentPage === number + 1}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem disabled={currentPage === Math.ceil(albuns.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
            Próxima
          </CPaginationItem>
        </CPagination>
      </CRow>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>Detalhes do Álbum</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Título:</strong> {albumDetalhes.tituloAlbum}</p>
          <p><strong>Descrição:</strong> {albumDetalhes.descricao}</p>
          <p><strong>Editora:</strong> {albumDetalhes.editora}</p>
          <p><strong>Data de Lançamento:</strong> {new Date(albumDetalhes.dataLancamento).toLocaleDateString()}</p>
          <p><strong>Artista/Grupo Musical:</strong> {albumDetalhes.artista ? albumDetalhes.artista.nomeArtista : albumDetalhes.grupoMusical?.nomeGrupoMusical}</p>
          <p><strong>Visibilidade:</strong> {albumDetalhes.visibilidade}</p>
          <p><strong>Utilizador:</strong> {albumDetalhes.registadopor?.username}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>

      <CModal backdrop="static" visible={modalConfigVisible} onClose={() => handleModalConfigClose(false)}>
        <CModalHeader closeButton>
          {editAlbumId ? 'Editar Album' : 'Criar Novo Album'}
        </CModalHeader>
        <CModalBody>
          <ConfigAlbum idEditAlbum={editAlbumId} onClose={handleModalConfigClose} />
        </CModalBody>
      </CModal>
    </>
  );
};

export default Album;
