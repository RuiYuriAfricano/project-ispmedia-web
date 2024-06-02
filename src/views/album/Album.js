import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  CModalFooter
} from '@coreui/react';
import { cilPencil, cilTrash, cilShare, cilMagnifyingGlass, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';

const Album = () => {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [albumDetalhes, setAlbumDetalhes] = useState({});

  useEffect(() => {
    const fetchAlbuns = async () => {
      try {
        const response = await service.album.listar();
        setAlbuns(response.data);
        setLoading(false);
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

  const handleShare = (id) => {
    alert(`Sharing album with ID: ${id}`);
  };

  const handleShowDetails = (album) => {
    setAlbumDetalhes(album);
    setShowModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cardStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  };

  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60px',
    width: '75px',
  };

  const iconStyle = {
    marginBottom: '0.5rem',
  };

  return (
    <>
      <CRow className="justify-content-center mt-2">
        <CCol sm="12" className="mb-3 d-flex justify-content-end">
          <Link to="/configAlbum">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-2" />
              Inserir Novo Álbum
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {albuns.map((album) => (
          <CCol sm="12" md="4" key={album.codAlbum}>
            <CCard style={cardStyle}>
              <CCardHeader>
                <h5>{album.tituloAlbum}</h5>
              </CCardHeader>
              <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={`http://localhost:3333/album/downloadCapa/${album.codAlbum}`} alt={album.tituloAlbum} style={{ marginBottom: '1rem', maxWidth: '100%', height: '120px' }} />
                <div style={buttonGroupStyle} className='mt-3'>
                  <CButton color="primary" style={buttonStyle}>
                    <CIcon icon={cilPencil} size="lg" style={iconStyle} />
                    <Link to={`/configAlbum/${album.codAlbum}`} style={{ color: 'white' }}>Editar</Link>
                  </CButton>
                  <CButton color="danger" style={buttonStyle} onClick={() => handleDelete(album.codAlbum)}>
                    <CIcon icon={cilTrash} size="lg" style={iconStyle} />
                    Excluir
                  </CButton>
                  <CButton color="success" style={buttonStyle} onClick={() => handleShare(album.codAlbum)}>
                    <CIcon icon={cilShare} size="lg" style={iconStyle} />
                    Partilhar
                  </CButton>
                  <CButton color="info" style={buttonStyle} onClick={() => handleShowDetails(album)}>
                    <CIcon icon={cilMagnifyingGlass} size="lg" style={iconStyle} />
                    Ver
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
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
          <p><strong>Utilizador:</strong> {albumDetalhes.registadopor?.username}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Album;
