import React, { useEffect, useState } from 'react';
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
import './GrupoConteudo.css';
import { Player, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css'; // Importa os estilos padrões do player
import StarRating from './StarRating';

const PlaylistConteudo = () => {
    const { grupoId } = useParams();
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
    const [nomeGrupo, setNomeGrupo] = useState(null);

    const user = JSON.parse(localStorage.getItem("loggedUser"));
    const [cart, setCart] = useState([]);

    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Nome do Usuário', // Substitua pelo nome do usuário atual
        photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
    });


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await service.grupoDeAmigos.getVideosMusicasEAlbunsDoGrupo(grupoId);

                setVideos(response.data.success ? response.data.data : []);
                if (response.data.data.length > 0) {
                    if (response.data.data[0].tipo === 'video') {
                        setSelectedVideo(`http://localhost:3333/video/downloadVideo/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(null);
                        setSelectedTitulo(response.data.data[0].titulo);
                        setSelectedItem(response.data.data[0])
                    } else if (response.data.data[0].tipo === 'musica') {
                        setSelectedVideo(`http://localhost:3333/musica/downloadMusica/${response.data.data[0].codigo}`);
                        setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${response.data.data[0].codigo}`);
                        setSelectedTitulo(response.data.data[0].titulo);
                        setSelectedItem(response.data.data[0])
                    }
                    else if (response.data.data[0].tipo === 'album') {
                        if (response.data.data[0].musicasDoAlbum.length === 0) {
                            setSelectedVideo('');
                            setSelectedUrlCapa(`http://localhost:3333/album/downloadCapa/${response.data.data[0].codigo}`);
                            setSelectedTitulo(response.data.data[0].titulo);
                        } else {
                            setSelectedVideo(`http://localhost:3333/musica/downloadMusica/${response.data.data[0].musicasDoAlbum[0].codMusica}`);
                            setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${response.data.data[0].musicasDoAlbum[0].codMusica}`);
                            setSelectedTitulo(response.data.data[0].musicasDoAlbum[0].tituloMusica);
                        }

                        setSelectedItem(response.data.data[0].musicasDoAlbum[0])
                    }
                    setSelectedTipo(response.data.data[0].tipo);

                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        const fetchNomeGrupoDeAmigos = async () => {
            try {
                const response = await service.grupoDeAmigos.pesquisaporid(grupoId);
                setNomeGrupo(response.data.nomeDoGrupo);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchNomeGrupoDeAmigos();
        fetchVideos();
    }, [grupoId]);

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
        const response = await service.grupoDeAmigos.pesquisarVideosMusicasEAlbunsDoGrupoPorTitulo(palavraChave);
        setSearchResults(response.data.success ? response.data.data : []);

    };

    const handleAddToCart = (video) => {
        const videoInCart = cart.find(item => item.codigo === video.codigo && item.tipo === video.tipo);
        if (!videoInCart) {
            setCart([...cart, { fkGrupoDeAmigos: grupoId, codigo: video.codigo, tipo: video.tipo }]);
        }
    };

    const handleAddToPlaylist = async () => {
        try {
            // Add videos in the cart to the playlist
            await Promise.all(cart.map(item => {
                if (item.tipo === 'video') {
                    return (
                        service.conteudoDosGrupos.add({
                            "fkGrupoDeAmigos": Number(item.fkGrupoDeAmigos),
                            "fkVideo": Number(item.codigo)
                        })
                    )
                }
                if (item.tipo === 'musica') {
                    return (
                        service.conteudoDosGrupos.add({
                            "fkGrupoDeAmigos": Number(item.fkGrupoDeAmigos),
                            "fkMusica": Number(item.codigo)
                        })
                    )
                }

                if (item.tipo === 'album') {
                    return (
                        service.conteudoDosGrupos.add({
                            "fkGrupoDeAmigos": Number(item.fkGrupoDeAmigos),
                            "fkAlbum": Number(item.codigo)
                        })
                    )
                }
            }));
            setModal(false);
            setCart([]);
            // Refresh the video list
            const response = await service.grupoDeAmigos.getVideosMusicasEAlbunsDoGrupo(grupoId);
            setVideos(response.data.data);
        } catch (err) {
            console.error("Failed to add videos to the grupo de amigos:", err);
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
        const confirmDelete = window.confirm("Tem certeza que deseja excluir o conteudo deste Grupo?");
        if (confirmDelete) {
            try {

                await service.conteudoDosGrupos.excluir(conteudo.codigoConteudo);

                setVideos(videos.filter(video => !(video.codigo === conteudo.codigo && video.tipo === conteudo.tipo)));
            } catch (err) {
                console.error('Erro ao excluir conteudo do grupo:', err);
            }
        }
    };

    return (
        <CRow>
            <CCol md={8}>
                <CCard className="mb-4">
                    <CCardBody className="player-container">
                        {
                            selectedTipo !== 'video' && selectedUrlCapa ? (
                                <CImage
                                    src={selectedUrlCapa}
                                    width="100%"
                                    alt={selectedUrlCapa}
                                    height="85%"
                                    style={{ position: 'absolute', padding: '15px', borderRadius: '20px', top: '0', left: '0', zIndex: '1' }}
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
                                selectedVideo && selectedTipo !== 'video' ? (
                                    <ReactPlayer
                                        className="react-player"
                                        url={selectedVideo}
                                        controls={true}
                                        width="98%"
                                        height="98%"
                                        playing={true}
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
                                        <div className="no-video">Adicione videos, músicas e ou albuns ao grupo</div>
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
                                <strong>{nomeGrupo}</strong>
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
                                    {videos.map((video) => {

                                        if (video.tipo === 'album' && video.musicasDoAlbum.length > 0) {
                                            return (
                                                video.musicasDoAlbum.map((musica) => {
                                                    return (
                                                        <CTableRow
                                                            active={selectedItem?.codMusica === musica.codMusica}
                                                            key={video.codigo + "" + video.tipo + "" + musica.codMusica}>
                                                            <CTableDataCell>
                                                                <div className="thumbnail-wrapper">
                                                                    <CImage
                                                                        className="thumbnail"
                                                                        src={`http://localhost:3333/musica/downloadCapa/${musica.codMusica}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                                        alt={musica.tituloMusica}
                                                                        style={{ width: "100%", borderRadius: "5px" }}
                                                                    />
                                                                    <div className="play-icon-wrapper">
                                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                                            setSelectedVideo(`http://localhost:3333/musica/downloadMusica/${musica.codMusica}`);
                                                                            setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${musica.codMusica}`);

                                                                            setSelectedTitulo(musica.tituloMusica)
                                                                            setSelectedTipo(video.tipo);
                                                                            setSelectedItem(musica); // Define o item selecionado
                                                                        }} />
                                                                    </div>
                                                                </div>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <h6>{musica.tituloMusica}</h6>
                                                                        Album: {video.titulo}
                                                                        <p>{video.autor}</p>
                                                                    </div>
                                                                    <CDropdown className="ml-2">
                                                                        <CDropdownToggle className="vertical-dots" caret={false}>
                                                                            &#x2022;<br />&#x2022;<br />&#x2022;
                                                                        </CDropdownToggle>
                                                                        <CDropdownMenu className="dropdown-menu-right">
                                                                            <CDropdownItem className="dropdown-item" onClick={() => alert('Ver detalhes')}>Ver detalhes</CDropdownItem>
                                                                            <CDropdownItem className="dropdown-item" onClick={() => handleRemoveFromPlaylist(video)}>Remover do grupo</CDropdownItem>
                                                                        </CDropdownMenu>
                                                                    </CDropdown>
                                                                </div>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    )
                                                })
                                            )
                                        } else if (video.tipo === 'album' && video.musicasDoAlbum.length === 0) {
                                            return (
                                                <CTableRow
                                                    active={selectedItem?.codigo === video.codigo && selectedItem?.tipo === video.tipo}
                                                    key={video.codigo + "" + video.tipo}>
                                                    <CTableDataCell>
                                                        <div className="thumbnail-wrapper">
                                                            <CImage
                                                                className="thumbnail"
                                                                src={video.tipo === 'video' ? thumbnail : `http://localhost:3333/album/downloadCapa/${video.codigo}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                                alt={video.nome}
                                                                style={{ width: "100%", borderRadius: "5px" }}
                                                            />
                                                            <div className="play-icon-wrapper">
                                                                <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                                    setSelectedVideo(null);
                                                                    setSelectedUrlCapa(`http://localhost:3333/musica/downloadCapa/${video.codigo}`);

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
                                                                    <CDropdownItem className="dropdown-item" onClick={() => handleRemoveFromPlaylist(video)}>Remover do grupo</CDropdownItem>
                                                                </CDropdownMenu>
                                                            </CDropdown>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        }

                                        else {
                                            return (
                                                <CTableRow
                                                    active={selectedItem?.codigo === video.codigo && selectedItem?.tipo === video.tipo}
                                                    key={video.codigo + "" + video.tipo}>
                                                    <CTableDataCell>
                                                        <div className="thumbnail-wrapper">
                                                            <CImage
                                                                className="thumbnail"
                                                                src={video.tipo === 'video' ? thumbnail : `http://localhost:3333/musica/downloadCapa/${video.codigo}`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                                alt={video.nome}
                                                                style={{ width: "100%", borderRadius: "5px" }}
                                                            />
                                                            <div className="play-icon-wrapper">
                                                                <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {
                                                                    if (video.tipo === "video") {
                                                                        setSelectedVideo(`http://localhost:3333/video/downloadVideo/${video.codigo}`);
                                                                        setSelectedUrlCapa(null);
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
                                                                    <CDropdownItem className="dropdown-item" onClick={() => handleRemoveFromPlaylist(video)}>Remover do grupo</CDropdownItem>
                                                                </CDropdownMenu>
                                                            </CDropdown>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        }
                                    }


                                    )}
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
                    <h3>Adicionar Conteudos ao Grupo</h3>
                </CModalHeader>
                <CModalBody>
                    {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
                    <CForm>
                        <CInputGroup>
                            <CFormInput onChange={(e) => setPalavraChave(e.target.value)} id="search" name="search" placeholder="Digite o titulo do conteudo..." />
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
                    <h5 className="mt-4">Conteudos selecionados</h5>
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
                    <CButton color="primary" onClick={handleAddToPlaylist}>Adicionar ao Grupo</CButton>
                    <CButton color="secondary" onClick={() => setModal(false)}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default PlaylistConteudo;
