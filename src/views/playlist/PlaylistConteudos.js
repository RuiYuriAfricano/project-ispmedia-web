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
    CTableHeaderCell,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CImage,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CForm,
    CInputGroup,
    CFormInput,
    CListGroup,
    CListGroupItem,
    CAlert,
    CCardFooter,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCaretLeft, cilCaretRight, cilMediaPause, cilMediaPlay, cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import ReactPlayer from 'react-player';
import { service } from './../../services';
import thumbnail from './img/default-thumbnail.png';
import './PlaylistConteudo.css';
import StarRating from '../starRating/StarRating';
import video2 from './img/animacaoDeAudio.mp4'
import { isNullOrUndef } from 'chart.js/helpers';
import { bottom, left } from '@popperjs/core';

const PlaylistConteudo = () => {

    if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
        return <Navigate to="/login"></Navigate>;
    }

    const { playlistId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedUrlCapa, setSelectedUrlCapa] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedTitulo, setSelectedTitulo] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal, setModal] = useState(false);
    const [palavraChave, setPalavraChave] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [msgDoAlert, setMsgDoAlert] = useState('');
    const [corDoAlert, setCorDoAlert] = useState('');
    const [nomePlayList, setNomePlayList] = useState(null);
    const [isRandom, setIsRandom] = useState(false);
    const [showControls, setShowControls] = useState(false);


    const user = JSON.parse(localStorage.getItem("loggedUser"));

    const [cart, setCart] = useState([]);
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
    const loadVideoDuration = (videoId) => {
        const videoElement = document.createElement('video');
        videoElement.src = `https://localhost:3333/video/downloadVideo/${videoId}`;
        videoElement.addEventListener('loadedmetadata', () => {
            setMusicaDurations((prevDurations) => ({
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
    const [comments, setComments] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Rui Malemba', // Substitua pelo nome do usuário atual
        photo: 'https://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
    });
    const [playing, setPlaying] = useState(true);
    const player1Ref = useRef(null);
    const player2Ref = useRef(null);

    const handlePause = () => {
        setPlaying(false);
    };

    const handlePlay = () => {
        setPlaying(true);
    };
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await service.playlist.getVideosEMusicasDaPlaylist(playlistId);

                setVideos(response.data.success ? response.data.data : []);
                if (response.data.data.length > 0) {
                    if (response.data.data[0].tipo === 'video') {
                        setSelectedVideo(`https://localhost:3333/video/downloadVideo/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(`https://localhost:3333/video/${response.data.data[0].codigo}/thumbnail`);
                    } else if (response.data.data[0].tipo === 'musica') {
                        setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${response.data.data[0].codigo}`);
                    }
                    setSelectedTipo(response.data.data[0].tipo);
                    setSelectedTitulo(response.data.data[0].titulo);
                    setSelectedItem(response.data.data[0])
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };


        const fetchNomePlaylist = async () => {
            try {
                const response = await service.playlist.pesquisaporid(playlistId);
                setNomePlayList(response.data.nomePlayList);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchNomePlaylist();
        fetchVideos();
    }, [playlistId]);

    useEffect(() => {
        const interval = setInterval(() => {
            videos.forEach(video => {
                fetchComments(video.codigo);
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [videos]);

    const fetchComments = async (videoId) => {
        try {
            const response = await service.criticas.listar();
            const videoComments = response.data.filter(comment => comment.fkVideo === videoId || comment.fkMusica === videoId || comment.fkAlbum === videoId);
            setComments(prevComments => ({ ...prevComments, [videoId]: videoComments }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (videoId) => {
        if (newComment.trim()) {
            const newCommentData = {
                fkVideo: selectedTipo === 'video' ? videoId : null,
                fkMusica: selectedTipo === 'musica' ? videoId : null,
                fkAlbum: selectedTipo === 'album' ? videoId : null,
                fkUtilizador: user.codUtilizador,
                pontuacao: rating,
                comentario: newComment
            };
            try {
                if (editingComment) {
                    const newCommentData = {
                        fkVideo: selectedTipo === 'video' ? videoId : null,
                        fkMusica: selectedTipo === 'musica' ? videoId : null,
                        fkAlbum: selectedTipo === 'album' ? videoId : null,
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

    const handleSearch = async () => {
        // Verificar se todos os campos obrigatórios estão preenchidos
        const emptyFields = isAllFieldsFilled();

        if (emptyFields.length > 0) {
            const emptyFieldsMessage = emptyFields.join(', ');
            setMsgDoAlert(`${emptyFieldsMessage}.`);
            setCorDoAlert('danger');
            return;
        }
        setMsgDoAlert('')
        setCorDoAlert('')
        // Simulate a search request to get videos
        const response = await service.playlist.pesquisarMusicasEVideosPorTitulo(palavraChave);
        setSearchResults(response.data.success ? response.data.data : []);

    };

    const handleAddToCart = (video) => {
        const videoInCart = cart.find(item => item.codigo === video.codigo && item.tipo === video.tipo);
        if (!videoInCart) {
            setCart([...cart, { fkPlayList: playlistId, codigo: video.codigo, tipo: video.tipo }]);
        }
    };

    const handleAddToPlaylist = async () => {
        try {
            // Add videos in the cart to the playlist
            await Promise.all(cart.map(item => {
                if (item.tipo === 'video') {
                    return (
                        service.videosDaPlaylist.add({
                            "fkPlayList": Number(item.fkPlayList),
                            "fkVideo": Number(item.codigo)
                        })
                    )
                }
                if (item.tipo === 'musica') {
                    return (
                        service.musicasDaPlaylist.add({
                            "fkPlayList": Number(item.fkPlayList),
                            "fkMusica": Number(item.codigo)
                        })
                    )
                }
            }));
            setModal(false);
            setCart([]);
            // Refresh the video list
            const response = await service.playlist.getVideosEMusicasDaPlaylist(playlistId);
            setVideos(response.data.data);
        } catch (err) {
            console.error("Failed to add videos to the playlist:", err);
        }
    };

    const handleMouseEnter = () => {
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        setShowControls(false);
    };
    const handlePlayNext = () => {
        let nextVideo;
        if (isRandom) {
            // Selecionar aleatoriamente um vídeo diferente do atual
            do {
                nextVideo = videos[Math.floor(Math.random() * videos.length)];
            } while (nextVideo.codigo === selectedItem.codigo && nextVideo.tipo === selectedItem.tipo);
        } else {
            // Selecionar o próximo vídeo na lista sequencialmente
            const currentIndex = videos.findIndex(v => v.codigo === selectedItem.codigo && v.tipo === selectedItem.tipo);
            const nextIndex = (currentIndex + 1) % videos.length;
            nextVideo = videos[nextIndex];
        }

        if (nextVideo.tipo === 'video') {
            setSelectedVideo(`https://localhost:3333/video/downloadVideo/${nextVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/video/${nextVideo.codigo}/thumbnail`);
        } else {
            setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${nextVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${nextVideo.codigo}`);
            setPlaying(true)
        }
        setSelectedTipo(nextVideo.tipo);
        setSelectedTitulo(nextVideo.titulo);
        setSelectedItem(nextVideo);
    };

    const handleNext = () => {
        const currentIndex = videos.findIndex(v => v.codigo === selectedItem.codigo && v.tipo === selectedItem.tipo);
        const nextIndex = (currentIndex + 1) % videos.length;
        const nextVideo = videos[nextIndex];

        if (nextVideo.tipo === 'video') {
            setSelectedVideo(`https://localhost:3333/video/downloadVideo/${nextVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/video/${nextVideo.codigo}/thumbnail`);
        } else {
            setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${nextVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${nextVideo.codigo}`);
        }
        setSelectedTipo(nextVideo.tipo);
        setSelectedTitulo(nextVideo.titulo);
        setSelectedItem(nextVideo);
    };

    const handlePrevious = () => {
        const currentIndex = videos.findIndex(v => v.codigo === selectedItem.codigo && v.tipo === selectedItem.tipo);
        const previousIndex = (currentIndex - 1 + videos.length) % videos.length;
        const previousVideo = videos[previousIndex];

        if (previousVideo.tipo === 'video') {
            setSelectedVideo(`https://localhost:3333/video/downloadVideo/${previousVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/video/${previousVideo.codigo}/thumbnail`);
        } else {
            setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${previousVideo.codigo}`);
            setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${previousVideo.codigo}`);
        }
        setSelectedTipo(previousVideo.tipo);
        setSelectedTitulo(previousVideo.titulo);
        setSelectedItem(previousVideo);
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const isAllFieldsFilled = () => {
        const emptyFields = [];

        if (palavraChave.trim() === '') {
            emptyFields.push('Deve escrever algum titulo!');
        }

        return emptyFields;
    };

    const handleRemoveFromPlaylist = async (conteudo) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir o conteudo desta PlayList?");
        if (confirmDelete) {
            try {
                if (conteudo.tipo === 'video') {
                    await service.videosDaPlaylist.excluir(conteudo.codigoConteudoDaPlayList);
                }
                else {
                    await service.musicasDaPlaylist.excluir(conteudo.codigoConteudoDaPlayList);
                }

                setVideos(videos.filter(video => !(video.codigo === conteudo.codigo && video.tipo === conteudo.tipo)));
            } catch (err) {
                console.error('Erro ao excluir conteudo da playList:', err);
            }
        }
    };

    return (
        <CRow>
            <CCol md={8}>
                <CCard className="mb-4">
                    <CCardBody className="player-container">
                        {
                            selectedTipo === 'musica' ? (
                                <><ReactPlayer
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

                                </>

                            ) : (
                                <div className="no-video"></div>
                            )
                        }
                        {
                            selectedTipo === 'musica' && selectedUrlCapa ? (
                                <><CImage
                                    src={selectedUrlCapa}
                                    width="100%"
                                    alt={selectedUrlCapa}
                                    height="85%"
                                    style={{ width: "180px", height: '120px', position: 'absolute', padding: '15px', borderRadius: '20px', top: '60%', left: '0', zIndex: '1' }}
                                />
                                    <div className="video-controls" style={{ paddingBottom: '10px', borderRadius: '30px', width: '100px', height: '50px', backgroundColor: '#444', position: 'absolute', top: '186px', left: '656px', zIndex: '1', textAlign: 'center', marginTop: '200px' }}>

                                        <CButton onClick={handlePrevious} className='control-icone2'><CIcon icon={cilCaretLeft} /></CButton>

                                        <CButton onClick={handlePlayNext} className='control-icone2'><CIcon icon={cilCaretRight} /></CButton>

                                    </div>
                                </>

                            ) : (
                                <div className="no-video"></div>
                            )
                        }

                        {
                            selectedVideo && selectedTipo === 'video' ? (
                                <><ReactPlayer
                                    url={selectedVideo}
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                    playing={playing}
                                    onEnded={handlePlayNext}
                                    onMouseOver={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload'
                                            }
                                        }
                                    }}

                                />
                                    <div className="video-controls" style={{ textAlign: 'center', marginTop: '200px', display: showControls ? 'block' : 'none' }}>
                                        <CButton onClick={handlePrevious} className='control-icone'><CIcon icon={cilCaretLeft} /></CButton>
                                        <CButton onClick={playing ? handlePause : handlePlay} className='control-icone'><CIcon icon={playing ? cilMediaPause : cilMediaPlay} /></CButton>
                                        <CButton onClick={handlePlayNext} className='control-icone'><CIcon icon={cilCaretRight} /></CButton>

                                    </div>
                                </>

                            ) :
                                selectedVideo && selectedTipo === 'musica' ? (
                                    <><ReactPlayer
                                        ref={player2Ref}
                                        className="react-player"
                                        url={selectedVideo}
                                        controls={true}
                                        width="84%"
                                        height="98%"
                                        playing={playing}
                                        onPlay={handlePlay}
                                        onPause={handlePause}
                                        onEnded={handlePlayNext}
                                        style={{ marginLeft: '6px' }}
                                        config={{
                                            file: {
                                                attributes: {
                                                    controlsList: 'nodownload'
                                                }
                                            }
                                        }}

                                    />



                                    </>


                                ) :
                                    (
                                        <div className="no-video">Adicione videos e ou músicas à sua playList</div>
                                    )}

                    </CCardBody>
                    <CCardFooter>
                        <h5>{selectedTitulo}</h5>
                        {videos.length > 0 && (<div style={{ padding: '0' }}>
                            <h6>{comments[selectedItem.codigo]?.length} Comentários:</h6>
                            {comments[selectedItem.codigo] && comments[selectedItem.codigo].length > 0 ? (
                                comments[selectedItem.codigo].map((comment, commentIndex) => (
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
                                                        <CCol xl="2"><CIcon icon={cilTrash} onClick={() => handleDeleteComment(comment.codCritica, selectedItem.codigo)} style={{ cursor: 'pointer' }} /></CCol>
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
                                <CButton color="primary" onClick={() => handleAddComment(selectedItem.codigo)}>Comentar</CButton>
                            </CForm>
                        </div>)}

                    </CCardFooter>
                </CCard>
            </CCol>
            <CCol md={4}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol>
                                <strong>{nomePlayList}</strong>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={isRandom}
                                        onChange={() => setIsRandom(!isRandom)}
                                    />
                                    <label style={{ marginLeft: '8px' }}>Aleatória</label>
                                </div>
                            </CCol>
                            <CCol style={{ textAlign: 'right' }}>
                                <CButton color="primary" onClick={() => setModal(true)}>
                                    <CIcon icon={cilPlus} /> Adicionar
                                </CButton>
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
                                            active={selectedItem?.codigo === video.codigo && selectedItem?.tipo === video.tipo}
                                            key={video.codigo + "" + video.tipo}>
                                            <CTableDataCell>
                                                <div className="thumbnail-wrapper">
                                                    <CImage
                                                        className="thumbnail"
                                                        src={video.tipo === 'video' ? `https://localhost:3333/video/${video.codigo}/thumbnail` : `https://localhost:3333/musica/downloadCapa/${video.codigo}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                        alt={video.nome}
                                                        style={{ width: "160px", height: '100px', borderRadius: "5px" }}
                                                        onLoad={video.tipo === 'video' ? () => loadVideoDuration(video.codigo) : () => loadMusicaDuration(video.codigo)}
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {
                                                            if (video.tipo === "video") {
                                                                setSelectedVideo(`https://localhost:3333/video/downloadVideo/${video.codigo}`);
                                                                setSelectedUrlCapa(`https://localhost:3333/video/${video.codigo}/thumbnail`);
                                                            }
                                                            else {
                                                                setSelectedVideo(`https://localhost:3333/musica/downloadMusica/${video.codigo}`);
                                                                setSelectedUrlCapa(`https://localhost:3333/musica/downloadCapa/${video.codigo}`);
                                                            }
                                                            setSelectedTitulo(video.titulo)
                                                            setSelectedTipo(video.tipo);
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
                                                    <div className="musica-duration">{musicaDurations[video.codigo]}</div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>{video.titulo}</h6>
                                                        <p style={{ color: '#999', fontSize: '14px' }}>{video.autor}</p>
                                                    </div>
                                                    <CDropdown className="ml-2">
                                                        <CDropdownToggle className="vertical-dots" caret={false}>
                                                            &#x2022;<br />&#x2022;<br />&#x2022;
                                                        </CDropdownToggle>
                                                        <CDropdownMenu className="dropdown-menu-right">
                                                            <CDropdownItem className="dropdown-item" onClick={() => alert('Ver detalhes')}>Ver detalhes</CDropdownItem>
                                                            <CDropdownItem className="dropdown-item" onClick={() => handleRemoveFromPlaylist(video)}>Remover da playlist</CDropdownItem>
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
            <CModal visible={modal} onClose={() => {
                setSearchResults([]);
                setCart([]);
                setModal(false);
            }} size="lg">
                <CModalHeader closeButton>
                    <h3>Adicionar Mídia à Playlist</h3>
                </CModalHeader>
                <CModalBody>
                    {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
                    <CForm>
                        <CInputGroup>
                            <CFormInput onChange={(e) => setPalavraChave(e.target.value)} id="search" name="search" placeholder="Digite o nome da midia..." />
                        </CInputGroup>
                        <br />
                        <CButton type="button" color="primary" onClick={() => handleSearch()}>Pesquisar</CButton>
                    </CForm>
                    <CListGroup className="mt-3">
                        {searchResults.map((video) => {
                            const search = cart.find(v => v.codigo === video.codigo && v.tipo === video.tipo);
                            const search2 = videos.find(v => v.codigo === video.codigo && v.tipo === video.tipo);
                            if (!search && !search2) {
                                return (
                                    <CListGroupItem key={video.codigo + '' + video.tipo}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            {video.tipo + ": " + video.titulo}
                                            <CButton color="success" onClick={() => handleAddToCart(video)}>Adicionar</CButton>
                                        </div>
                                    </CListGroupItem>
                                )
                            }
                        })}
                    </CListGroup>
                    <h5 className="mt-4">Conteúdos selecionados</h5>
                    <CListGroup>
                        {cart.map((item) => {
                            const video = searchResults.find(v => v.codigo === item.codigo && v.tipo === item.tipo);
                            return (
                                <CListGroupItem key={item.codigo + "" + video.tipo}>
                                    {video?.titulo}
                                </CListGroupItem>
                            );
                        })}
                    </CListGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleAddToPlaylist}>Adicionar à Playlist</CButton>
                    <CButton color="secondary" onClick={() => setModal(false)}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </CRow >
    );
};

export default PlaylistConteudo;
