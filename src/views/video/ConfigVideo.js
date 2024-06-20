import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormCheck,
  CAlert,
  CSpinner,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilVideo,
  cilUser,
  cilGroup,
  cilDescription,
  cilCalendar,
  cilFile,
  cilPencil,
  cilMusicNote,
  cilTrash, // Adicionado
} from '@coreui/icons';
import { service } from './../../services';
import { useParams, Link } from 'react-router-dom';
import StepIndicator from '../StepIndicador/StepIndicator';

const ConfigVideo = ({ idEditVideo, onClose }) => {

  const [tituloVideo, setTituloVideo] = useState('');
  const [ficheiroVideo, setFicheiroVideo] = useState('');
  const [ficheiroDoVideo, setFicheiroDoVideo] = useState('');
  const [generoDoVideo, setGeneroDoVideo] = useState('');
  const [produtor, setProdutor] = useState('');
  const [legenda, setLegenda] = useState('');
  const [fkGrupoMusical, setFkGrupoMusical] = useState('');
  const [fkArtista, setFkArtista] = useState('');
  const [dataLancamento, setDataLancamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState('');
  const [corDoAlert, setCorDoAlert] = useState('');
  const [pertenceArtista, setPertenceArtista] = useState(true); // Estado para determinar se pertence a um artista
  const [pertenceGrupoMusical, setPertenceGrupoMusical] = useState(false); // Estado para determinar se pertence a um grupo musical
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedUser')) || {});
  const [artistas, setArtistas] = useState([]);
  const [gruposMusicais, setGruposMusicais] = useState([]);
  const [isPrivatePlaylist, setIsPrivatePlaylist] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [playlistsPrivadas, setPlaylistsPrivadas] = useState([]); // New state for private playlists
  const [grupos, setGrupos] = useState([]); // New state for groups
  const [step, setStep] = useState(1); // New state to track the current step
  const vetor = [{ id: 1, txt: 'Carregar Ficheiro' },
  { id: 2, txt: 'Detalhes' },
  { id: 3, txt: 'Autoria e Visibilidade' },
  { id: 4, txt: 'Finalizar' }];
  const [videoPreview, setVideoPreview] = useState(null); // Adicionado para pré-visualização do vídeo



  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await service.artista.listar();
        setArtistas(response.data);
      } catch (error) {
        setMsgDoAlert('Erro ao carregar artistas');
        setCorDoAlert('danger');
      }
    };

    const fetchGruposMusicais = async () => {
      try {
        const response = await service.grupoMusical.listar();
        setGruposMusicais(response.data);
      } catch (error) {
        setMsgDoAlert('Erro ao carregar grupos musicais');
        setCorDoAlert('danger');
      }
    };

    const fetchPlaylistsPrivadas = async () => {
      try {
        const response = await service.playlist.listar(); // Assuming this is the correct service call
        setPlaylistsPrivadas(response.data.filter(item => {
          return item.tipoPlayList === "privada" && item.fkUtilizador === user.codUtilizador
        }));
      } catch (error) {
        setMsgDoAlert("Erro ao carregar playlists privadas");
        setCorDoAlert("danger");
      }
    };

    const fetchGrupos = async () => {
      try {
        const response = await service.grupoDeAmigos.listar(); // Assuming this is the correct service call
        setGrupos(response.data);
      } catch (error) {
        setMsgDoAlert("Erro ao carregar grupos");
        setCorDoAlert("danger");
      }
    };


    fetchArtistas();
    fetchGruposMusicais();
    fetchPlaylistsPrivadas();
    fetchGrupos();

    if (idEditVideo) {
      const fetchVideo = async () => {
        try {
          const response = await service.video.pesquisaporid(idEditVideo);
          if (response?.status === 200) {
            const video = response.data;
            setTituloVideo(video.tituloVideo);
            setGeneroDoVideo(video.generoDoVIdeo);
            setProdutor(video.produtor);
            setLegenda(video.legenda);
            setDataLancamento(video.dataLancamento.split('T')[0]);
            setFkGrupoMusical(video.fkGrupoMusical);
            setFkArtista(video.fkArtista);
            setFicheiroDoVideo(video.ficheiroDoVideo);

            if (video.fkArtista === null) {
              setPertenceGrupoMusical(true);
              setPertenceArtista(false);
            }
            else if (video.grupoMusical === null) {
              setPertenceGrupoMusical(false);
              setPertenceArtista(true);
            }

          } else {
            setMsgDoAlert('Erro ao carregar dados do vídeo');
            setCorDoAlert('danger');
          }
        } catch (error) {
          setMsgDoAlert('Erro ao conectar com o servidor!');
          setCorDoAlert('danger');
        }
      };
      fetchVideo();
    }
  }, [idEditVideo]);

  const handleAddVideo = async () => {

    setLoading(true);

    const formData = new FormData();
    formData.append('tituloVideo', tituloVideo);
    formData.append('generoDoVideo', generoDoVideo);
    formData.append('produtor', produtor);
    formData.append('legenda', legenda);
    formData.append('dataLancamento', dataLancamento);
    formData.append('fkArtista', fkArtista || null);
    formData.append('fkGrupoMusical', fkGrupoMusical || null);
    formData.append('fkUtilizador', user?.codUtilizador);
    if (!idEditVideo) {
      formData.append('visiblidade', isPrivatePlaylist ? 'PlayListPrivada' : selectedGroup !== "" ? "Publico" : "Privado");
    }
    const renameFile = (file, newName) => {
      return new File([file], newName, {
        type: file.type,
      });
    };

    let newFicheiroVideoName = '';

    if (ficheiroVideo) {
      newFicheiroVideoName = `${idEditVideo || 'new'}-${tituloVideo}${ficheiroVideo.name.slice(ficheiroVideo.name.lastIndexOf('.'))}`;
      const renamedFicheiroVideo = renameFile(ficheiroVideo, newFicheiroVideoName);
      formData.append('files', renamedFicheiroVideo);
      formData.append('ficheiroDoVideo', newFicheiroVideoName);
    }

    try {
      let response;
      let response2;
      if (idEditVideo) {
        formData.append('codVideo', idEditVideo);

        if (pertenceArtista) {
          formData.set("fkgrupoMusical", null);
        } else {
          formData.set("fkArtista", null);
        }

        if (!ficheiroVideo) {
          formData.append('ficheiroDoVideo', ficheiroDoVideo);
        }
        response = await service.video.update(formData);
      } else {
        response = await service.video.add(formData);

        if (response?.status === 201) {
          if (isPrivatePlaylist) {
            response2 = await service.videosDaPlaylist.add({
              "fkPlayList": Number(selectedPlaylist),
              "fkVideo": Number(response.data.codVideo),
            });
          }
          else if (!isPrivatePlaylist && selectedGroup !== '') {
            response2 = await service.conteudoDosGrupos.add({
              "fkGrupoDeAmigos": Number(selectedGroup),
              "fkVideo": Number(response.data.codVideo),
            });
          }
        }
      }

      if (response?.status === 200 || (response?.status === 201 && (response2?.status === 201 || selectedGroup === ""))) {
        setMsgDoAlert(`Vídeo ${idEditVideo ? 'Atualizado' : 'Criado'} Com Sucesso!`);
        setCorDoAlert('success');
        if (!idEditVideo) {
          setTituloVideo('');
          setGeneroDoVideo('');
          setProdutor('');
          setLegenda('');
          setDataLancamento('');
          setFkGrupoMusical('');
          setFkArtista('');
          setFicheiroVideo(null);
          setVideoPreview(null); // Adicionado para limpar a pré-visualização
        }
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${idEditVideo ? 'Atualização' : 'Criação'} do Vídeo, Tente Novamente!`);
        setCorDoAlert('danger');
      }
    } catch (error) {
      setMsgDoAlert('Erro ao conectar com o servidor!');
      setCorDoAlert('danger');
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStepFields = () => {
    const emptyFields = [];

    if (step === 1) {

      if (!ficheiroVideo && !idEditVideo) {
        emptyFields.push('Arquivo de Vídeo');
      }
    } else if (step === 2) {
      if (tituloVideo.trim() === '') {
        emptyFields.push('Título do Vídeo');
      }
      if (generoDoVideo.trim() === '') {
        emptyFields.push('Gênero do Vídeo');
      }
      if (produtor.trim() === '') {
        emptyFields.push('Produtor');
      }
      if (legenda.trim() === '') {
        emptyFields.push('Legenda');
      }
      if (dataLancamento.trim() === '') {
        emptyFields.push('Data de Lançamento');
      }
    } else if (step === 3) {
      if (!fkArtista && !fkGrupoMusical) {
        emptyFields.push('Artista ou Grupo Musical');
      }
      if (isPrivatePlaylist && !idEditVideo && selectedPlaylist.trim() === '') {
        emptyFields.push('Playlist Privada');
      }
    }

    return emptyFields;
  };

  const handleNext = () => {
    const emptyFields = validateCurrentStepFields();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }

    setMsgDoAlert('');
    setCorDoAlert('');

    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setFicheiroVideo(file);
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL); // Definido para pré-visualização
    }
  };

  const handleRemoveVideo = () => {
    setFicheiroVideo(null);
    setVideoPreview(null);
  };


  return (
    <CRow className="justify-content-center mb-4">
      <CCol>
        <CCard className="mx-4" style={{ border: 'none ' }}>
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <StepIndicator currentStep={step} vetor={vetor} totalSteps={3} />
          <CCardBody className="p-4" style={{ border: '0.1px solid #323a49', borderRadius: '10px' }}>
            <CForm>
              {step === 2 && (
                <>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilVideo} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Título do Vídeo"
                      autoComplete="titulo-video"
                      value={tituloVideo}
                      onChange={(e) => setTituloVideo(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>

                    <CFormSelect
                      value={generoDoVideo}
                      onChange={(e) => setGeneroDoVideo(e.target.value)}
                    >
                      <option value="">Selecione o Gênero do Vídeo</option>
                      <option value="Ação">Ação</option>
                      <option value="Comédia">Comédia</option>
                      <option value="Drama">Drama</option>
                      <option value="Suspense">Suspense</option>
                      <option value="Romance">Romance</option>
                      <option value="Documentário">Documentário</option>
                      <option value="Educação">Educação</option>
                      <option value="Religioso">Religioso</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Palestra">Palestra</option>
                      <option value="Entrevista">Entrevista</option>
                      <option value="Esportes">Esportes</option>
                      <option value="Notícias">Notícias</option>
                      <option value="Reality Show">Reality Show</option>
                      <option value="Video blog">Video blog</option>
                      <option value="Video Musicais">Video Musicais</option>
                      <option value="Análise de Produto/Review">Análise de Produto/Review</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPencil} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Produtor"
                      autoComplete="produtor"
                      value={produtor}
                      onChange={(e) => setProdutor(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <textarea
                      className="form-control"
                      placeholder="Legenda"
                      autoComplete="legenda"
                      value={legenda === "" ? legenda : JSON.parse(legenda)}
                      onChange={(e) => setLegenda(JSON.stringify(e.target.value))}
                      rows={4}
                      required
                    />
                  </CInputGroup>

                  <CTooltip content="Selecione a data de lançamento">
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>
                      <CFormInput
                        type="date"
                        value={dataLancamento}
                        onChange={(e) => setDataLancamento(e.target.value)}
                        required
                      />
                    </CInputGroup>
                  </CTooltip>
                </>
              )}

              {step === 1 && (
                <>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange} // Alterado para usar a nova função
                    />
                  </CInputGroup>
                  {videoPreview && (
                    <div className="mb-3">
                      <video src={videoPreview} controls width="100%" />
                      <CButton color="danger" onClick={handleRemoveVideo} className="mt-2">
                        <CIcon icon={cilTrash} /> Remover Vídeo
                      </CButton>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormCheck
                        type="checkbox"
                        name="video-pertenece"
                        id="video-artista"
                        label="Pertence a um Artista"
                        checked={pertenceArtista}
                        onChange={() => {
                          setPertenceArtista(!pertenceArtista);
                          setPertenceGrupoMusical(false); // Desmarcar grupo musical
                        }}
                      />
                    </CCol>
                    <CCol>
                      <CFormCheck
                        type="checkbox"
                        name="video-pertenece"
                        id="video-grupo"
                        label="Pertence a um Grupo Musical"
                        checked={pertenceGrupoMusical}
                        onChange={() => {
                          setPertenceGrupoMusical(!pertenceGrupoMusical);
                          setPertenceArtista(false); // Desmarcar artista
                        }}
                      />
                    </CCol>
                  </CRow>

                  {pertenceArtista && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect
                        value={fkArtista}
                        onChange={(e) => setFkArtista(e.target.value)}
                      >
                        <option value="">Selecione o Artista</option>
                        {artistas.map((artista) => (
                          <option key={artista.codArtista} value={artista.codArtista}>
                            {artista.nomeArtista}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  )}

                  {pertenceGrupoMusical && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilGroup} />
                      </CInputGroupText>
                      <CFormSelect
                        value={fkGrupoMusical}
                        onChange={(e) => setFkGrupoMusical(e.target.value)}
                      >
                        <option value="">Selecione o Grupo Musical</option>
                        {gruposMusicais.map((grupo) => (
                          <option key={grupo.codGrupoMusical} value={grupo.codGrupoMusical}>
                            {grupo.nomeGrupoMusical}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  )}
                  {!idEditVideo && (
                    <>
                      <div className="mb-3">
                        <CFormCheck
                          type="radio"
                          id="privatePlaylist"
                          name="playlistOrGroup"
                          label="Colocar em uma Playlist Privada"
                          checked={isPrivatePlaylist}
                          onChange={() => setIsPrivatePlaylist(true)}
                        />
                        <CFormCheck
                          type="radio"
                          id="group"
                          name="playlistOrGroup"
                          label="Colocar em um Grupo"
                          checked={!isPrivatePlaylist}
                          onChange={() => setIsPrivatePlaylist(false)}
                        />
                      </div>

                      {isPrivatePlaylist && (
                        <CTooltip content="Selecione uma playlist privada">
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilMusicNote} />
                            </CInputGroupText>
                            <CFormSelect
                              value={selectedPlaylist}
                              onChange={(e) => setSelectedPlaylist(e.target.value)}
                              required
                            >
                              <option value="">Selecione uma playlist privada</option>
                              {playlistsPrivadas.map((playlist) => (
                                <option key={playlist.codPlayList} value={playlist.codPlayList}>
                                  {playlist.nomePlayList}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>
                        </CTooltip>
                      )}

                      {!isPrivatePlaylist && (
                        <CTooltip content="Selecione um grupo">
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilGroup} />
                            </CInputGroupText>
                            <CFormSelect
                              value={selectedGroup}
                              onChange={(e) => setSelectedGroup(e.target.value)}
                              required
                            >
                              <option value="">Público</option>
                              {grupos.map((grupo) => (
                                <option key={grupo.codGrupoDeAmigos} value={grupo.codGrupoDeAmigos}>
                                  {grupo.nomeDoGrupo}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>
                        </CTooltip>
                      )}
                    </>
                  )}


                </>
              )}

              <CRow className='w-100'>
                <CCol xs={6}>
                  {step > 1 && <CButton color="secondary" onClick={handlePrevious}>Anterior</CButton>}
                </CCol>
                <CCol xs={6} className="text-end">
                  {step < 4 && <CButton color="primary" onClick={handleNext}>Próximo</CButton>}
                  {step === 4 &&
                    <CButton color="primary" onClick={handleAddVideo} disabled={loading}>
                      {loading ? <CSpinner size="sm" /> : 'Guardar'}
                    </CButton>
                  }
                </CCol>

              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ConfigVideo;
