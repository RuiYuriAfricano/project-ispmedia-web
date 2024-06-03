import React, { useEffect, useState, useRef } from 'react';
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
  const [showCaption, setShowCaption] = useState(false); // State to show/hide caption

  const playerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3333/status');
        if (response.status !== 404) {
          setServerStatus(false);
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

  const handlePlayerError = () => { };

  const handleShowDetails = async (video) => {
    setVideoDetalhes(video);
    setShowModal(true);
  };

  const handlePlayInModal = async (videoUrl, video) => {
    setModalVideoUrl(videoUrl);
    setShowVideoModal(true);
    startRecognition();
  };

  const toggleCaption = () => {
    setShowCaption(!showCaption);
  };

  const handleProgress = ({ playedSeconds }) => {
    // No changes here for now
  };

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser does not support speech recognition');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR'; // Adjust language as needed

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setCurrentCaption(event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            <CCard style={{ marginBottom: '2rem', textAlign: 'center' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }} className='mt-3'>
                  <CButton color="primary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', width: '65px' }}>
                    <CIcon icon={cilPencil} size="lg" style={{ marginBottom: '0.5rem' }} />
                    <Link to={`/configVideo/${video.codVideo}`} style={{ color: 'white' }}>Editar</Link>
                  </CButton>
                  <CButton color="danger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', width: '65px' }} onClick={() => handleDelete(video.codVideo)}>
                    <CIcon icon={cilTrash} size="lg" style={{ marginBottom: '0.5rem' }} />
                    Excluir
                  </CButton>
                  <CButton color="success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', width: '65px' }} onClick={() => handleShare(video.codVideo)}>
                    <CIcon icon={cilShare} size="lg" style={{ marginBottom: '0.5rem' }} />
                    Partilhar
                  </CButton>
                  <CButton color="info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', width: '65px' }} onClick={() => handleShowDetails(video)}>
                    <CIcon icon={cilMagnifyingGlass} size="lg" style={{ marginBottom: '0.5rem' }} />
                    Ver
                  </CButton>
                  <CButton color="info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', width: '65px' }} onClick={() => handlePlayInModal(`http://localhost:3333/video/downloadVideo/${video.codVideo}`, video)}>
                    <CIcon icon={cilMediaPlay} size="lg" style={{ marginBottom: '0.5rem' }} />
                    Play
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
          <p><strong>Gênero do Vídeo:</strong> {videoDetalhes.generoDoVIdeo}</p>
          <p><strong>Produtor:</strong> {videoDetalhes.produtor}</p>
          <p><strong>Data de Lançamento:</strong> {new Date(videoDetalhes.dataLancamento).toLocaleDateString()}</p>
          <p><strong>Artista:</strong> {videoDetalhes.artista?.nomeArtista}</p>
          <p><strong>Grupo Musical:</strong> {videoDetalhes.grupoMusical?.nomeGrupoMusical}</p>
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
            ref={playerRef}
            url={modalVideoUrl}
            playing={serverStatus}
            controls={true}
            width="100%"
            height="500px"
            onError={handlePlayerError}
            onProgress={handleProgress}
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
          <CButton color="info" onClick={toggleCaption}>Exibir Legenda</CButton>
          <CButton color="secondary" onClick={() => setShowVideoModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Video;
