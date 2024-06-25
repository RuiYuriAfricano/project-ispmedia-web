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
import { cilMediaPlay, cilPlus } from '@coreui/icons';
import ReactPlayer from 'react-player';
import { service } from './../../services';
import thumbnail from './img/default-thumbnail.png';
import './PlaylistConteudo.css';
import StarRating from '../starRating/StarRating';
import video2 from './img/animacaoDeAudio.mp4'

const PlaylistConteudo = () => {
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

    const user = JSON.parse(localStorage.getItem("loggedUser"));

    const [cart, setCart] = useState([]);

    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Rui Malemba', // Substitua pelo nome do usuário atual
        photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
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
                        setSelectedVideo(`http://localhost:3333/video/downloadVideo/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(`http://localhost:3333/video/${response.data.data[0].codigo}/thumbnail`);
                    } else if (response.data.data[0].tipo === 'musica') {
                        setSelectedVideo(`http://localhost:3333/musica/downloadMusica/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${response.data.data[0].codigo}`);
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
                            ) : (
                                <div className="no-video"></div>
                            )
                        }
                        {
                            selectedTipo === 'musica' && selectedUrlCapa ? (
                                <CImage
                                    src={selectedUrlCapa}
                                    width="100%"
                                    alt={selectedUrlCapa}
                                    height="85%"
                                    style={{ width: "180px", height: '120px', position: 'absolute', padding: '15px', borderRadius: '20px', top: '60%', left: '0', zIndex: '1' }}
                                />
                            ) : (
                                <div className="no-video"></div>
                            )
                        }

                        {
                            selectedVideo && selectedTipo === 'video' ? (
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
                                selectedVideo && selectedTipo === 'musica' ? (
                                    <ReactPlayer
                                        ref={player2Ref}
                                        className="react-player"
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
                                        <div className="no-video">Adicione videos e ou músicas à sua playList</div>
                                    )}

                    </CCardBody>
                    <CCardFooter>
                        <h5>{selectedTitulo}</h5>
                        <div>
                            <h6>Comentários:</h6>
                            {comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <div className="comment-header">
                                        <CImage src={comment.user.photo} alt={comment.user.name} className="user-photo" />
                                        <span className="user-name">{comment.user.name}</span>
                                        <StarRating rating={comment.rating} setRating={() => { }} />
                                    </div>
                                    <p>{comment.text}</p>
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
                </CCard>
            </CCol>
            <CCol md={4}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <CRow>
                            <CCol>
                                <strong>{nomePlayList}</strong>
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
                                                        src={video.tipo === 'video' ? `http://localhost:3333/video/${video.codigo}/thumbnail` : `http://localhost:3333/musica/downloadCapa/${video.codigo}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                        alt={video.nome}
                                                        style={{ width: "180px", height: '120px', borderRadius: "5px" }}
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {
                                                            if (video.tipo === "video") {
                                                                setSelectedVideo(`http://localhost:3333/video/downloadVideo/${video.codigo}`);
                                                                setSelectedUrlCapa(`http://localhost:3333/video/${video.codigo}/thumbnail`);
                                                            }
                                                            else {
                                                                setSelectedVideo(`http://localhost:3333/musica/downloadMusica/${video.codigo}`);
                                                                setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${video.codigo}`);
                                                            }
                                                            setSelectedTitulo(video.titulo)
                                                            setSelectedTipo(video.tipo);
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>{video.titulo}</h6>
                                                        {video.autor}
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
        </CRow>
    );
};

export default PlaylistConteudo;
