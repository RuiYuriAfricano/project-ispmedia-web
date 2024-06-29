import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import './PlaylistPublicaMusica.css';
import StarRating from '../starRating/StarRating';
import video2 from './img/animacaoDeAudio.mp4'
import { isNumber } from 'chart.js/helpers';

const PlaylistPublicaMusica = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTitulo, setSelectedTitulo] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    const [comments, setComments] = useState({});
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
    const [editingComment, setEditingComment] = useState(null);
    const handlePause = () => {
        setPlaying(false);
    };

    const handlePlay = () => {
        setPlaying(true);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseID = await service.musica.pesquisaporid(id);
                const response = await service.musica.listar();
                setVideos(response.data.length > 0 ? response.data.filter(item => item.visibilidade === 'Publico') : []);
                if (response.data.length > 0) {
                    setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${id}`);
                    setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${id}`);
                    setSelectedTitulo(responseID.data.tituloMusica);
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


    useEffect(() => {
        const interval = setInterval(() => {
            videos.forEach(musica => {
                fetchComments(musica.codMusica);
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [videos]);

    const fetchComments = async (musicaId) => {
        try {
            const response = await service.criticas.listar();
            const musicaComments = response.data.filter(comment => comment.fkMusica === musicaId);
            setComments(prevComments => ({ ...prevComments, [musicaId]: musicaComments }));
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
                            <h6>{comments[selectedItem.codMusica]?.length} Comentários:</h6>
                            {comments[selectedItem.codMusica] && comments[selectedItem.codMusica].length > 0 ? (
                                comments[selectedItem.codMusica].map((comment, commentIndex) => (
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
                                                        <CCol xl='2'><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, selectedItem.codMusica)} style={{ cursor: 'pointer' }} /></CCol>
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
                                <CButton color="primary" onClick={() => handleAddComment(selectedItem.codMusica)}>Comentar</CButton>
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
                                <strong>Lista das músicas</strong>
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
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                            setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${video.codMusica}`);
                                                            setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${video.codMusica}`);
                                                            setSelectedTitulo(video.tituloMusica)
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
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

export default PlaylistPublicaMusica;
