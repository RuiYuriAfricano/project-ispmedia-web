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
import { color } from 'chart.js/helpers';
import ConfigMusica from './ConfigMusica';

const Musica = () => {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [musicaDetalhes, setMusicaDetalhes] = useState({});
  const [participacoes, setParticipacoes] = useState([]);
  const [selectedArtista, setSelectedArtista] = useState('');
  const [artistasDisponiveis, setArtistasDisponiveis] = useState([]);
  const [modalConfigVisible, setModalConfigVisible] = useState(false);
  const [editMusicaId, setEditMusicaId] = useState(null);

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

  const handleEdit = (id) => {
    setEditMusicaId(id);
    setModalConfigVisible(true);
  };

  const handleModalConfigClose = async (success) => {
    setModalConfigVisible(false);
    setEditMusicaId(null);
    if (success) {
      // Refresh the group list after successful creation/updation
      setLoading(true);
      try {
        const response = await service.musica.listar();
        setMusicas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
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
    textAlign: 'center',

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
            Inserir Nova Música
          </CButton>

        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-3">
        {musicas.map((musica) => (
          <CCol lg="4" sm="12" xl="4" md="6" key={musica.codMusica}>
            <CCard style={cardStyle}>
              <CCardHeader>
                <h5>{musica.tituloMusica}</h5>
              </CCardHeader>
              <CCardBody style={cardBodyStyle}>
                <div className='w-100'>
                  <img src={`http://localhost:3333/musica/downloadCapa/${musica.codMusica}`} alt={musica.tituloMusica} style={imageStyle} />
                  <ReactPlayer
                    url={`http://localhost:3333/musica/downloadMusica/${musica.codMusica}`}
                    controls={true}
                    width="100%"
                    height="50px"
                  />
                </div>
                <div style={buttonGroupStyle}>
                  <CButton color="secondary" style={buttonStyle}>
                    <Link onClick={() => handleEdit(musica.codMusica)} style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                      <CIcon icon={cilPencil} size="lg" style={iconStyle} />

                    </Link>
                  </CButton>
                  <CButton color="secondary" style={buttonStyle} onClick={() => handleDelete(musica.codMusica)}>

                    <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                      <CIcon icon={cilTrash} size="lg" style={iconStyle} />
                    </Link>
                  </CButton>
                  <CButton color="secondary" style={buttonStyle} onClick={() => handleShare(musica.codMusica)}>
                    <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                      <CIcon icon={cilShare} size="lg" style={iconStyle} />
                    </Link>

                  </CButton>
                  <CButton color="secondary" style={buttonStyle} onClick={() => handleShowDetails(musica)}>

                    <Link style={{ color: 'white', textDecoration: 'none', marginLeft: '2px' }}>
                      <CIcon icon={cilMagnifyingGlass} size="lg" style={iconStyle} />
                    </Link>

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
            <CButton color="primary" onClick={handleAddParticipacao} style={{ marginTop: '10px' }}>
              Adicionar Participação
            </CButton>
          </div>
          <div style={participacoesStyle} className="mt-3">
            {participacoes.map((participacao) => (
              <div key={participacao.codParticipacao} style={participacaoItemStyle}>
                <span>{participacao.artista?.nomeArtista}</span>
                <CButton color="danger" size="sm" style={{ marginLeft: '10px' }} onClick={() => handleDeleteParticipacao(participacao.codParticipacao)}>
                  Excluir
                </CButton>
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={modalConfigVisible} onClose={() => handleModalConfigClose(false)}>
        <CModalHeader closeButton>
          {editMusicaId ? 'Editar Música' : 'Criar Nova Música'}
        </CModalHeader>
        <CModalBody>
          <ConfigMusica idEditMusica={editMusicaId} onClose={handleModalConfigClose} />
        </CModalBody>
      </CModal>
    </>
  );
};

export default Musica;
