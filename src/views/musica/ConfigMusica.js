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
import { cilMusicNote, cilUser, cilGroup, cilImage, cilDescription, cilCalendar } from '@coreui/icons';
import { service } from './../../services';
import { useParams } from 'react-router-dom';

const ConfigMusica = () => {
  const { idEditAlbum } = useParams();

  const [tituloAlbum, setTituloAlbum] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editora, setEditora] = useState("");
  const [dataLancamento, setDataLancamento] = useState("");
  const [fkArtista, setFkArtista] = useState(null);
  const [fkGrupoMusical, setFkGrupoMusical] = useState(null);
  const [fkUtilizador, setFkUtilizador] = useState(-1);
  const [artistas, setArtistas] = useState([]);
  const [gruposMusicais, setGruposMusicais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [capaAlbum, setCapaAlbum] = useState(null);
  const [alterarCapa, setAlterarCapa] = useState(false); // Novo estado para controlar a alteração da capa do álbum
  const [pertenceArtista, setPertenceArtista] = useState(true); // Novo estado para determinar se o álbum pertence a um artista ou a um grupo musical
  const user = JSON.parse(localStorage.getItem("loggedUser"));

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

    const fetchGruposMusicais = async () => {
      try {
        const response = await service.grupoMusical.listar();
        setGruposMusicais(response.data);
      } catch (error) {
        setMsgDoAlert("Erro ao carregar grupos musicais");
        setCorDoAlert("danger");
      }
    };

    fetchArtistas();
    fetchGruposMusicais();

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
            setFkGrupoMusical(album.fkGrupoMusical);
            setFkUtilizador(album.fkUtilizador);
            setCapaAlbum(null); // Reseta o estado da capa do álbum ao carregar os dados do álbum
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
      if (idEditAlbum) {
        formData.append('codAlbum', idEditAlbum);
        response = await service.album.update(formData);
      } else {
        response = await service.album.add(formData);
      }

      if (response?.status === 201 || response?.status === 200) {
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
        }
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

  return (
    <CRow className="justify-content-center mb-4">
      <CCol md={9} lg={7} xl={6}>
        <CCard className="mx-4">
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <CCardBody className="p-4">
            <CForm>
              <h1>{idEditAlbum !== undefined ? `Editar Álbum` : "Criar Novo Álbum"}</h1>
              <p className="text-body-secondary">Atenção aos campos obrigatórios *</p>

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
                  <CIcon icon={cilMusicNote} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Editora"
                  autoComplete="editora"
                  value={editora}
                  onChange={(e) => setEditora(e.target.value)}
                  required
                />
              </CInputGroup>

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
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput
                    type="file"
                    onChange={(e) => setCapaAlbum(e.target.files[0])}
                    required
                  />
                </CInputGroup>
              )}

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

              <div className="d-grid">
                <CButton color="success" onClick={handleAddAlbum}>
                  {loading ? <CSpinner size="sm" /> : idEditAlbum ? 'Atualizar Álbum' : 'Criar Álbum'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ConfigMusica;

