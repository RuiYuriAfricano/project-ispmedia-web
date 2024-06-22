import React from 'react';
import { Navigate } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CCardImage, CCardFooter, CButton, CImage, CForm, CInputGroup, CFormInput } from '@coreui/react';
import "./style/dashboard.css";
import { FaThumbsUp, FaComment, FaEye } from 'react-icons/fa';
import { useEffect } from 'react';
import { isNullOrUndef } from 'chart.js/helpers';
import StarRating from '../starRating/StarRating';
import { useState } from 'react';
import { service } from './../../services';

const VideoList = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: 'Rui Malemba', // Substitua pelo nome do usuário atual
    photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
  });
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

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

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        text: newComment,
        rating,
        user: currentUser
      }]);
      setNewComment('');
      setRating(0);
    }
  };

  const toggleComments = (index) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
  };

  return (
    <CCol md={6}>
      <CCard className="mb-4">
        <CCardHeader>Vídeos Recentes</CCardHeader>
        <CCardBody>

          {videos.map((video, index) => (
            <CCard className="video-card mb-3" key={index}>

              <CCardBody>
                <div className="video-thumbnail">
                  <video controls width="100%" height="300" controlsList="nodownload" disablePictureInPicture>
                    {/* Definindo altura e largura */}
                    <source src={`http://localhost:3333/video/downloadVideo/${video.codVideo}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

              </CCardBody>
              <CCardFooter>

                <div className="video-details" style={{}}>
                  <h5 color='secondary'>{video.tituloVideo}</h5>
                  <p>{video.fkArtista ? video.artista?.nomeArtista : video.grupoMusical?.nomeGrupoMusical}, {new Date(video.dataLancamento).toLocaleDateString()}</p>
                </div>
              </CCardFooter>
              <CCardFooter style={{ textAlign: 'center', padding: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <FaThumbsUp
                    style={{ cursor: 'pointer', color: likedAlbums.includes(index) ? '#6261cc' : 'inherit' }}
                    onClick={() => toggleLike(index)}
                  />

                  <FaComment style={{ cursor: 'pointer' }} onClick={() => toggleComments(index)} />
                  <FaEye style={{ cursor: 'pointer' }} />
                </div>
              </CCardFooter>
              {expandedAlbum === index && (
                <CCardFooter>
                  <div style={{ padding: '0' }}>
                    <h6>Comentários:</h6>
                    {comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="comment">
                        <div className="comment-header">
                          <CImage width="50" height="50" src={comment.user.photo} alt={comment.user.name} className="user-photo" />
                          <span className="user-name">{comment.user.name}</span>
                          <StarRating rating={comment.rating} setRating={() => { }} />
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Adicionar um comentário"
                        />
                      </CInputGroup>
                      <StarRating rating={rating} setRating={setRating} />
                      <CButton color="primary" onClick={handleAddComment}>Comentar</CButton>
                    </CForm>
                  </div>
                </CCardFooter>
              )}
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const MusicList = () => {

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: 'Rui Malemba', // Substitua pelo nome do usuário atual
    photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
  });
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [musicas, setMusicas] = useState([]);

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

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        text: newComment,
        rating,
        user: currentUser
      }]);
      setNewComment('');
      setRating(0);
    }
  };

  const toggleComments = (index) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
  };

  return (
    <CCol md={3} >
      <CCard className="mb-4" >
        <CCardHeader>Músicas Recentes</CCardHeader>
        <CCardBody className='pt-1'>
          {musicas.map((music, index) => (
            <CCard className="music-card mb-3" key={index}>
              <CCardHeader>
                <div className="music-details">

                  <h5>{music.tituloMusica}</h5>
                  <p>{music.fkArtista ? music.artista?.nomeArtista : music.grupoMusical?.nomeGrupoMusical}, {new Date(music.dataLancamento).toLocaleDateString()}</p>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="music-thumbnail">
                  <CCardImage src={`http://localhost:3333/musica/downloadCapa/${music.codMusica}`} alt={music.tituloMusica} width="230" height="150" />
                  {/* Definindo altura e largura */}

                </div>
              </CCardBody>
              <CCardFooter style={{ textAlign: 'center', paddingBottom: '18px' }}>
                <div style={{ width: '100%', height: '45px', marginTop: '10px', overflow: 'hidden' }}>
                  <audio controlsList="nodownload" controls style={{ width: '100%', height: '100%' }}>
                    <source src={`http://localhost:3333/musica/downloadMusica/${music.codMusica}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </CCardFooter>
              <CCardFooter style={{ textAlign: 'center', padding: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <FaThumbsUp
                    style={{ cursor: 'pointer', color: likedAlbums.includes(index) ? '#6261cc' : 'inherit' }}
                    onClick={() => toggleLike(index)}
                  />

                  <FaComment style={{ cursor: 'pointer' }} onClick={() => toggleComments(index)} />
                  <FaEye style={{ cursor: 'pointer' }} />
                </div>
              </CCardFooter>
              {expandedAlbum === index && (
                <CCardFooter>
                  <div style={{ padding: '0' }}>
                    <h6>Comentários:</h6>
                    {comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="comment">
                        <div className="comment-header">
                          <CImage width="50" height="50" src={comment.user.photo} alt={comment.user.name} className="user-photo" />
                          <span className="user-name">{comment.user.name}</span>
                          <StarRating className="star" rating={comment.rating} setRating={() => { }} />
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Adicionar um comentário"
                        />
                      </CInputGroup>
                      <StarRating rating={rating} setRating={setRating} />
                      <CButton color="primary" onClick={handleAddComment}>Comentar</CButton>
                    </CForm>
                  </div>
                </CCardFooter>
              )}
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const AlbumList = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albuns, setAlbuns] = useState([]);

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


  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: 'Rui Malemba', // Substitua pelo nome do usuário atual
    photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
  });
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        text: newComment,
        rating,
        user: currentUser
      }]);
      setNewComment('');
      setRating(0);
    }
  };

  const toggleComments = (index) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
  };

  return (
    <CCol md={3}>
      <CCard className="mb-4">
        <CCardHeader>Álbuns Recentes</CCardHeader>
        <CCardBody>
          {albuns.map((album, index) => (
            <CCard className="album-card mb-3" key={index}>
              <CCardHeader>
                <div className="album-details pt-2">
                  <h5>{album.tituloAlbum}</h5>
                  <p>{album.fkArtista ? album.artista?.nomeArtista : album.grupoMusical?.nomeGrupoMusical}, {new Date(album.dataLancamento).toLocaleDateString()}</p>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="album-thumbnail">
                  <CCardImage src={`http://localhost:3333/album/downloadCapa/${album.codAlbum}`} alt={album.tituloAlbum} width="230" height="150" />
                </div>
              </CCardBody>
              <CCardFooter style={{ textAlign: 'center', padding: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <FaThumbsUp
                    style={{ cursor: 'pointer', color: likedAlbums.includes(index) ? '#6261cc' : 'inherit' }}
                    onClick={() => toggleLike(index)}
                  />

                  <FaComment style={{ cursor: 'pointer' }} onClick={() => toggleComments(index)} />
                  <FaEye style={{ cursor: 'pointer' }} />
                </div>
              </CCardFooter>
              {expandedAlbum === index && (
                <CCardFooter>
                  <div style={{ padding: '0' }}>
                    <h6>Comentários:</h6>
                    {comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="comment">
                        <div className="comment-header">
                          <CImage width="50" height="50" src={comment.user.photo} alt={comment.user.name} className="user-photo" />
                          <span className="user-name">{comment.user.name}</span>
                          <StarRating className="star" rating={comment.rating} setRating={() => { }} />
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Adicionar um comentário"
                        />
                      </CInputGroup>
                      <StarRating rating={rating} setRating={setRating} />
                      <CButton color="primary" onClick={handleAddComment}>Comentar</CButton>
                    </CForm>
                  </div>
                </CCardFooter>
              )}
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};


const Dashboard = () => {
  if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/login"></Navigate>;
  }
  return (
    <CRow>
      <VideoList />
      <MusicList />
      <AlbumList />
    </CRow>
  );
};

export default Dashboard;
