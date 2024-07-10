import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CImage,
    CButton,
    CForm,
    CInputGroup,
    CFormInput,
    CCardFooter,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMediaPlay, cilPencil, cilTrash } from '@coreui/icons';
import ReactPlayer from 'react-player';
import { service } from '../../services';
import './PlaylistPublicaVideo.css';
import StarRating from '../starRating/StarRating';
import { isNullOrUndef, isNumber } from 'chart.js/helpers';

const PlaylistPublicaVideo = () => {

    if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
        return <Navigate to="/login"></Navigate>;
    }

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTitulo, setSelectedTitulo] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    const [editingComment, setEditingComment] = useState(null);
    const [comments, setComments] = useState({});
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Rui Malemba', // Substitua pelo nome do usuário atual
        photo: 'https://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
    });
    const [videoDurations, setVideoDurations] = useState({});
    const loadVideoDuration = (videoId) => {
        const videoElement = document.createElement('video');
        videoElement.src = `https://localhost:3333/video/downloadVideo/${videoId}`;
        videoElement.addEventListener('loadedmetadata', () => {
            setVideoDurations((prevDurations) => ({
                ...prevDurations,
                [videoId]: formatDuration(videoElement.duration),
            }));
        });
    };
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseID = await service.video.pesquisaporid(id);
                const response = await service.video.listar();
                setVideos(response.data.length > 0 ? response.data.filter(item => item.visibilidade === 'Publico') : []);
                if (response.data.length > 0) {
                    setSelectedVideo(`https://localhost:3333/video/downloadVideo/${id}`);

                    setSelectedTitulo(responseID.data.tituloVideo);
                    setSelectedItem(responseID.data)
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchVideos();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            videos.forEach(video => {
                fetchComments(video.codVideo);
            });
        }, 2000);

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


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <CRow>
            <CCol md={8}>
                <CCard className="mb-4">
                    <CCardBody className="player-container">

                        {
                            selectedVideo ? (
                                <ReactPlayer
                                    url={selectedVideo}
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                    playing={true}
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload'
                                            }
                                        }
                                    }}

                                />
                            ) :
                                (
                                    <div className="no-video">Nenhum video selecionado</div>
                                )
                        }

                    </CCardBody>
                    <CCardFooter>
                        <h5>{selectedTitulo}</h5>
                        <div style={{ padding: '0' }}>
                            <h6>{comments[selectedItem.codVideo]?.length} Comentários:</h6>
                            {comments[selectedItem.codVideo] && comments[selectedItem.codVideo].length > 0 ? (
                                comments[selectedItem.codVideo].map((comment, commentIndex) => (
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
                                                        <CCol xl="2"><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, selectedItem.codVideo)} style={{ cursor: 'pointer' }} /></CCol>
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
                                <CButton color="primary" onClick={() => handleAddComment(selectedItem.codVideo)}>Comentar</CButton>
                            </CForm>
                        </div>
                    </CCardFooter>
                </CCard>
            </CCol>
            <CCol md={4}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol>
                                <strong>Lista dos vídeos</strong>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <div className="scrollable-table">
                            <CTable hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        {/* Add your table headers here */}
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {videos.map((video) => (
                                        <CTableRow
                                            active={selectedItem?.codVideo === video.codVideo}
                                            key={video.codVideo}>
                                            <CTableDataCell>
                                                <div className="thumbnail-wrapper">
                                                    <CImage
                                                        className="thumbnail"
                                                        src={`https://localhost:3333/video/${video.codVideo}/thumbnail`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                        alt={video.tituloVideo}
                                                        onLoad={() => loadVideoDuration(video.codVideo)}
                                                        style={{ width: "160px", height: '100px', borderRadius: "5px" }}
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                            setSelectedVideo(`https://localhost:3333/video/downloadVideo/${video.codVideo}`);

                                                            setSelectedTitulo(video.tituloVideo)
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
                                                    <div className="video-duration">{videoDurations[video.codVideo]}</div> {/* Adicione esta linha */}
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>{video.tituloVideo}</h6>
                                                        <p style={{ color: '#999', fontSize: '14px' }}>{isNumber(video.fkArtista) ? video.artista.nomeArtista : video.grupoMusical.nomeGrupoMusical}</p>
                                                    </div>
                                                    <CDropdown className="ml-2">
                                                        <CDropdownToggle className="vertical-dots" caret={true}>
                                                            &#x2022;<br />&#x2022;<br />&#x2022;
                                                        </CDropdownToggle>
                                                        <CDropdownMenu className="dropdown-menu-right">
                                                            <CDropdownItem className="dropdown-item" onClick={() => alert('Ver detalhes')}>Ver detalhes</CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>


                            </CTable>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default PlaylistPublicaVideo;
