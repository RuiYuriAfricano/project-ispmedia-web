import React from 'react';
import { Navigate } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CCardImage, CCardFooter, CButton, CImage, CForm, CInputGroup, CFormInput } from '@coreui/react';
import "./style/dashboard.css";
import { FaThumbsUp, FaComment, FaEye } from 'react-icons/fa';
import { cilTrash, cilPencil } from '@coreui/icons';
import { useEffect } from 'react';
import { isNullOrUndef } from 'chart.js/helpers';
import StarRating from '../starRating/StarRating';
import { useState } from 'react';
import { service } from './../../services';
import InfiniteScroll from 'react-infinite-scroll-component';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';

const VideoList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [comments, setComments] = useState({});
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingComment, setEditingComment] = useState(null);

  const fetchVideos = async (page) => {
    try {
      const response = await service.video.listarPorPagina(page, 1);
      const sortedVideos = response.data.sort((a, b) => new Date(b.dataDeRegisto) - new Date(a.dataDeRegisto));
      setVideos((prevVideos) => [...prevVideos, ...sortedVideos]);
      setHasMore(response.data.length > 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      videos.forEach(video => {
        fetchComments(video.codVideo);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [videos]);


  const fetchMoreVideos = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchComments = async (videoId) => {
    try {
      const response = await service.criticas.listar();
      const videoComments = response.data.filter(comment => comment.fkVideo === videoId);
      setComments(prevComments => ({ ...prevComments, [videoId]: videoComments }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = async (videoId) => {
    if (newComment.trim()) {
      const newCommentData = {
        fkVideo: videoId,
        fkUtilizador: user.codUtilizador,
        pontuacao: rating,
        comentario: newComment
      };
      try {
        if (editingComment) {
          const newCommentData = {
            fkVideo: videoId,
            fkUtilizador: user.codUtilizador,
            pontuacao: rating,
            comentario: newComment,
            codCritica: Number(editingComment.codCritica)
          };
          // Editing existing comment
          await service.criticas.update(newCommentData);
          setEditingComment(null);
        } else {
          // Adding new comment
          await service.criticas.add(newCommentData);
        }
        setNewComment('');
        setRating(0);
        fetchComments(videoId); // Refresh comments
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditComment = (comment) => {
    setNewComment(comment.comentario);
    setRating(comment.pontuacao);
    setEditingComment(comment);
  };

  const handleDeleteComment = async (commentId, videoId) => {
    try {
      await service.criticas.excluir(commentId);
      fetchComments(videoId); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleComments = (index, videoId) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
    if (expandedAlbum !== index) {
      fetchComments(videoId);
    }
  };
  const handleClickVideo = (video) => { // Function to handle click
    navigate(`/videoReproducao/${video.codVideo}`);
  };

  return (
    <CCol md={6}>
      <CCard className="mb-4">
        <CCardHeader>Vídeos Recentes</CCardHeader>
        <CCardBody>
          <InfiniteScroll
            dataLength={videos.length}
            next={fetchMoreVideos}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>Você viu tudo!</p>}
          >
            {videos.map((video, index) => (
              <CCard className="video-card mb-3" key={index}>
                <CCardBody>
                  <div className="video-thumbnail">
                    <video style={{ borderRadius: '12px' }} controls width="100%" height="291" controlsList="nodownload" disablePictureInPicture>
                      <source src={`https://localhost:3333/video/downloadVideo/${video.codVideo}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </CCardBody>
                <CCardFooter>
                  <div className="video-details">
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
                    <FaComment style={{ cursor: 'pointer' }} onClick={() => toggleComments(index, video.codVideo)} />
                    <FaEye onClick={() => handleClickVideo(video)} style={{ cursor: 'pointer' }} />
                  </div>
                </CCardFooter>
                {expandedAlbum === index && (
                  <CCardFooter>
                    <div style={{ padding: '0' }}>
                      <h6>{comments[video.codVideo]?.length} Comentários:</h6>
                      {comments[video.codVideo] && comments[video.codVideo].length > 0 ? (
                        comments[video.codVideo].map((comment, commentIndex) => (
                          <div key={commentIndex} className="comment">
                            <div className="comment-header">
                              <CImage width="50" height="50" src={'https://localhost:3333/utilizador/download/' + comment.utilizador.username} alt={comment.nameUtilizador} className="user-photo" />
                              <span className="user-name">{comment.utilizador.username}</span>
                              <StarRating rating={comment.pontuacao} setRating={() => { }} />

                            </div>

                            <CRow>
                              <CCol xl="8"><p className="comment-text">{comment.comentario}</p></CCol>
                              <CCol>
                                {comment.fkUtilizador === user.codUtilizador && (
                                  <CRow>
                                    <CCol xl="7"></CCol>
                                    <CCol xl="2"><CIcon icon={cilPencil} onClick={() => handleEditComment(comment)} style={{ cursor: 'pointer' }} /></CCol>
                                    <CCol xl="2"><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, video.codVideo)} style={{ cursor: 'pointer' }} /></CCol>
                                  </CRow>
                                )

                                }
                              </CCol>



                            </CRow>




                          </div>
                        ))
                      ) : (
                        <p>Sem comentários.</p>
                      )}
                      <CForm>
                        <CInputGroup>
                          <CFormInput
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adicionar um comentário"
                          />
                        </CInputGroup>
                        <StarRating rating={rating} setRating={setRating} />
                        <CButton color="primary" onClick={() => handleAddComment(video.codVideo)}>Comentar</CButton>
                      </CForm>
                    </div>
                  </CCardFooter>
                )}
              </CCard>
            ))}
          </InfiniteScroll>
        </CCardBody>
      </CCard>
    </CCol >
  );
};

const MusicList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [comments, setComments] = useState({});
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: 'Rui Malemba', // Substitua pelo nome do usuário atual
    photo: 'https://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
  });
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [musicas, setMusicas] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    const fetchMusicas = async () => {
      try {
        const response = await service.musica.listarPorPagina(page, 1);
        const sortedMusicas = response.data.sort((a, b) => new Date(b.dataDeRegisto) - new Date(a.dataDeRegisto));
        setMusicas((prevMusicas) => [...prevMusicas, ...sortedMusicas]);
        setHasMore(response.data.length > 0);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMusicas();
  }, [page]);

  const fetchMoreMusicas = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = async (musicaId) => {
    if (newComment.trim()) {
      const newCommentData = {
        fkMusica: musicaId,
        fkUtilizador: user.codUtilizador,
        pontuacao: rating,
        comentario: newComment
      };
      try {
        if (editingComment) {
          const newCommentData = {
            fkMusica: musicaId,
            fkUtilizador: user.codUtilizador,
            pontuacao: rating,
            comentario: newComment,
            codCritica: Number(editingComment.codCritica)
          };
          // Editing existing comment
          await service.criticas.update(newCommentData);
          setEditingComment(null);
        } else {
          // Adding new comment
          await service.criticas.add(newCommentData);
        }
        setNewComment('');
        setRating(0);
        fetchComments(musicaId); // Refresh comments
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditComment = (comment) => {
    setNewComment(comment.comentario);
    setRating(comment.pontuacao);
    setEditingComment(comment);
  };

  const handleDeleteComment = async (commentId, musicaId) => {
    try {
      await service.criticas.excluir(commentId);
      fetchComments(musicaId); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleComments = (index, musicaId) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
    if (expandedAlbum !== index) {
      fetchComments(musicaId);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      musicas.forEach(musica => {
        fetchComments(musica.codMusica);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [musicas]);



  const fetchComments = async (musicaId) => {
    try {
      const response = await service.criticas.listar();
      const musicaComments = response.data.filter(comment => comment.fkMusica === musicaId);
      setComments(prevComments => ({ ...prevComments, [musicaId]: musicaComments }));
    } catch (err) {
      console.error(err);
    }
  };


  const handleClickMusica = (musica) => { // Function to handle click
    navigate(`/musicaReproducao/${musica.codMusica}`);
  };

  return (
    <CCol md={3} >
      <CCard className="mb-4" >
        <CCardHeader>Músicas Recentes</CCardHeader>
        <CCardBody className='pt-1'>
          <InfiniteScroll
            dataLength={musicas.length}
            next={fetchMoreMusicas}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>Você viu tudo!</p>}
          >
            {musicas.map((music, index) => (
              <CCard className="music-card mb-3" key={index}>
                <CCardHeader>
                  <div className="music-details">

                    <h5>{music.tituloMusica}</h5>
                    <p>{music.fkArtista ? music.artista?.nomeArtista : music.grupoMusical?.nomeGrupoMusical}, {new Date(music.dataLancamento).toLocaleDateString()}</p>
                  </div>
                </CCardHeader>
                <CCardBody className='musica-body'>
                  <div className="music-thumbnail">
                    <CCardImage src={`https://localhost:3333/musica/downloadCapa/${music.codMusica}`} alt={music.tituloMusica} width="230" height="180" />
                    {/* Definindo altura e largura */}

                  </div>
                </CCardBody>
                <CCardFooter style={{ textAlign: 'center', paddingBottom: '18px' }}>
                  <div style={{ width: '100%', height: '45px', marginTop: '10px', overflow: 'hidden' }}>
                    <audio controlsList="nodownload" controls style={{ width: '100%', height: '100%' }}>
                      <source src={`https://localhost:3333/musica/downloadMusica/${music.codMusica}`} type="audio/mpeg" />
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
                    <FaEye onClick={() => handleClickMusica(music)} style={{ cursor: 'pointer' }} />
                  </div>
                </CCardFooter>
                {expandedAlbum === index && (
                  <CCardFooter>
                    <div style={{ padding: '0' }}>
                      <h6>{comments[music.codMusica]?.length} Comentários:</h6>
                      {comments[music.codMusica] && comments[music.codMusica].length > 0 ? (
                        comments[music.codMusica].map((comment, commentIndex) => (
                          <div key={commentIndex} className="comment">
                            <div className="comment-header">
                              <CImage width="50" height="50" src={'https://localhost:3333/utilizador/download/' + comment.utilizador.username} alt={comment.nameUtilizador} className="user-photo" />
                              <span className="user-name">{comment.utilizador.username}</span>
                              <StarRating rating={comment.pontuacao} setRating={() => { }} />

                            </div>

                            <CRow>
                              <CCol xl='8'><p className="comment-text">{comment.comentario}</p></CCol>
                              <CCol>
                                {comment.fkUtilizador === user.codUtilizador && (
                                  <CRow>
                                    <CCol xl='2' ><CIcon icon={cilPencil} onClick={() => handleEditComment(comment)} style={{ cursor: 'pointer' }} /></CCol>
                                    <CCol xl='2'><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, music.codMusica)} style={{ cursor: 'pointer' }} /></CCol>
                                  </CRow>
                                )

                                }
                              </CCol>



                            </CRow>




                          </div>
                        ))
                      ) : (
                        <p>Sem comentários.</p>
                      )}
                      <CForm>
                        <CInputGroup>
                          <CFormInput
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adicionar um comentário"
                          />
                        </CInputGroup>
                        <StarRating rating={rating} setRating={setRating} />
                        <CButton color="primary" onClick={() => handleAddComment(music.codMusica)}>Comentar</CButton>
                      </CForm>
                    </div>
                  </CCardFooter>
                )}
              </CCard>
            ))}
          </InfiniteScroll>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const AlbumList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [comments, setComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albuns, setAlbuns] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAlbuns = async () => {
      try {
        const response = await service.album.listarPorPagina(page, 1);
        const sortedAlbuns = response.data.sort((a, b) => new Date(b.dataDeRegistro) - new Date(a.dataDeRegistro));
        setAlbuns((prevAlbuns) => [...prevAlbuns, ...sortedAlbuns]);
        setHasMore(response.data.length > 0);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAlbuns();
  }, [page]);

  const fetchMoreAlbuns = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const user = JSON.parse(localStorage.getItem("loggedUser"));


  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [likedAlbums, setLikedAlbums] = useState([]);

  const toggleLike = (index) => {
    setLikedAlbums((prevLikedAlbums) =>
      prevLikedAlbums.includes(index)
        ? prevLikedAlbums.filter((likedIndex) => likedIndex !== index)
        : [...prevLikedAlbums, index]
    );
  };

  const handleAddComment = async (albumId) => {
    if (newComment.trim()) {
      const newCommentData = {
        fkAlbum: albumId,
        fkUtilizador: user.codUtilizador,
        pontuacao: rating,
        comentario: newComment
      };
      try {
        if (editingComment) {
          const newCommentData = {
            fkAlbum: albumId,
            fkUtilizador: user.codUtilizador,
            pontuacao: rating,
            comentario: newComment,
            codCritica: Number(editingComment.codCritica)
          };
          // Editing existing comment
          await service.criticas.update(newCommentData);
          setEditingComment(null);
        } else {
          // Adding new comment
          await service.criticas.add(newCommentData);
        }
        setNewComment('');
        setRating(0);
        fetchComments(albumId); // Refresh comments
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditComment = (comment) => {
    setNewComment(comment.comentario);
    setRating(comment.pontuacao);
    setEditingComment(comment);
  };

  const handleDeleteComment = async (commentId, albumId) => {
    try {
      await service.criticas.excluir(commentId);
      fetchComments(albumId); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleComments = (index, albumId) => {
    setExpandedAlbum(expandedAlbum === index ? null : index);
    if (expandedAlbum !== index) {
      fetchComments(albumId);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      albuns.forEach(album => {
        fetchComments(album.codAlbum);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [albuns]);



  const fetchComments = async (albumId) => {
    try {
      const response = await service.criticas.listar();
      const albumComments = response.data.filter(comment => comment.fkAlbum === albumId);
      setComments(prevComments => ({ ...prevComments, [albumId]: albumComments }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickAlbum = (album) => { // Function to handle click
    navigate(`/albumReproducao/${album.codAlbum}`);
  };

  return (
    <CCol md={3}>
      <CCard className="mb-4">
        <CCardHeader>Álbuns Recentes</CCardHeader>
        <CCardBody>
          <InfiniteScroll
            dataLength={albuns.length}
            next={fetchMoreAlbuns}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>Você viu tudo!</p>}
          >
            {albuns.map((album, index) => (
              <CCard className="album-card mb-3" key={index}>
                <CCardHeader>
                  <div className="album-details pt-2">
                    <h5>{album.tituloAlbum}</h5>
                    <p>{album.fkArtista ? album.artista?.nomeArtista : album.grupoMusical?.nomeGrupoMusical}, {new Date(album.dataLancamento).toLocaleDateString()}</p>
                  </div>
                </CCardHeader>
                <CCardBody className='album-body'>
                  <div className="album-thumbnail">
                    <CCardImage src={`https://localhost:3333/album/downloadCapa/${album.codAlbum}`} alt={album.tituloAlbum} width="230" height="190" />
                  </div>
                </CCardBody>
                <CCardFooter style={{ textAlign: 'center', padding: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <FaThumbsUp
                      style={{ cursor: 'pointer', color: likedAlbums.includes(index) ? '#6261cc' : 'inherit' }}
                      onClick={() => toggleLike(index)}
                    />

                    <FaComment style={{ cursor: 'pointer' }} onClick={() => toggleComments(index)} />
                    <FaEye onClick={() => handleClickAlbum(album)} style={{ cursor: 'pointer' }} />
                  </div>
                </CCardFooter>
                {expandedAlbum === index && (
                  <CCardFooter>
                    <div style={{ padding: '0' }}>
                      <h6>{comments[album.codAlbum]?.length} Comentários:</h6>
                      {comments[album.codAlbum] && comments[album.codAlbum].length > 0 ? (
                        comments[album.codAlbum].map((comment, commentIndex) => (
                          <div key={commentIndex} className="comment">
                            <div className="comment-header">
                              <CImage width="50" height="50" src={'https://localhost:3333/utilizador/download/' + comment.utilizador.username} alt={comment.nameUtilizador} className="user-photo" />
                              <span className="user-name">{comment.utilizador.username}</span>
                              <StarRating rating={comment.pontuacao} setRating={() => { }} />

                            </div>

                            <CRow>
                              <CCol xl='8'><p className="comment-text">{comment.comentario}</p></CCol>
                              <CCol>
                                {comment.fkUtilizador === user.codUtilizador && (
                                  <CRow>
                                    <CCol xl='2' ><CIcon icon={cilPencil} onClick={() => handleEditComment(comment)} style={{ cursor: 'pointer' }} /></CCol>
                                    <CCol xl='2'><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, album.codAlbum)} style={{ cursor: 'pointer' }} /></CCol>
                                  </CRow>
                                )

                                }
                              </CCol>



                            </CRow>




                          </div>
                        ))
                      ) : (
                        <p>Sem comentários.</p>
                      )}
                      <CForm>
                        <CInputGroup>
                          <CFormInput
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adicionar um comentário"
                          />
                        </CInputGroup>
                        <StarRating rating={rating} setRating={setRating} />
                        <CButton color="primary" onClick={() => handleAddComment(album.codAlbum)}>Comentar</CButton>
                      </CForm>
                    </div>
                  </CCardFooter>
                )}
              </CCard>
            ))}
          </InfiniteScroll>
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
