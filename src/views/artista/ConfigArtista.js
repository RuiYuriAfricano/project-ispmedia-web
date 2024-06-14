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

const ConfigArtista = ({ artista, onSave, closeModal }) => {
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

    if (artista) {
      setNomeArtista(artista.nomeArtista);
      setGeneroMusical(artista.generoMusical);
      setFkGrupoMusical(artista.fkGrupoMusical);
      setCodUtilizador(artista.fkUtilizador);
      setPertenceAGrupo(!!artista.fkGrupoMusical);
    }
  }, [artista]);

  const handleAddArtista = async () => {
    const emptyFields = isAllFieldsFilled();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }

    setLoading(true);

    const novoArtista = {
      nomeArtista,
      generoMusical,
      fkGrupoMusical: pertenceAGrupo ? fkGrupoMusical : null,
      fkUtilizador: user?.codUtilizador,
    };
    const editArtista = {
      codArtista: artista?.codArtista,
      nomeArtista,
      generoMusical,
      fkGrupoMusical: pertenceAGrupo ? fkGrupoMusical : null,
      fkUtilizador: user?.codUtilizador,
    };

    try {
      let response;
      if (artista) {
        response = await service.artista.update(editArtista);
      } else {
        response = await service.artista.add(novoArtista);
      }

      if (response) {
        setMsgDoAlert(`Artista ${artista ? "Atualizado" : "Criado"} com Sucesso!`);
        setCorDoAlert("success");
        setTimeout(() => {
          setMsgDoAlert("");
          onSave(response.data);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${artista ? "Atualização" : "Criação"} do Artista, Tente Novamente!`);
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

    if (nomeArtista.trim() === '') {
      emptyFields.push('Nome do Artista');
    }
    if (generoMusical.trim() === '') {
      emptyFields.push('Genêro Musical');
    }
    if (pertenceAGrupo && !fkGrupoMusical) {
      emptyFields.push('Grupo Musical');
    }

    return emptyFields;
  };

  return (
    <CForm>
      {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
      <h1>Artista</h1>
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

        <CFormSelect
          value={generoMusical}
          onChange={(e) => setGeneroMusical(e.target.value)}
        >
          <option value="">Selecione o Gênero Musical</option>
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

      <CRow>
        <CCol xs={6}>
          <CButton color="primary" onClick={handleAddArtista}>
            {loading ? <CSpinner size="sm" /> : 'Salvar'}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default ConfigArtista;
