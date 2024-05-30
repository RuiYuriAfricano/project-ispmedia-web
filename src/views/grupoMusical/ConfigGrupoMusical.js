// components/ConfigGrupoMusical.js
import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormTextarea,
  CTooltip,
  CAlert,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMusicNote, cilHistory, cilCalendar } from '@coreui/icons';
import { service } from './../../services';
import { useParams } from 'react-router-dom';

const ConfigGrupoMusical = () => {
  const { idEditGrupo } = useParams();

  const [nomeGrupoMusical, setNomeGrupoMusical] = useState("");
  const [historia, setHistoria] = useState("");
  const [dataDeCriacao, setDataDeCriacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");

  useEffect(() => {
    if (idEditGrupo) {
      // Fetch the existing grupo musical data
      const fetchGrupoMusical = async () => {
        try {
          const response = await service.grupoMusical.pesquisaporid(idEditGrupo);
          if (response?.status === 200) {
            const grupo = response.data;
            setNomeGrupoMusical(grupo.nomeGrupoMusical);
            setHistoria(grupo.historia);
            setDataDeCriacao(grupo.dataDeCriacao.split('T')[0]);
          } else {
            setMsgDoAlert("Erro ao carregar dados do grupo musical");
            setCorDoAlert("danger");
          }
        } catch (error) {
          setMsgDoAlert("Erro ao conectar com o servidor!");
          setCorDoAlert("danger");
        }
      };
      fetchGrupoMusical();
    }
  }, [idEditGrupo]);

  const handleAddGrupoMusical = async () => {
    setLoading(true);

    const novoGrupo = {
      nomeGrupoMusical,
      historia,
      dataDeCriacao,
    };
    const editGrupo = {
      codGrupoMusical: idEditGrupo,
      nomeGrupoMusical,
      historia,
      dataDeCriacao,
    };

    try {
      let response;
      if (idEditGrupo) {
        // Edit existing grupo musical
        response = await service.grupoMusical.update(editGrupo);
      } else {
        // Create new grupo musical
        response = await service.grupoMusical.add(novoGrupo);
      }

      if (response?.status === 201 || response?.status === 200) {
        setMsgDoAlert(`Grupo Musical ${idEditGrupo ? "Atualizado" : "Criado"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditGrupo) {
          setNomeGrupoMusical("");
          setHistoria("");
          setDataDeCriacao("");
        }
      } else {
        setMsgDoAlert(`Falha na ${idEditGrupo ? "Atualização" : "Criação"} do Grupo Musical, Tente Novamente!`);
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
              <h1>{idEditGrupo !== undefined ? `Editar Grupo Musical` : "Criar Novo Grupo Musical"}</h1>
              <p className="text-body-secondary">Atenção aos campos obrigatórios *</p>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilMusicNote} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Nome do Grupo Musical"
                  autoComplete="nome-grupo-musical"
                  value={nomeGrupoMusical}
                  onChange={(e) => setNomeGrupoMusical(e.target.value)}
                  required
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilHistory} />
                </CInputGroupText>
                <CFormTextarea
                  placeholder="História"
                  autoComplete="historia"
                  value={historia}
                  onChange={(e) => setHistoria(e.target.value)}
                  required
                />
              </CInputGroup>

              <CTooltip content="Selecione a data em que o grupo musical foi criado">
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    placeholder="Data de Criação"
                    autoComplete="data-de-criacao"
                    value={dataDeCriacao}
                    onChange={(e) => setDataDeCriacao(e.target.value)}
                    required
                  />
                </CInputGroup>
              </CTooltip>

              <div className="d-grid">
                <CButton color="success" onClick={handleAddGrupoMusical}>
                  {loading ? <CSpinner size="sm" /> : idEditGrupo ? 'Atualizar Grupo Musical' : 'Criar Grupo Musical'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ConfigGrupoMusical;
