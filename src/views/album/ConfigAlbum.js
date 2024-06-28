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
import { cilMusicNote, cilTrash, cilUser, cilGroup, cilImage, cilDescription, cilCalendar, cilPencil } from '@coreui/icons';
import { service } from './../../services';
import { useParams } from 'react-router-dom';
import StepIndicator from '../StepIndicador/StepIndicator';
import './ConfigAlbum.css'

const ConfigAlbum = ({ idEditAlbum, onClose }) => {

    const [step, setStep] = useState(1); // New state to track the current step
    const [tituloAlbum, setTituloAlbum] = useState("");
    const [descricao, setDescricao] = useState("");
    const [editora, setEditora] = useState("");
    const [dataLancamento, setDataLancamento] = useState("");
    const [fkArtista, setFkArtista] = useState(null);
    const [codMusica, setCodMusica] = useState('');
    const [fkGrupoMusical, setFkGrupoMusical] = useState(null);
    const [fkUtilizador, setFkUtilizador] = useState(-1);
    const [artistas, setArtistas] = useState([]);
    const [musicas, setMusicas] = useState([]);
    const [musicaSelecionada, setMusicaSelecionada] = useState(null)
    const [gruposMusicais, setGruposMusicais] = useState([]);
    const [grupos, setGrupos] = useState([]); // New state for groups
    const [loading, setLoading] = useState(false);
    const [msgDoAlert, setMsgDoAlert] = useState("");
    const [corDoAlert, setCorDoAlert] = useState("");
    const [capaAlbum, setCapaAlbum] = useState(null);
    const [alterarCapa, setAlterarCapa] = useState(false);
    const [pertenceArtista, setPertenceArtista] = useState(true);
    const [isPublicGroup, setIsPublicGroup] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState("");
    const user = JSON.parse(localStorage.getItem("loggedUser"));//isPublicGroup
    const vetor = [{ id: 1, txt: 'Detalhes' },
    { id: 2, txt: 'Autoria e Visibilidade' },
    { id: 3, txt: 'Finalizar' }];

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await service.artista.listar();
                setArtistas(response.data);
            } catch (error) {
                setMsgDoAlert("Erro ao carregar artistas");
                setCorDoAlert("danger");
            }
        };

        const fetchMusicas = async () => {
            try {
                const response = await service.musica.listar();
                setMusicas(response.data.filter(item => item.fkUtilizador === user.codUtilizador && item.fkAlbum === null));
            } catch (error) {
                setMsgDoAlert("Erro ao carregar artistas");
                setCorDoAlert("danger");
            }
        };

        const fetchGruposMusicais = async () => {
            try {
                const response = await service.grupoMusical.listar();
                setGruposMusicais(response.data);
            } catch (error) {
                setMsgDoAlert("Erro ao carregar grupos musicais");
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
        fetchGrupos();
        fetchMusicas();

        if (idEditAlbum) {
            const fetchAlbum = async () => {
                try {
                    const response = await service.album.pesquisaporid(idEditAlbum);
                    if (response?.status === 200) {
                        const album = response.data;
                        setTituloAlbum(album.tituloAlbum);
                        setDescricao(album.descricao);
                        setEditora(album.editora);
                        setDataLancamento(album.dataLancamento.split('T')[0]);
                        setFkArtista(album.fkArtista);
                        setIsPublicGroup(album.visibilidade === "Publico")
                        setFkGrupoMusical(album.fkGrupoMusical);
                        setFkUtilizador(album.fkUtilizador);
                        setCapaAlbum(null); // Reset the album cover state when loading album data
                        if (album.fkArtista === null) {
                            setPertenceArtista(false);
                        }
                        else if (album.grupoMusical === null) {
                            setPertenceArtista(true);
                        }
                    } else {
                        setMsgDoAlert("Erro ao carregar dados do álbum");
                        setCorDoAlert("danger");
                    }
                } catch (error) {
                    setMsgDoAlert("Erro ao conectar com o servidor!");
                    setCorDoAlert("danger");
                }
            };
            fetchAlbum();
        }
    }, [idEditAlbum]);

    const handleAddAlbum = async () => {

        setLoading(true);

        const formData = new FormData();
        formData.append('tituloAlbum', tituloAlbum);
        formData.append('descricao', descricao);
        formData.append('editora', editora);
        formData.append('dataLancamento', dataLancamento);
        formData.append('fkArtista', pertenceArtista ? (fkArtista || null) : null);
        formData.append('fkGrupoMusical', !pertenceArtista ? (fkGrupoMusical || null) : null);
        formData.append('fkUtilizador', user?.codUtilizador);
        formData.append('visibilidade', isPublicGroup ? 'Publico' : "Privado");

        if (alterarCapa || !idEditAlbum) {
            const fileExtension = capaAlbum.name.split('.').pop();
            const modifiedFilename = `${new Date().toISOString().replace(/[-:.]/g, '')}-${tituloAlbum}.${fileExtension}`;
            const modifiedFile = new File([capaAlbum], modifiedFilename, {
                type: capaAlbum.type,
            });
            formData.append('files', modifiedFile);
            formData.append('capaAlbum', modifiedFilename);
        }

        try {
            let response;
            let response2;
            if (idEditAlbum) {
                formData.append('codAlbum', idEditAlbum);
                response = await service.album.update(formData);
                if (!isPublicGroup) {
                    response = await service.conteudoDosGrupos.updateFk({
                        "fkGrupoDeAmigos": Number(selectedGroup),
                        "fkAlbum": Number(response.data.codAlbum),
                    });
                }
            } else {
                response = await service.album.add(formData);


                if (!isPublicGroup) {
                    response2 = await service.conteudoDosGrupos.add({
                        "fkGrupoDeAmigos": Number(selectedGroup),
                        "fkAlbum": Number(response.data.codAlbum),
                    });
                }

                console.log(response)

                const resp = await service.musica.pesquisaporid(codMusica)
                resp.data.fkAlbum = response.data.codAlbum
                delete resp.data.registadopor
                delete resp.data.artista
                console.log(resp.data)
                const response3 = await service.musica.update(resp.data)
            }

            if (response?.status === 200 || (response?.status === 201 && (response2?.status === 201 || isPublicGroup))) {
                setMsgDoAlert(`Álbum ${idEditAlbum ? "Atualizado" : "Criado"} Com Sucesso!`);
                setCorDoAlert("success");
                if (!idEditAlbum) {
                    setTituloAlbum("");
                    setDescricao("");
                    setEditora("");
                    setDataLancamento("");
                    setCapaAlbum(null);
                    setFkArtista("");
                    setFkGrupoMusical("");
                    setSelectedGroup("");
                }
                setTimeout(() => {
                    onClose(true);
                }, 2000);
            } else {
                setMsgDoAlert(`Falha na ${idEditAlbum ? "Atualização" : "Criação"} do Álbum, Tente Novamente!`);
                setCorDoAlert("danger");
            }
        } catch (error) {
            setMsgDoAlert("Erro ao conectar com o servidor!");
            setCorDoAlert("danger");
        } finally {
            setLoading(false);
        }
    };


    const validateStep = (currentStep) => {
        const emptyFields = [];

        if (currentStep === 1) {
            if (tituloAlbum.trim() === '') emptyFields.push('Título do Album');
            if (descricao.trim() === '') emptyFields.push('Descrição');
            if (editora.trim() === '') emptyFields.push('Editora');
            if (dataLancamento.trim() === '') emptyFields.push('Data de Lançamento');
            if ((!idEditAlbum && !capaAlbum) || (alterarCapa && !capaAlbum)) emptyFields.push('Capa da Album');
            if (!idEditAlbum && codMusica.trim() === '') emptyFields.push('Música do Album');
        } else if (currentStep === 2) {
            if (!fkArtista && !fkGrupoMusical) emptyFields.push('Artista ou Grupo Musical');
            if (!isPublicGroup && selectedGroup.trim() === '') emptyFields.push('Grupo');
        }

        if (emptyFields.length > 0) {
            const emptyFieldsMessage = emptyFields.join(', ');
            setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
            setCorDoAlert('danger');
            return false;
        }

        return true;
    };


    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
            setMsgDoAlert("");
            setCorDoAlert('');
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleRemoveCapa = () => {
        setCapaAlbum(null);
    };


    return (
        <CRow className="justify-content-center mb-4">
            <CCol>
                <CCard className="mx-4" style={{ border: 'none ' }}>
                    {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
                    <StepIndicator vetor={vetor} currentStep={step} totalSteps={3} />
                    <CCardBody className="p-4" style={{ border: '0.1px solid #323a49', borderRadius: '10px' }}>
                        <CForm>
                            {step === 1 && (
                                <>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilMusicNote} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Título do Álbum"
                                            autoComplete="titulo-album"
                                            value={tituloAlbum}
                                            onChange={(e) => setTituloAlbum(e.target.value)}
                                            required
                                        />
                                    </CInputGroup>

                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilDescription} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Descrição"
                                            autoComplete="descricao"
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                            required
                                        />
                                    </CInputGroup>

                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilPencil} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Editora"
                                            autoComplete="editora"
                                            value={editora}
                                            onChange={(e) => setEditora(e.target.value)}
                                            required
                                        />
                                    </CInputGroup>

                                    <CTooltip content="Insira a data de lançamento">
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

                                    {idEditAlbum && (
                                        <CFormCheck
                                            id="alterarCapa"
                                            label="Alterar capa do álbum?"
                                            checked={alterarCapa}
                                            onChange={(e) => setAlterarCapa(e.target.checked)}
                                            className="mb-3"
                                        />
                                    )}

                                    {(!idEditAlbum || (idEditAlbum && alterarCapa)) && (
                                        <>
                                            <CTooltip content="Escolha uma imagem de capa">
                                                <CInputGroup className="mb-3">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilImage} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setCapaAlbum(e.target.files[0])}
                                                        required
                                                    />
                                                </CInputGroup>
                                            </CTooltip>

                                            {capaAlbum && (
                                                <div className="mb-3 text-center">
                                                    <img src={URL.createObjectURL(capaAlbum)} alt="Capa do Álbum" className="album-thumbnail" />
                                                    <CButton color="danger" onClick={handleRemoveCapa} className="mt-2">
                                                        <CIcon icon={cilTrash} /> Remover Capa
                                                    </CButton>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {
                                        !idEditAlbum && (
                                            <CTooltip content="Selecione uma música">
                                                <CInputGroup className="mb-3">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilMusicNote} />
                                                    </CInputGroupText>
                                                    <CFormSelect
                                                        value={codMusica}
                                                        onChange={(e) => setCodMusica(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Selecione uma música</option>
                                                        {musicas.map((musica) => (
                                                            <option key={musica.codMusica} value={musica.codMusica}>
                                                                {musica.tituloMusica}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                </CInputGroup>
                                            </CTooltip>
                                        )
                                    }

                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="mb-3">
                                        <CFormCheck
                                            type="radio"
                                            id="pertenceArtista"
                                            name="pertenceTipo"
                                            label="Pertence a um Artista"
                                            checked={pertenceArtista}
                                            onChange={() => setPertenceArtista(true)}
                                        />
                                        <CFormCheck
                                            type="radio"
                                            id="pertenceGrupo"
                                            name="pertenceTipo"
                                            label="Pertence a um Grupo Musical"
                                            checked={!pertenceArtista}
                                            onChange={() => setPertenceArtista(false)}
                                        />
                                    </div>

                                    {pertenceArtista && (
                                        <CTooltip content="Selecione um artista">
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilUser} />
                                                </CInputGroupText>
                                                <CFormSelect
                                                    value={fkArtista}
                                                    onChange={(e) => setFkArtista(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Selecione um artista</option>
                                                    {artistas.map((artista) => (
                                                        <option key={artista.codArtista} value={artista.codArtista}>
                                                            {artista.nomeArtista}
                                                        </option>
                                                    ))}
                                                </CFormSelect>
                                            </CInputGroup>
                                        </CTooltip>
                                    )}

                                    {!pertenceArtista && (
                                        <CTooltip content="Selecione um grupo musical">
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilGroup} />
                                                </CInputGroupText>
                                                <CFormSelect
                                                    value={fkGrupoMusical}
                                                    onChange={(e) => setFkGrupoMusical(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Selecione um grupo musical</option>
                                                    {gruposMusicais.map((grupo) => (
                                                        <option key={grupo.codGrupoMusical} value={grupo.codGrupoMusical}>
                                                            {grupo.nomeGrupoMusical}
                                                        </option>
                                                    ))}
                                                </CFormSelect>
                                            </CInputGroup>
                                        </CTooltip>
                                    )}

                                    {!idEditAlbum && (
                                        <>
                                            <div className="mb-3">
                                                <CFormCheck
                                                    type="radio"
                                                    id="privatePlaylist"
                                                    name="playlistOrGroup"
                                                    label="Público"
                                                    checked={isPublicGroup}
                                                    onChange={() => setIsPublicGroup(true)}
                                                />
                                                <CFormCheck
                                                    type="radio"
                                                    id="group"
                                                    name="playlistOrGroup"
                                                    label="Privado"
                                                    checked={!isPublicGroup}
                                                    onChange={() => setIsPublicGroup(false)}
                                                />
                                            </div>

                                            {!isPublicGroup && (
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
                                                            <option value="">Selecione um grupo</option>
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

                            <CRow className="mt-3">
                                <CCol xs={6}>
                                    {step > 1 && <CButton color="secondary" onClick={handlePrevious}>Anterior</CButton>}
                                </CCol>
                                <CCol xs={6} className="text-end">
                                    {step < 3 && <CButton color="primary" onClick={handleNext}>Próximo</CButton>}
                                    {step === 3 && <CButton color="primary" onClick={handleAddAlbum}>
                                        {loading ? <CSpinner size="sm" /> : 'Salvar'}
                                    </CButton>}
                                </CCol>
                            </CRow>

                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ConfigAlbum;
