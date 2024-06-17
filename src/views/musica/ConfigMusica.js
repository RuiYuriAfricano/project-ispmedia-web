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
  cilMusicNote,
  cilUser,
  cilGroup,
  cilImage,
  cilDescription,
  cilCalendar,
  cilFile,
  cilPencil,
} from '@coreui/icons';
import { service } from './../../services';
import { useParams, Link } from 'react-router-dom';
import StepIndicator from '../StepIndicador/StepIndicator';

const ConfigMusica = ({ idEditMusica, onClose }) => {

  const [tituloMusica, setTituloMusica] = useState('');
  const [ficheiroMusical, setFicheiroMusical] = useState('');
  const [letra, setLetra] = useState('');
  const [generoMusical, setGeneroMusical] = useState('');
  const [compositor, setCompositor] = useState('');
  const [capaMusica, setCapaMusica] = useState(null);
  const [fkAlbum, setFkAlbum] = useState('');
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
  const [albuns, setAlbuns] = useState([]);
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

    const fetchAlbuns = async () => {
      try {
        const response = await service.album.listar();
        setAlbuns(response.data);
      } catch (error) {
        setMsgDoAlert('Erro ao carregar álbuns');
        setCorDoAlert('danger');
      }
    };

    fetchArtistas();
    fetchGruposMusicais();
    fetchAlbuns();
    fetchGrupos();
    fetchPlaylistsPrivadas();

    if (idEditMusica) {
      const fetchMusica = async () => {
        try {
          const response = await service.musica.pesquisaporid(idEditMusica);
          if (response?.status === 200) {
            const musica = response.data;
            setTituloMusica(musica.tituloMusica);
            setLetra(musica.letra);
            setGeneroMusical(musica.generoMusical);
            setCompositor(musica.compositor);
            setDataLancamento(musica.dataLancamento.split('T')[0]);
            setFkAlbum(musica.fkAlbum);
            setFkGrupoMusical(musica.fkGrupoMusical);
            setFkArtista(musica.fkArtista);

            if (musica.fkArtista === null) {
              setPertenceGrupoMusical(true);
              setPertenceArtista(false);
            }
            else if (musica.grupoMusical === null) {
              setPertenceGrupoMusical(false);
              setPertenceArtista(true);
            }
          } else {
            setMsgDoAlert('Erro ao carregar dados da música');
            setCorDoAlert('danger');
          }
        } catch (error) {
          setMsgDoAlert('Erro ao conectar com o servidor!');
          setCorDoAlert('danger');
        }
      };
      fetchMusica();
    }
  }, [idEditMusica]);

  const handleAddMusica = async () => {

    setLoading(true);

    const formData = new FormData();
    formData.append('tituloMusica', tituloMusica);
    formData.append('letra', letra);
    formData.append('generoMusical', generoMusical);
    formData.append('compositor', compositor);
    formData.append('dataLancamento', dataLancamento);
    formData.append('fkAlbum', fkAlbum || null);
    formData.append('fkArtista', fkArtista || null);
    formData.append('fkGrupoMusical', fkGrupoMusical || null);
    formData.append('fkUtilizador', user?.codUtilizador);
    if (!idEditMusica) {
      formData.append('visibilidade', isPrivatePlaylist ? 'PlayListPrivada' : selectedGroup !== "" ? "Publico" : "Privado");
    }

    const renameFile = (file, newName) => {
      return new File([file], newName, {
        type: file.type,
      });
    };

    let newCapaMusicaName = '';
    let newFicheiroMusicalName = '';

    if (capaMusica) {
      newCapaMusicaName = `${idEditMusica || 'new'}-${tituloMusica}-capa${capaMusica.name.slice(capaMusica.name.lastIndexOf('.'))}`;
      const renamedCapaMusica = renameFile(capaMusica, newCapaMusicaName);
      formData.append('files', renamedCapaMusica);
      formData.append('capaMusica', newCapaMusicaName);
    }

    if (ficheiroMusical) {
      newFicheiroMusicalName = `${idEditMusica || 'new'}-${tituloMusica}${ficheiroMusical.name.slice(ficheiroMusical.name.lastIndexOf('.'))}`;
      const renamedFicheiroMusical = renameFile(ficheiroMusical, newFicheiroMusicalName);
      formData.append('files', renamedFicheiroMusical);
      formData.append('ficheiroMusical', newFicheiroMusicalName);
    }

    try {
      let response;
      let response2
      if (idEditMusica) {
        formData.append('codMusica', idEditMusica);

        if (pertenceArtista) {
          formData.set("fkGrupoMusical", null);
        } else {
          formData.set("fkArtista", null);
        }

        response = await service.musica.update(formData);
      } else {
        response = await service.musica.add(formData);

        if (response?.status === 201) {
          if (isPrivatePlaylist) {
            response2 = await service.musicasDaPlaylist.add({
              "fkPlayList": Number(selectedPlaylist),
              "fkMusica": Number(response.data.codMusica),
            });
          }
          else if (!isPrivatePlaylist && selectedGroup !== '') {
            response2 = await service.conteudoDosGrupos.add({
              "fkGrupoDeAmigos": Number(selectedGroup),
              "fkMusica": Number(response.data.codMusica),
            });
          }
        }

      }

      if (response?.status === 200 || (response?.status === 201 && (response2?.status === 201 || selectedGroup === ""))) {
        setMsgDoAlert(`Música ${idEditMusica ? 'Atualizada' : 'Criada'} Com Sucesso!`);
        setCorDoAlert('success');
        if (!idEditMusica) {
          setTituloMusica('');
          setLetra('');
          setGeneroMusical('');
          setCompositor('');
          setDataLancamento('');
          setFkAlbum('');
          setFkGrupoMusical('');
          setFkArtista('');
          setCapaMusica(null);
          setFicheiroMusical(null);
        }
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${idEditMusica ? 'Atualização' : 'Criação'} da Música, Tente Novamente!`);
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
      if (!capaMusica && !idEditMusica) {
        emptyFields.push('Capa da Música');
      }
      if (!ficheiroMusical && !idEditMusica) {
        emptyFields.push('Arquivo de Música');
      }
    } else if (step === 2) {
      if (tituloMusica.trim() === '') {
        emptyFields.push('Título da Música');
      }
      if (generoMusical.trim() === '') {
        emptyFields.push('Gênero da Música');
      }
      if (letra.trim() === '') {
        emptyFields.push('Letra');
      }
      if (compositor.trim() === '') {
        emptyFields.push('Compositor');
      }
      if (dataLancamento.trim() === '') {
        emptyFields.push('Data de Lançamento');
      }
    } else if (step === 3) {
      if (!fkArtista && !fkGrupoMusical) {
        emptyFields.push('Artista ou Grupo Musical');
      }
      if (isPrivatePlaylist && !idEditMusica && selectedPlaylist.trim() === '') {
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

    setMsgDoAlert("");
    setCorDoAlert('');

    setStep(step + 1);
  };


  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
                      <CIcon icon={cilMusicNote} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Título da Música"
                      autoComplete="titulo-musica"
                      value={tituloMusica}
                      onChange={(e) => setTituloMusica(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <textarea
                      className="form-control"
                      placeholder="Letra"
                      autoComplete="letra"
                      value={letra}
                      onChange={(e) => setLetra(e.target.value)}
                      rows={4}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>

                    <CFormSelect
                      value={generoMusical}
                      onChange={(e) => setGeneroMusical(e.target.value)}
                    >
                      <option value="">Selecione o Genero Musical</option>
                      <option value="Rock">Rock</option>
                      <option value="Pop">Pop</option>
                      <option value="Funk">Funk</option>
                      <option value="Rap">Rap</option>
                      <option value="Hip Hop">Hip Hop</option>
                      <option value="Reggae">Reggae</option>
                      <option value="Jazz">Jazz</option>
                      <option value="Blues">Blues</option>
                      <option value="Soul">Soul</option>
                      <option value="Country">Country</option>
                      <option value="Gospel">Gospel</option>
                      <option value="Folk">Folk</option>
                      <option value="Indie">Indie</option>
                      <option value="Metal">Metal</option>
                      <option value="Punk">Punk</option>
                      <option value="Sertanejo">Sertanejo</option>
                      <option value="Bossa Nova">Bossa Nova</option>
                      <option value="Fado">Fado</option>
                      <option value="Kizomba">Kizomba</option>
                      <option value="Semba">Semba</option>
                      <option value="Kuduro">Kuduro</option>
                      <option value="Tarraxinha">Tarraxinha</option>
                      <option value="Afro-house">Afro-house</option>
                      <option value="Marrabenta">Marrabenta</option>
                      <option value="Zouk">Zouk</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPencil} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Compositor"
                      autoComplete="compositor"
                      value={compositor}
                      onChange={(e) => setCompositor(e.target.value)}
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
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCapaMusica(e.target.files[0])}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilFile} />
                    </CInputGroupText>
                    <CFormInput
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setFicheiroMusical(e.target.files[0])}
                    />
                  </CInputGroup>

                </>
              )}
              {step === 3 && (
                <>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormCheck
                        type="checkbox"
                        name="musica-pertenece"
                        id="musica-artista"
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
                        name="musica-pertenece"
                        id="musica-grupo"
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

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <CFormSelect
                      value={fkAlbum}
                      onChange={(e) => setFkAlbum(e.target.value)}
                    >
                      <option value="">Selecione o Álbum (Opcional)</option>
                      {albuns.map((album) => (
                        <option key={album.codAlbum} value={album.codAlbum}>
                          {album.tituloAlbum}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>

                  {!idEditMusica && (
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
                  {step === 4 && <CButton color="primary" onClick={handleAddMusica} disabled={loading}>
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

export default ConfigMusica;
