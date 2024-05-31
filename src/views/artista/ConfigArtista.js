// components/ConfigArtista.js
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilMusicNote, cilGroup } from '@coreui/icons';
import { service } from './../../services';
import { useParams } from 'react-router-dom';

const ConfigArtista = () => {
  const { idEditArtista } = useParams();

  const [nomeArtista, setNomeArtista] = useState("");
  const [generoMusical, setGeneroMusical] = useState("");
  const [pertenceAGrupo, setPertenceAGrupo] = useState(false);
  const [fkGrupoMusical, setFkGrupoMusical] = useState(null);
  const [gruposMusicais, setGruposMusicais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [codUtilizador, setCodUtilizador] = useState(-1);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const fetchGruposMusicais = async () => {
      try {
        const response = await service.grupoMusical.listar();
        setGruposMusicais(response.data);
      } catch (error) {
        setMsgDoAlert("Erro ao carregar grupos musicais");
        setCorDoAlert("danger");
      }
    };

    fetchGruposMusicais();

    if (idEditArtista) {
      // Fetch the existing artista data
      const fetchArtista = async () => {
        try {
          const response = await service.artista.pesquisaporid(idEditArtista);
          if (response?.status === 200) {
            const artista = response.data;
            setNomeArtista(artista.nomeArtista);
            setGeneroMusical(artista.generoMusical);
            setFkGrupoMusical(artista.fkGrupoMusical);
            setCodUtilizador(artista.fkUtilizador);
            setPertenceAGrupo(!!artista.fkGrupoMusical);
          } else {
            setMsgDoAlert("Erro ao carregar dados do artista");
            setCorDoAlert("danger");
          }
        } catch (error) {
          setMsgDoAlert("Erro ao conectar com o servidor!");
          setCorDoAlert("danger");
        }
      };
      fetchArtista();
    }
  }, [idEditArtista]);

  const handleAddArtista = async () => {
    setLoading(true);

    const novoArtista = {
      nomeArtista,
      generoMusical,
      fkGrupoMusical: pertenceAGrupo ? fkGrupoMusical : null,
      fkUtilizador: user?.codUtilizador,
    };
    const editArtista = {
      codArtista: idEditArtista,
      nomeArtista,
      generoMusical,
      fkGrupoMusical: pertenceAGrupo ? fkGrupoMusical : null,
      fkUtilizador: codUtilizador,
    };

    try {
      let response;
      if (idEditArtista) {
        // Edit existing artista
        response = await service.artista.update(editArtista);
      } else {
        // Create new artista
        response = await service.artista.add(novoArtista);
      }

      if (response?.status === 201 || response?.status === 200) {
        setMsgDoAlert(`Artista ${idEditArtista ? "Atualizado" : "Criado"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditArtista) {
          setNomeArtista("");
          setGeneroMusical("");
          setFkGrupoMusical("");
          setPertenceAGrupo(false);
        }
      } else {
        setMsgDoAlert(`Falha na ${idEditArtista ? "Atualização" : "Criação"} do Artista, Tente Novamente!`);
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
              <h1>{idEditArtista !== undefined ? `Editar Artista` : "Criar Novo Artista"}</h1>
              <p className="text-body-secondary">Atenção aos campos obrigatórios *</p>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Nome do Artista"
                  autoComplete="nome-artista"
                  value={nomeArtista}
                  onChange={(e) => setNomeArtista(e.target.value)}
                  required
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilMusicNote} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Gênero Musical"
                  autoComplete="genero-musical"
                  value={generoMusical}
                  onChange={(e) => setGeneroMusical(e.target.value)}
                  required
                />
              </CInputGroup>

              <CFormCheck
                id="pertenceAGrupo"
                label="Pertence a um grupo musical?"
                checked={pertenceAGrupo}
                onChange={(e) => setPertenceAGrupo(e.target.checked)}
                className="mb-3"
              />

              {pertenceAGrupo && (
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
                <CButton color="success" onClick={handleAddArtista}>
                  {loading ? <CSpinner size="sm" /> : idEditArtista ? 'Atualizar Artista' : 'Criar Artista'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ConfigArtista;
