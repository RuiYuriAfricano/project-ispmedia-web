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
import ReactPlayer from 'react-player';
import { service } from './../../services';

const Musica = () => {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(false); // Estado do servidor: true = online, false = offline
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal
  const [musicaDetalhes, setMusicaDetalhes] = useState({}); // Estado para armazenar os detalhes da música

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3333/status');
        if (response.status !== 404) {
          setServerStatus(false); // Se o status for 200, o servidor está online
        }
      } catch (error) {
        setServerStatus(false); // Em caso de erro, o servidor está offline
      }
    };
    const interval = setInterval(checkServerStatus, 5000); // Verifica o status do servidor a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    const fetchMusicas = async () => {
      try {
        const response = await service.musica.listar();
        setMusicas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMusicas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta música?");
    if (confirmDelete) {
      try {
        await service.musica.excluir(id);
        setMusicas(musicas.filter(musica => musica.codMusica !== id));
      } catch (err) {
        console.error('Erro ao excluir a música:', err);
      }
    }
  };

  const handleShare = (id) => {
    // Implement your share functionality here
    alert(`Sharing music with ID: ${id}`);
  };

  const handlePlayerError = () => {
    // Define o estado de reprodução como falso
  };

  const handlePlay = () => {
    if (!serverStatus) {
      alert('O servidor está offline. A reprodução não pode continuar.'); // Exibe uma mensagem se o servidor estiver offline
      return;
    }
    // Define o estado de reprodução como verdadeiro
  };

  const handleShowDetails = (musica) => {
    setMusicaDetalhes(musica);
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
          <Link to="/configMusica">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-2" />
              Inserir Nova Música
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {musicas.map((musica, index) => (

          < CCol sm="12" md="4" key={musica.codMusica} >
            <CCard style={cardStyle}>
              <CCardHeader>
                <h5>{musica.tituloMusica}</h5>
              </CCardHeader>
              <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={`http://localhost:3333/musica/downloadCapa/${musica.codMusica}`} alt={musica.tituloMusica} style={{ marginBottom: '1rem', maxWidth: '100%', height: '120px' }} />
                <ReactPlayer
                  url={`http://localhost:3333/musica/downloadMusica/${musica.codMusica}`}
                  playing={serverStatus}
                  controls={true}
                  width="100%"
                  height="50px"
                  onError={handlePlayerError}
                />
                <div style={buttonGroupStyle} className='mt-3'>
                  <CButton color="primary" style={buttonStyle}>
                    <CIcon icon={cilPencil} size="lg" style={iconStyle} />
                    <Link to={`/configMusica/${musica.codMusica}`} style={{ color: 'white' }}>Editar</Link>
                  </CButton>
                  <CButton color="danger" style={buttonStyle} onClick={() => handleDelete(musica.codMusica)}>
                    <CIcon icon={cilTrash} size="lg" style={iconStyle} />
                    Excluir
                  </CButton>
                  <CButton color="success" style={buttonStyle} onClick={() => handleShare(musica.codMusica)}>
                    <CIcon icon={cilShare} size="lg" style={iconStyle} />
                    Partilhar
                  </CButton>
                  <CButton color="info" style={buttonStyle} onClick={() => handleShowDetails(musica)}>
                    <CIcon icon={cilMagnifyingGlass} size="lg" style={iconStyle} />
                    Ver
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow >

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader onClose={() => setShowModal(false)}>
          <CModalTitle>Detalhes da Música</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Título:</strong> {musicaDetalhes.tituloMusica}</p>
          <p><strong>Letra:</strong> {musicaDetalhes.letra}</p>
          <p><strong>Gênero Musical:</strong> {musicaDetalhes.generoMusical}</p>
          <p><strong>Compositor:</strong> {musicaDetalhes.compositor}</p>
          <p><strong>Data de Lançamento:</strong> {new Date(musicaDetalhes.dataLancamento).toLocaleDateString()}</p>
          <p><strong>Álbum:</strong> {musicaDetalhes.album?.tituloAlbum}</p>
          <p><strong>Artista:</strong> {musicaDetalhes.artista?.nomeArtista}</p>
          <p><strong>Grupo Musical:</strong> {musicaDetalhes.grupoMusical?.nomeGrupoMusical}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Musica;
