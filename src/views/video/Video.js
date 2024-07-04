import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CFormSelect,
  CCardFooter,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import {
  Confirm,
} from 'react-admin';
import { cilPencil, cilTrash, cilShare, cilMagnifyingGlass, cilPlus, cilMediaPlay } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPlayer from 'react-player';
import { service } from './../../services';
import ConfigVideo from './ConfigVideo';

const Video = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoDetalhes, setVideoDetalhes] = useState({});
  const [participacoes, setParticipacoes] = useState([]);
  const [selectedArtista, setSelectedArtista] = useState('');
  const [artistasDisponiveis, setArtistasDisponiveis] = useState([]);
  const [modalConfigVisible, setModalConfigVisible] = useState(false);
  const [editVideoId, setEditVideoId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await service.video.listar();
        if (user.tipoDeUtilizador === 'admin') {
          setVideos(response.data);
        } else {
          setVideos(response.data.filter(item => item.fkUtilizador === user.codUtilizador));
        }

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

  const openDeleteConfirm = (id) => {
    setDeleteVideoId(id);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteVideoId(null);
    setConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteVideoId) {
      try {
        await service.video.excluir(deleteVideoId);
        setVideos(videos.filter(video => video.codVideo !== deleteVideoId));
        closeDeleteConfirm();
      } catch (err) {
        console.error('Erro ao excluir o vídeo:', err);
      }
    }
  };

  const handleShare = (id) => {
    alert(`Sharing video with ID: ${id}`);
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

  const handleShowVideoModal = async (video) => {
    setVideoDetalhes(video);
    setShowVideoModal(true);
    setModalVideoUrl(`https://localhost:3333/video/downloadVideo/${video.codVideo}`)
  };

  const handleClickVideo = (id) => { // Function to handle click
    navigate(`/videoReproducao/${id}`);
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

  const handleEdit = (id) => {
    setEditVideoId(id);
    setModalConfigVisible(true);
  };

  const handleModalConfigClose = async (success) => {
    setModalConfigVisible(false);
    setEditVideoId(null);
    if (success) {
      // Refresh the group list after successful creation/updation
      setLoading(true);
      try {
        const response = await service.video.listar();
        setVideos(response.data);
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
  const selectedVideos = videos.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cardStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
    backgroundColor: '#000'
  };

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-end'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    width: '40px',
    paddingTop: '16px',
    marginLeft: '15px'
  };

  const iconStyle = {
    marginBottom: '0.5rem',
    color: '#000'
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
          <CButton color="primary" onClick={() => setModalConfigVisible(true)}>
            <CIcon icon={cilPlus} className="me-2" />
            Inserir Novo Vídeo
          </CButton>
        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {selectedVideos.map((video, index) => {
          if (video.registadopor?.username === user.username || user.tipoDeUtilizador === "admin") {
            return (
              <CCol lg="6" sm="12" xl="4" md="6" key={video.codVideo}>
                <CCard style={cardStyle}>
                  <CCardBody style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '0px' }}>
                    <div className='video-thumbnail mt-0'><ReactPlayer
                      url={`https://localhost:3333/video/downloadVideo/${video.codVideo}`}
                      playing={false}
                      controls={true}
                      width="100%"
                      height="280px"
                      style={{ marginTop: '0px', padding: '0' }}
                      config={{
                        file: {
                          attributes: {
                            disablePictureInPicture: true,
                            controlsList: 'nodownload'
                          }
                        }
                      }}
                    /></div>
                    <div style={buttonGroupStyle} className='mt-5'>
                      <CButton color="secondary" style={buttonStyle}>
                        <Link onClick={() => handleEdit(video.codVideo)} style={{ color: 'white' }}>
                          <CIcon icon={cilPencil} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => openDeleteConfirm(video.codVideo)}>
                        <Link style={{ color: 'white' }}>
                          <CIcon icon={cilTrash} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => handleShowDetails(video)}>
                        <Link style={{ color: 'white' }}>
                          <CIcon icon={cilMagnifyingGlass} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                      <CButton color="secondary" style={buttonStyle} onClick={() => handleClickVideo(video.codVideo)}>
                        <Link style={{ color: 'white' }}>
                          <CIcon icon={cilMediaPlay} size="lg" style={iconStyle} />
                        </Link>
                      </CButton>
                    </div>
                  </CCardBody>
                  <CCardFooter>
                    <h5 style={{ color: '#fff' }}>{video.tituloVideo}</h5>
                  </CCardFooter>
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
          {[...Array(Math.ceil(videos.length / itemsPerPage)).keys()].map(number => (
            <CPaginationItem
              key={number + 1}
              active={currentPage === number + 1}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem disabled={currentPage === Math.ceil(videos.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
            Próxima
          </CPaginationItem>
        </CPagination>
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
          <p><strong>Visibilidade:</strong> {videoDetalhes.visibilidade}</p>
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

      <CModal backdrop="static" visible={modalConfigVisible} onClose={() => handleModalConfigClose(false)}>
        <CModalHeader closeButton>
          {editVideoId ? 'Editar Vídeo' : 'Criar Novo Vídeo'}
        </CModalHeader>
        <CModalBody>
          <ConfigVideo idEditVideo={editVideoId} onClose={handleModalConfigClose} />
        </CModalBody>
      </CModal>

      <Confirm
        isOpen={confirmOpen}
        loading={false}
        title="Excluir Vídeo"
        content="Tem certeza que deseja excluir este vídeo?"
        onConfirm={handleDeleteConfirm}
        onClose={closeDeleteConfirm}
        confirm='Confirmar'
        cancel='Cancelar'
      />
    </>
  );
};

export default Video;
