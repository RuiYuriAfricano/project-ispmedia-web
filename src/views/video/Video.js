import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect
} from '@coreui/react';
import { cilPencil, cilTrash, cilShare, cilMagnifyingGlass, cilPlus, cilMediaPlay } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPlayer from 'react-player';
import { service } from './../../services';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoDetalhes, setVideoDetalhes] = useState({});
  const [modalVideoUrl, setModalVideoUrl] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const [participacoes, setParticipacoes] = useState([]);
  const [selectedArtista, setSelectedArtista] = useState('');
  const [artistasDisponiveis, setArtistasDisponiveis] = useState([]);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3333/status');
        if (response.status !== 404) {
          setServerStatus(true);
        }
      } catch (error) {
        setServerStatus(false);
      }
    };
    const interval = setInterval(checkServerStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await service.video.listar();
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await service.artista.listar();
        setArtistasDisponiveis(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchArtistas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este vídeo?");
    if (confirmDelete) {
      try {
        await service.video.excluir(id);
        setVideos(videos.filter(video => video.codVideo !== id));
      } catch (err) {
        console.error('Erro ao excluir o vídeo:', err);
      }
    }
  };

  const handleShare = (id) => {
    alert(`Sharing video with ID: ${id}`);
  };

  const handlePlayerError = () => {
    // Handle player error
  };

  const handlePlay = () => {
    if (!serverStatus) {
      alert('O servidor está offline. A reprodução não pode continuar.');
      return;
    }
    // Start playing
  };

  const fetchParticipacoes = async (videoId) => {
    try {
      const response = await service.participacaoVideo.listar();
      if (Array.isArray(response.data)) {
        const participacoesFiltradas = response.data.filter(p => p.fkVideo === videoId);
        setParticipacoes(participacoesFiltradas);
      } else {
        console.error('response.data não é um array:', response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar as participações:', error);
    }
  };

  const handleShowDetails = async (video) => {
    setVideoDetalhes(video);
    setShowModal(true);
    fetchParticipacoes(video.codVideo);
  };

  const handleAddParticipacao = async () => {
    if (!selectedArtista) {
      alert('Selecione um artista para adicionar participação.');
      return;
    }

    try {
      await service.participacaoVideo.add({
        fkArtista: selectedArtista,
        fkVideo: videoDetalhes.codVideo
      });
      fetchParticipacoes(videoDetalhes.codVideo);
      setSelectedArtista('');
    } catch (error) {
      console.error('Erro ao adicionar participação:', error);
    }
  };

  const handleDeleteParticipacao = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta participação?");
    if (confirmDelete) {
      try {
        await service.participacaoVideo.excluir(id);
        fetchParticipacoes(videoDetalhes.codVideo);
      } catch (err) {
        console.error('Erro ao excluir a participação:', err);
      }
    }
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

  const participacoesStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const participacaoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  };

  const participacaoButtonStyle = {
    marginLeft: '10px',
  };

  return (
    <>
      <CRow className="justify-content-center mt-2">
        <CCol sm="12" className="mb-3 d-flex justify-content-end">
          <Link to="/configVideo">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-2" />
              Inserir Novo Vídeo
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {videos.map((video, index) => (
          <CCol sm="12" md="4" key={video.codVideo}>
            <CCard style={cardStyle}>
              <CCardHeader>
                <h5>{video.tituloVideo}</h5>
              </CCardHeader>
              <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ReactPlayer
                  url={`http://localhost:3333/video/downloadVideo/${video.codVideo}`}
                  playing={serverStatus}
                  controls={true}
                  width="100%"
                  height="220px"
                  onError={handlePlayerError}
                />
                <div style={buttonGroupStyle} className='mt-3'>
                  <CButton color="primary" style={buttonStyle}>
                    <CIcon icon={cilPencil} size="lg" style={iconStyle} />
                    <Link to={`/configVideo/${video.codVideo}`} style={{ color: 'white' }}>Editar</Link>
                  </CButton>
                  <CButton color="danger" style={buttonStyle} onClick={() => handleDelete(video.codVideo)}>
                    <CIcon icon={cilTrash} size="lg" style={iconStyle} />
                    Excluir
                  </CButton>
                  <CButton color="success" style={buttonStyle} onClick={() => handleShare(video.codVideo)}>
                    <CIcon icon={cilShare} size="lg" style={iconStyle} />
                    Partilhar
                  </CButton>
                  <CButton color="info" style={buttonStyle} onClick={() => handleShowDetails(video)}>
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
          <CModalTitle>Detalhes do Vídeo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Título:</strong> {videoDetalhes.tituloVideo}</p>
          <p><strong>Gênero do Vídeo:</strong> {videoDetalhes.generoDoVideo}</p>
          <p><strong>Produtor:</strong> {videoDetalhes.produtor}</p>
          <p><strong>Data de Lançamento:</strong> {new Date(videoDetalhes.dataLancamento).toLocaleDateString()}</p>
          <p><strong>Álbum:</strong> {videoDetalhes.album?.tituloAlbum}</p>
          <p><strong>Artista:</strong> {videoDetalhes.artista?.nomeArtista}</p>
          <p><strong>Grupo Musical:</strong> {videoDetalhes.grupoMusical?.nomeGrupoMusical}</p>

          <hr />
          <h5>Participações</h5>
          <CForm>
            <CFormSelect value={selectedArtista} onChange={(e) => setSelectedArtista(e.target.value)}>
              <option value="">Selecione um artista...</option>
              {artistasDisponiveis
                .filter((artista) => !participacoes.some((participacao) => participacao.artista?.codArtista === artista.codArtista))
                .map((artista) => (
                  <option key={artista.codArtista} value={artista.codArtista}>
                    {artista.nomeArtista}
                  </option>
                ))}
            </CFormSelect>
          </CForm>

          <div className="mt-3">
            <CButton color="primary" onClick={handleAddParticipacao}>Adicionar Participação</CButton>
          </div>

          <div style={participacoesStyle} className="mt-3">
            {participacoes
              .map((participacao) => (
                <div key={participacao.codParticipacaoVideo} style={participacaoItemStyle}>
                  <span>{participacao.artista?.nomeArtista}</span>
                  <CButton color="danger" size="sm" style={participacaoButtonStyle} onClick={() => handleDeleteParticipacao(participacao.codParticipacaoVideo)}>Excluir</CButton>
                </div>
              ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={showVideoModal} onClose={() => setShowVideoModal(false)} size="lg">
        <CModalHeader onClose={() => setShowVideoModal(false)}>
          <CModalTitle>Legendas do Vídeo</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: 0, position: 'relative' }}>
          <ReactPlayer
            url={modalVideoUrl}
            playing={serverStatus}
            controls={true}
            width="100%"
            height="500px"
            onError={handlePlayerError}
          />
          {showCaption && (
            <div style={{
              position: 'absolute',
              bottom: '65px',
              width: '100%',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '0.5rem',
              fontSize: '1.2rem'
            }}>
              {currentCaption}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="info" onClick={() => setShowCaption(!showCaption)}>Exibir Legenda</CButton>
          <CButton color="secondary" onClick={() => setShowVideoModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Video;
