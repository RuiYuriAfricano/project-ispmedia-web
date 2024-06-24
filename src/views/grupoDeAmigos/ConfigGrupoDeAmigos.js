import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CFormSelect,
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMusicNote, cilUser, cilTrash } from '@coreui/icons';
import { service } from './../../services';

const ConfigGrupoDeAmigos = ({ idEditGrupo, onClose }) => {
  const [nomeDoGrupo, setNomeDoGrupo] = useState("");
  const [dataDeCriacao, setDataDeCriacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [codUtilizador, setCodUtilizador] = useState(-1);
  const [utilizadores, setUtilizadores] = useState([]);
  const [membros, setMembros] = useState([]);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [utilizadoresAdicionados, setUtilizadoresAdicionados] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    if (idEditGrupo) {
      const fetchGrupo = async () => {
        try {
          const response = await service.grupoDeAmigos.pesquisaporid(idEditGrupo);
          if (response?.status === 200) {
            const grupo = response.data;
            setNomeDoGrupo(grupo.nomeDoGrupo);
            setDataDeCriacao(grupo.dataDeCriacao.split('T')[0]);
            setCodUtilizador(grupo.fkCriador);
            setUtilizadoresAdicionados(grupo.utilizadores || []);
          } else {
            setMsgDoAlert("Erro ao carregar dados do grupo de amigos");
            setCorDoAlert("danger");
          }
        } catch (error) {
          setMsgDoAlert("Erro ao conectar com o servidor!");
          setCorDoAlert("danger");
        }
      };
      fetchGrupo();
    }
  }, [idEditGrupo]);

  useEffect(() => {
    const fetchUtilizadores = async () => {
      try {
        const response = await service.auth.listar();
        if (response?.status === 201) {
          setUtilizadores(response.data);
        } else {
          setMsgDoAlert("Erro ao carregar utilizadores");
          setCorDoAlert("danger");
        }
      } catch (error) {
        setMsgDoAlert("Erro ao conectar com o servidor!");
        setCorDoAlert("danger");
      }
    };
    fetchUtilizadores();
  }, []);

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const response = await service.membrosDosGrupos.listar();
        if (response?.status === 201) {
          const membrosFiltrados = response.data.filter((membro) => parseInt(membro.fkGrupoDeAmigos) === parseInt(idEditGrupo));
          setMembros(membrosFiltrados);
        } else {
          setMsgDoAlert("Erro ao carregar membros do grupo");
          setCorDoAlert("danger");
        }
      } catch (error) {
        setMsgDoAlert("Erro ao conectar com o servidor!");
        setCorDoAlert("danger");
      }
    };
    fetchMembros();
  }, [idEditGrupo]);


  const handleAddUtilizador = () => {
    if (utilizadoresAdicionados.length + membros.length >= 3) {
      setMsgDoAlert("O grupo não pode ter mais de 3 utilizadores");
      setCorDoAlert("danger");
      return;
    }

    const utilizador = utilizadores.find(u => u.codUtilizador === parseInt(utilizadorSelecionado));
    if (!utilizador) {
      setMsgDoAlert("Por favor, selecione um utilizador válido");
      setCorDoAlert("danger");
      return;
    }

    const novoUtilizador = {
      codUtilizador: utilizador.codUtilizador,
      username: utilizador.username,
      isOwner: isOwner
    };


    setUtilizadoresAdicionados([...utilizadoresAdicionados, novoUtilizador]);
    setUtilizadores(utilizadores.filter((item) => item.codUtilizador !== parseInt(utilizadorSelecionado)))
    setUtilizadorSelecionado("");
    setIsOwner(false);
    setMsgDoAlert("");
    setCorDoAlert("");
  };

  const handleRemoveUtilizador = (codUtilizador) => {
    setUtilizadoresAdicionados(utilizadoresAdicionados.filter(u => u.codUtilizador !== codUtilizador));
  };

  const handleExcluirMembro = async (codMembro) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir o membro deste grupo?");
    if (confirmDelete) {
      try {

        await service.membrosDosGrupos.excluir(codMembro);

        setMembros(membros.filter(membro => !(membro.codMembro === codMembro)));
      } catch (err) {
        console.error('Erro ao excluir membro do grupo:', err);
      }
    }
  };

  const handleAddGrupoDeAmigos = async () => {
    const emptyFields = isAllFieldsFilled();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }
    setLoading(true);

    const novoGrupo = {
      nomeDoGrupo,
      fkCriador: user?.codUtilizador,
    };
    const editGrupo = {
      codGrupoDeAmigos: idEditGrupo,
      nomeDoGrupo,
      fkCriador: codUtilizador,
    };

    try {
      let response;
      if (idEditGrupo) {
        response = await service.grupoDeAmigos.update(editGrupo);

      } else {
        response = await service.grupoDeAmigos.add(novoGrupo);
      }

      if (response?.status === 201 || response?.status === 200) {

        await Promise.all(utilizadoresAdicionados.map(item => {

          return (
            service.membrosDosGrupos.add({
              "fkGrupoDeAmigos": Number(response.data.codGrupoDeAmigos),
              "fkUtilizador": Number(item.codUtilizador),
              "isOwner": item.isOwner ? 1 : 0,
              "estado": 1,

            })
          )

        }));

        await Promise.all(utilizadoresAdicionados.map(item => {

          return (
            service.notificacao.add({
              "fkUtilizador": Number(item.codUtilizador),
              "utilizadorOrigem": user.username,
              "textoNotificacao": item.isOwner ? "Você foi adicionado ao grupo " + nomeDoGrupo + " como owner." : "Você foi adicionado <br> ao grupo " + nomeDoGrupo,

            })
          )

        }));



        setMsgDoAlert(`Grupo de Amigos ${idEditGrupo ? "Atualizado" : "Criado"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditGrupo) {
          setNomeDoGrupo("");
          setUtilizadoresAdicionados([]);
        }
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${idEditGrupo ? "Atualização" : "Criação"} do Grupo de Amigos, Tente Novamente!`);
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
    if (nomeDoGrupo.trim() === '') {
      emptyFields.push('Nome do grupo de amigos');
    }
    return emptyFields;
  };

  return (
    <CCard className="mx-4">
      <CCardBody className="p-4">
        <CForm>
          <h1>Grupo de Amigos</h1>
          <p className="text-medium-emphasis">Preencha os detalhes do grupo</p>
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilMusicNote} />
            </CInputGroupText>
            <CFormInput
              placeholder="Nome do grupo de amigos"
              value={nomeDoGrupo}
              onChange={(e) => setNomeDoGrupo(e.target.value)}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormSelect
              value={utilizadorSelecionado}
              onChange={(e) => setUtilizadorSelecionado(e.target.value)}
            >
              <option value="">Selecione um utilizador</option>
              {utilizadores.map(utilizador => {
                const search = membros.find(v => v.fkUtilizador === utilizador.codUtilizador);

                if (utilizador?.codUtilizador !== user?.codUtilizador && !search) {
                  return (
                    <option key={utilizador.codUtilizador} value={utilizador.codUtilizador}>
                      {utilizador.username}
                    </option>
                  )
                }
              }

              )}
            </CFormSelect>
            <CInputGroupText>
              <CFormCheck
                id="ownerCheckbox"
                label="Owner"
                checked={isOwner}
                onChange={(e) => setIsOwner(e.target.checked)}
              />
            </CInputGroupText>
            <CButton type="button" onClick={handleAddUtilizador}>Adicionar</CButton>
          </CInputGroup>

          <div className="mb-3">
            <h5>Utilizadores adicionados:</h5>
            {membros.length === 0 && <p>Nenhum utilizador adicionado</p>}
            <ul>

              {membros.map((membro) => (
                <li key={membro.codUtilizador}>
                  {membro.utilizador.username} {membro.isOwner === 1 ? '(Owner)' : ''}
                  <CButton
                    type="button"
                    color="danger"
                    size="sm"
                    onClick={() => handleExcluirMembro(membro.codMembro)}
                    className="ms-2"
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </li>
              ))}

              {utilizadoresAdicionados.map((utilizador) => {

                return (
                  <li key={utilizador.codUtilizador}>
                    {utilizador.username} {utilizador.isOwner && '(Owner)'}
                    <CButton
                      type="button"
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveUtilizador(utilizador.codUtilizador)}
                      className="ms-2"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </li>
                )


              })}
            </ul>
          </div>

          <CRow>
            <CCol xs={6}>
              <CButton color="primary" className="px-4" onClick={handleAddGrupoDeAmigos} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Salvar'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ConfigGrupoDeAmigos;
