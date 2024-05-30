import React, { useState } from 'react';
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

const NovoGrupoMusical = () => {
  const [nomeGrupoMusical, setNomeGrupoMusical] = useState("");
  const [historia, setHistoria] = useState("");
  const [dataDeCriacao, setDataDeCriacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");

  const handleAddGrupoMusical = async () => {
    setLoading(true);

    const novoGrupo = {
      nomeGrupoMusical,
      historia,
      dataDeCriacao,
    };

    try {
      const response = await service.grupoMusical.add(novoGrupo);
      if (response?.status === 201) {
        setMsgDoAlert("Grupo Musical Criado Com Sucesso!");
        setCorDoAlert("success");
        setNomeGrupoMusical("");
        setHistoria("");
        setDataDeCriacao("");
      } else {
        setMsgDoAlert("Falha na Criação do Grupo Musical, Tente Novamente!");
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
              <h1>Criar Novo Grupo Musical</h1>
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
                  {loading ? <CSpinner size="sm" /> : 'Criar Grupo Musical'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NovoGrupoMusical;
