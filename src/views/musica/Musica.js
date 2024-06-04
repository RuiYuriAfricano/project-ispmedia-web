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
import { cilPencil, cilTrash, cilShare, cilMagnifyingGlass, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPlayer from 'react-player';
import { service } from './../../services';

const Musica = () => {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [musicaDetalhes, setMusicaDetalhes] = useState({});
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
    alert(`Sharing music with ID: ${id}`);
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

  const fetchParticipacoes = async (musicaId) => {
    try {
      const response = await service.participacaoMusica.listar();
      const participacoesFiltradas = response.data.filter(p => p.fkMusica === musicaId);
      setParticipacoes(participacoesFiltradas);
    } catch (error) {
      console.error('Erro ao carregar as participações:', error);
    }
  };

  const handleShowDetails = async (musica) => {
    setMusicaDetalhes(musica);
    setShowModal(true);
    fetchParticipacoes(musica.codMusica);
  };

  const handleAddParticipacao = async () => {
    if (!selectedArtista) {
      alert('Selecione um artista para adicionar participação.');
      return;
    }

    try {
      await service.participacaoMusica.add({
        fkArtista: selectedArtista,
        fkMusica: musicaDetalhes.codMusica
      });
      fetchParticipacoes(musicaDetalhes.codMusica);
      setSelectedArtista('');
    } catch (error) {
      console.error('Erro ao adicionar participação:', error);
    }
  };

  const handleDeleteParticipacao = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta participação?");
    if (confirmDelete) {
      try {
        await service.participacaoMusica.excluir(id);
        fetchParticipacoes(musicaDetalhes.codMusica);
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
          <CCol sm="12" md="4" key={musica.codMusica}>
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
                  height="50px" onError={handlePlayerError}
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
      </CRow>
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
                <div key={participacao.codParticipacaoMusica} style={participacaoItemStyle}>
                  <span>{participacao.artista?.nomeArtista}</span>
                  <CButton color="danger" size="sm" style={participacaoButtonStyle} onClick={() => handleDeleteParticipacao(participacao.codParticipacaoMusica)}>Excluir</CButton>
                </div>
              ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Musica;
