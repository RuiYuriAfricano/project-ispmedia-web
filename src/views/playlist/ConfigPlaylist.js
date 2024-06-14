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
  CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMusicNote, cilHistory, cilCalendar } from '@coreui/icons';
import { service } from './../../services';

const ConfigPlaylist = ({ idEditPlaylist, onClose }) => {
  const [nomePlayList, setNomePlayList] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [playlistPublica, setPlaylistPublica] = useState(false);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    if (idEditPlaylist) {
      const fetchPlaylist = async () => {
        try {
          const response = await service.playlist.pesquisaporid(idEditPlaylist);
          if (response?.status === 200) {
            const playlist = response.data;
            setNomePlayList(playlist.nomePlayList);
            setPlaylistPublica(playlist.tipoPlayList === 'pública' ? true : false)
          } else {
            setMsgDoAlert("Erro ao carregar dados da playlist");
            setCorDoAlert("danger");
          }
        } catch (error) {
          setMsgDoAlert("Erro ao conectar com o servidor!");
          setCorDoAlert("danger");
        }
      };
      fetchPlaylist();
    }
  }, [idEditPlaylist]);

  const handleAddPlaylist = async () => {
    const emptyFields = isAllFieldsFilled();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }
    setLoading(true);

    const novaPlaylist = {
      nomePlayList,
      tipoPlayList: playlistPublica ? "pública" : "privada",
      fkUtilizador: user?.codUtilizador,
    };
    const editPlaylist = {
      codPlayList: idEditPlaylist,
      nomePlayList,
      tipoPlayList: playlistPublica ? "pública" : "privada",
    };

    try {
      let response;
      if (idEditPlaylist) {
        response = await service.playlist.update(editPlaylist);
      } else {
        response = await service.playlist.add(novaPlaylist);
      }

      if (response?.status === 201 || response?.status === 200) {
        setMsgDoAlert(`Playlist ${idEditPlaylist ? "Atualizada" : "Criada"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditPlaylist) {
          setNomePlayList("");
        }
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${idEditPlaylist ? "Atualização" : "Criação"} da PlayList, Tente Novamente!`);
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
    if (nomePlayList.trim() === '') {
      emptyFields.push('Nome da Playlist');
    }
    return emptyFields;
  };

  return (
    <CCard className="mx-4">
      <CCardBody className="p-4">
        <CForm>
          <h1>Playlist</h1>
          <p className="text-medium-emphasis">Preencha os detalhes da PlayList</p>
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilMusicNote} />
            </CInputGroupText>
            <CFormInput
              placeholder="Nome da Playlist"
              value={nomePlayList}
              onChange={(e) => setNomePlayList(e.target.value)}
            />
          </CInputGroup>
          <CFormCheck
            id="publica"
            label="Playlist pública?"
            checked={playlistPublica}
            onChange={(e) => setPlaylistPublica(e.target.checked)}
            className="mb-3"
          />
          <CRow>
            <CCol xs={6}>
              <CButton color="primary" className="px-4" onClick={handleAddPlaylist} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Salvar'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ConfigPlaylist;
