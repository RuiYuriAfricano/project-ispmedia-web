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

const ConfigAlbum = () => {
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
  const [capaAlbum, setCapaAlbum] = useState("");
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
            setDataLancamento(album.dataLancamento.split('T')[0]); // Corrigir a data para carregar corretamente
            setFkArtista(album.fkArtista);
            setFkGrupoMusical(album.fkGrupoMusical);
            setFkUtilizador(album.fkUtilizador);
            setCapaAlbum(album.capaAlbum);
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

    const novoAlbum = {
      tituloAlbum,
      descricao,
      editora,
      dataLancamento,
      capaAlbum,
      fkArtista: fkArtista || null,
      fkGrupoMusical: fkGrupoMusical || null,
      fkUtilizador: user?.codUtilizador,
    };

    const editAlbum = {
      codAlbum: idEditAlbum,
      tituloAlbum,
      descricao,
      editora,
      dataLancamento,
      capaAlbum,
      fkArtista: fkArtista || null,
      fkGrupoMusical: fkGrupoMusical || null,
      fkUtilizador,
    };

    try {
      let response;
      if (idEditAlbum) {
        response = await service.album.update(editAlbum);
      } else {
        response = await service.album.add(novoAlbum);
      }

      if (response?.status === 201 || response?.status === 200) {
        setMsgDoAlert(`Álbum ${idEditAlbum ? "Atualizado" : "Criado"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditAlbum) {
          setTituloAlbum("");
          setDescricao("");
          setEditora("");
          setDataLancamento("");
          setCapaAlbum("");
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
    <CRow className="justify-content-center">
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
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Editora"
                  autoComplete="editora"
                  value={editora}
                  onChange={(e) => setEditora(e.target.value)}
                  required
                />
              </CInputGroup>
              <CTooltip content="Selecione a data de lançamento do album.">
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    placeholder="Data de Lançamento"
                    autoComplete="data-lancamento"
                    value={dataLancamento}
                    onChange={(e) => setDataLancamento(e.target.value)}
                    required
                  />
                </CInputGroup>
              </CTooltip>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilImage} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Capa do Álbum"
                  autoComplete="capa-album"
                  value={capaAlbum}
                  onChange={(e) => setCapaAlbum(e.target.value)}
                  required
                />
              </CInputGroup>

              <CFormCheck
                id="pertenceAArtista"
                label="Pertence a um artista?"
                checked={!!fkArtista}
                onChange={(e) => setFkArtista(e.target.checked ? artistas[0]?.codArtista : null)}
                className="mb-3"
              />

              {fkArtista && (
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
              )}

              {!fkArtista && (
                <CFormCheck
                  id="pertenceAGrupo"
                  label="Pertence a um grupo musical?"
                  checked={!!fkGrupoMusical}
                  onChange={(e) => setFkGrupoMusical(e.target.checked ? gruposMusicais[0]?.codGrupoMusical : null)}
                  className="mb-3"
                />
              )}

              {fkGrupoMusical && (
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

export default ConfigAlbum;
