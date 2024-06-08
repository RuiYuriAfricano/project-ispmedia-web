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

const ConfigGrupoMusical = ({ idEditGrupo, onClose }) => {
  const [nomeGrupoMusical, setNomeGrupoMusical] = useState("");
  const [historia, setHistoria] = useState("");
  const [dataDeCriacao, setDataDeCriacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [codUtilizador, setCodUtilizador] = useState(-1);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    if (idEditGrupo) {
      const fetchGrupoMusical = async () => {
        try {
          const response = await service.grupoMusical.pesquisaporid(idEditGrupo);
          if (response?.status === 200) {
            const grupo = response.data;
            setNomeGrupoMusical(grupo.nomeGrupoMusical);
            setHistoria(grupo.historia);
            setDataDeCriacao(grupo.dataDeCriacao.split('T')[0]);
            setCodUtilizador(grupo.fkUtilizador);
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
    const emptyFields = isAllFieldsFilled();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }
    setLoading(true);

    const novoGrupo = {
      nomeGrupoMusical,
      historia,
      dataDeCriacao,
      fkUtilizador: user?.codUtilizador,
    };
    const editGrupo = {
      codGrupoMusical: idEditGrupo,
      nomeGrupoMusical,
      historia,
      dataDeCriacao,
      fkUtilizador: codUtilizador,
    };

    try {
      let response;
      if (idEditGrupo) {
        response = await service.grupoMusical.update(editGrupo);
      } else {
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
        setTimeout(() => {
          onClose(true);
        }, 2000);
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

  const isAllFieldsFilled = () => {
    const emptyFields = [];
    if (nomeGrupoMusical.trim() === '') {
      emptyFields.push('Nome do grupo musical');
    }
    if (historia.trim() === '') {
      emptyFields.push('História');
    }
    if (dataDeCriacao.trim() === '') {
      emptyFields.push('Data de Criação');
    }
    return emptyFields;
  };

  return (
    <CCard className="mx-4">
      <CCardBody className="p-4">
        <CForm>
          <h1>Grupo Musical</h1>
          <p className="text-medium-emphasis">Preencha os detalhes do grupo musical</p>
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilMusicNote} />
            </CInputGroupText>
            <CFormInput
              placeholder="Nome do grupo musical"
              value={nomeGrupoMusical}
              onChange={(e) => setNomeGrupoMusical(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilHistory} />
            </CInputGroupText>
            <CFormTextarea
              placeholder="História do grupo"
              value={historia}
              onChange={(e) => setHistoria(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilCalendar} />
            </CInputGroupText>
            <CFormInput
              type="date"
              placeholder="Data de Criação"
              value={dataDeCriacao}
              onChange={(e) => setDataDeCriacao(e.target.value)}
            />
          </CInputGroup>
          <CRow>
            <CCol xs={6}>
              <CButton color="primary" className="px-4" onClick={handleAddGrupoMusical} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Salvar'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ConfigGrupoMusical;
