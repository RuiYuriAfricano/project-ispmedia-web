import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CModal, CModalHeader, CModalBody, CImage, CPagination, CPaginationItem } from '@coreui/react';
import { cilPlus, cilMediaPlay, cilTrash, cilPen } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';
import ConfigPlaylist from './ConfigPlaylist';
import './Playlist.css';
import thumbnail from './img/default-thumbnail.png';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define the number of items per page

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await service.playlist.listar();
        setPlaylists(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta PlayList?");
    if (confirmDelete) {
      try {
        await service.playlist.excluir(id);
        setPlaylists(playlists.filter(playlist => playlist.codPlayList !== id));
      } catch (err) {
        console.error('Erro ao excluir a playList:', err);
      }
    }
  };

  const handleEdit = (id) => {
    setEditPlaylistId(id);
    setModalVisible(true);
  };

  const handleModalClose = async (success) => {
    setModalVisible(false);
    setEditPlaylistId(null);
    if (success) {
      setLoading(true);
      try {
        const response = await service.playlist.listar();
        setPlaylists(response.data);
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedPlaylists = playlists.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Minhas Playlists</strong>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Nova Playlist
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="playlist-grid">
              {selectedPlaylists.map((playlist, index) => (
                <div className="playlist-card" key={playlist.codPlayList}>
                  <Link to={`/playlistConteudo/${playlist.codPlayList}`} className='ligacao'>
                    <div className="thumbnail-wrapper">
                      <CImage className="thumbnail" src={thumbnail} alt={playlist.nomePlayList} onError={(e) => e.target.src = '/img/default-thumbnail.png'} />
                      <CIcon icon={cilMediaPlay} className="play-icon" />
                    </div>
                    <div className="playlist-info">
                      <h5>{playlist.nomePlayList}</h5>
                      <p>{playlist.tipoPlayList}</p>
                      <p>{new Date(playlist.dataDeCriacao).toLocaleDateString()}</p>
                    </div>
                  </Link>
                  <div className="playlist-actions">
                    <Link onClick={() => handleEdit(playlist.codPlayList)}><CIcon icon={cilPen} /></Link>
                    <Link onClick={() => handleDelete(playlist.codPlayList)}><CIcon icon={cilTrash} /></Link>
                  </div>
                </div>
              ))}
            </div>
            <CPagination align="center" className="mt-3">
              <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                Anterior
              </CPaginationItem>
              {[...Array(Math.ceil(playlists.length / itemsPerPage)).keys()].map(number => (
                <CPaginationItem
                  key={number + 1}
                  active={currentPage === number + 1}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem disabled={currentPage === Math.ceil(playlists.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                Próxima
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalVisible} onClose={() => handleModalClose(false)}>
        <CModalHeader closeButton>
          {editPlaylistId ? 'Editar Playlist' : 'Criar Nova Playlist'}
        </CModalHeader>
        <CModalBody>
          <ConfigPlaylist idEditPlaylist={editPlaylistId} onClose={handleModalClose} />
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default Playlist;
