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
import { cilMediaPlay, cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import ReactPlayer from 'react-player';
import { service } from '../../services';
import './PlaylistPublicaAlbum.css';
import StarRating from '../starRating/StarRating';
import video2 from './img/animacaoDeAudio.mp4'
import { isNullOrUndef, isNumber } from 'chart.js/helpers';

const PlaylistPublicaAlbum = () => {

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
    const [album, setAlbum] = useState(null)
    const [comments, setComments] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Rui Malemba', // Substitua pelo nome do usuário atual
        photo: 'https://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual

    });
    const [selectedUrlCapa, setSelectedUrlCapa] = useState(null);
    const [playing, setPlaying] = useState(true);
    const player1Ref = useRef(null);
    const player2Ref = useRef(null);
    const [tituloAlbum, setTituloAlbum] = useState("");

    const [musicaDurations, setMusicaDurations] = useState({});
    const loadMusicaDuration = (musicaId) => {
        const audioElement = document.createElement('audio');
        audioElement.src = `https://localhost:3333/musica/downloadMusica/${musicaId}`;
        audioElement.addEventListener('loadedmetadata', () => {
            setMusicaDurations((prevDurations) => ({
                ...prevDurations,
                [musicaId]: formatDuration(audioElement.duration),
            }));
        });
    };
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    const handlePause = () => {
        setPlaying(false);
    };

    const handlePlay = () => {
        setPlaying(true);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseAlbum = await service.album.pesquisaporid(id)
                setAlbum(responseAlbum.data)
                setTituloAlbum(responseAlbum.data.tituloAlbum)
                const response = await service.musica.listar();
                const filtro = response.data.filter(item => item.visibilidade === 'Publico' && item.fkAlbum === parseInt(id))
                setVideos(response.data.length > 0 ? filtro : []);

                if (filtro.length > 0) {
                    setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${filtro[0].codMusica}`);
                    setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${filtro[0].codMusica}`);
                    setSelectedTitulo(filtro[0].tituloMusica);
                    setSelectedItem(filtro[0])
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchVideos();
        fetchComments();
    }, [id]);



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
            fetchComments(album.codAlbum);
        }, 2000);

        return () => clearInterval(interval);
    }, [album]);



    const fetchComments = async (albumId) => {
        try {
            const response = await service.criticas.listar();
            const albumComments = response.data.filter(comment => comment.fkAlbum === albumId);
            setComments(prevComments => ({ ...prevComments, [albumId]: albumComments }));
        } catch (err) {
            console.error(err);
        }
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <CRow>
            <CCol md={8}>
                <CCard className="mb-4">
                    <CCardBody className="player-container">

                        <ReactPlayer
                            ref={player1Ref}
                            url={video2}
                            controls={false}
                            width="100%"
                            height="100%"
                            playing={playing}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            loop
                            config={{
                                file: {
                                    attributes: {
                                        controlsList: 'nodownload'
                                    }
                                }
                            }}

                        />
                        <CImage
                            src={selectedUrlCapa}
                            width="100%"
                            alt={selectedUrlCapa}
                            height="85%"
                            style={{ width: "180px", height: '120px', position: 'absolute', padding: '15px', borderRadius: '20px', top: '60%', left: '0', zIndex: '1' }}
                        />
                        {
                            selectedVideo ? (
                                <ReactPlayer
                                    ref={player2Ref}
                                    url={selectedVideo}
                                    controls={true}
                                    width="98%"
                                    height="98%"
                                    playing={playing}
                                    onPlay={handlePlay}
                                    onPause={handlePause}
                                    style={{ marginLeft: '6px' }}
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
                                    <div className="no-video">Nenhum Musica selecionada</div>
                                )}

                    </CCardBody>
                    <CCardFooter>
                        <h5>{selectedTitulo}</h5>
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
                </CCard>
            </CCol>
            <CCol md={4}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol>
                                <strong>Músicas do Album "{tituloAlbum}"</strong>
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
                                            active={selectedItem?.codMusica === video.codMusica}
                                            key={video.codMusica}>
                                            <CTableDataCell>
                                                <div className="thumbnail-wrapper">
                                                    <CImage
                                                        className="thumbnail"
                                                        src={`https://localhost:3333/musica/downloadCapa/${video.codMusica}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                        alt={video.tituloMusica}
                                                        style={{ width: "160px", height: '100px', borderRadius: "5px" }}
                                                        onLoad={() => loadMusicaDuration(video.codMusica)}
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                            setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${video.codMusica}`);
                                                            setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${video.codMusica}`);
                                                            setSelectedTitulo(video.tituloMusica)
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
                                                    <div className="musica-duration">{musicaDurations[video.codMusica]}</div> {/* Adicione esta linha */}
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>{video.tituloMusica}</h6>
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

export default PlaylistPublicaAlbum;
