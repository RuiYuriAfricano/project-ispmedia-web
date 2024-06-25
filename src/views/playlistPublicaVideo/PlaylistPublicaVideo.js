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
import { cilMediaPlay } from '@coreui/icons';
import ReactPlayer from 'react-player';
import { service } from '../../services';
import './PlaylistPublicaVideo.css';
import StarRating from '../starRating/StarRating';
import { isNumber } from 'chart.js/helpers';

const PlaylistPublicaVideo = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedTitulo, setSelectedTitulo] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState({
        name: 'Rui Malemba', // Substitua pelo nome do usuário atual
        photo: 'http://localhost:3333/utilizador/download/' + user.username // Substitua pela URL da foto do usuário atual
    });
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseID = await service.video.pesquisaporid(id);
                const response = await service.video.listar();
                setVideos(response.data.length > 0 ? response.data.filter(item => item.visibilidade === 'Publico') : []);
                if (response.data.length > 0) {
                    setSelectedVideo(`http://localhost:3333/video/downloadVideo/${id}`);

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
                                                        src={`http://localhost:3333/video/${video.codVideo}/thumbnail`} // Placeholder thumbnail 'http://img.youtube.com/vi/<video-id>/hqdefault.jpg'
                                                        alt={video.tituloVideo}
                                                        style={{ width: "180px", height: '120px', borderRadius: "5px" }}
                                                    />
                                                    <div className="play-icon-wrapper">
                                                        <CIcon icon={cilMediaPlay} className="play-icon" onClick={() => {

                                                            setSelectedVideo(`http://localhost:3333/video/downloadVideo/${video.codVideo}`);

                                                            setSelectedTitulo(video.tituloVideo)
                                                            setSelectedItem(video); // Define o item selecionado
                                                        }} />
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6>{video.tituloVideo}</h6>
                                                        {isNumber(video.fkArtista) ? video.artista.nomeArtista : video.grupoMusical.nomeGrupoMusical}
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
