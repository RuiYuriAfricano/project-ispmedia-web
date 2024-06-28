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

const ConfigListaDePartilha = ({ idEditGrupo, onClose }) => {
  const [nomeDaLista, setNomeDaLista] = useState("");
  const [dataDeCriacao, setDataDeCriacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgDoAlert, setMsgDoAlert] = useState("");
  const [corDoAlert, setCorDoAlert] = useState("");
  const [codUtilizador, setCodUtilizador] = useState(-1);
  const [listas, setListas] = useState([]);
  const [membros, setMembros] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [gruposAdicionados, setGruposAdicionados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedUser"));


  useEffect(() => {
    if (idEditGrupo) {
      const fetchLista = async () => {
        try {
          const response = await service.listaDePartilha.pesquisaporid(idEditGrupo);
          if (response?.status === 200) {
            const lista = response.data;
            setNomeDaLista(lista.nomeDaLista);
            setDataDeCriacao(lista.dataDeCriacao.split('T')[0]);
            setCodUtilizador(lista.fkUtilizador);
            setGruposAdicionados(lista.membrosDaListaDePartilhas || []);
          } else {
            setMsgDoAlert("Erro ao carregar dados da lista de partilha");
            setCorDoAlert("danger");
          }
        } catch (error) {
          setMsgDoAlert("Erro ao conectar com o servidor!");
          setCorDoAlert("danger");
        }
      };
      fetchLista();
    }
  }, [idEditGrupo]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await service.grupoDeAmigos.listar();
        if (response?.status === 201) {
          setGrupos(response.data);
        } else {
          setMsgDoAlert("Erro ao carregar grupos");
          setCorDoAlert("danger");
        }
      } catch (error) {
        setMsgDoAlert("Erro ao conectar com o servidor!");
        setCorDoAlert("danger");
      }
    };
    fetchGrupos();
  }, []);

  const fetchMembros = async () => {
    try {
      const response = await service.membrosDasListas.listar();
      if (response?.status === 201) {
        const membrosFiltrados = response.data.filter((membro) => parseInt(membro.fkListaDePartilha) === parseInt(idEditGrupo));
        setMembros(membrosFiltrados);
      } else {
        setMsgDoAlert("Erro ao carregar membros da lista");
        setCorDoAlert("danger");
      }
    } catch (error) {
      setMsgDoAlert("Erro ao conectar com o servidor!");
      setCorDoAlert("danger");
    }
  };

  useEffect(() => {

    fetchMembros();
  }, [idEditGrupo]);


  const handleAddGrupo = () => {


    const grupo = grupos.find(u => u.codGrupoDeAmigos === parseInt(grupoSelecionado));
    if (!grupo) {
      setMsgDoAlert("Por favor, selecione um grupo válido");
      setCorDoAlert("danger");
      return;
    }

    const novoGrupo = {
      codGrupoDeAmigos: grupo.codGrupoDeAmigos,
      nomeDoGrupo: grupo.nomeDoGrupo,
    };


    setGruposAdicionados([...gruposAdicionados, novoGrupo]);
    setGrupos(grupos.filter((item) => item.codGrupoDeAmigos !== parseInt(grupoSelecionado)))
    setGrupoSelecionado("");
    setMsgDoAlert("");
    setCorDoAlert("");
  };

  const handleRemoveGrupo = (codGrupo) => {
    setGruposAdicionados(gruposAdicionados.filter(u => u.codGrupoDeAmigos !== codGrupo));
  };

  const handleExcluirMembro = async (codMembro) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir o grupo desta lista?");
    if (confirmDelete) {
      try {

        await service.membrosDasListas.excluir(codMembro);

        setMembros(membros.filter(membro => !(membro.codMembroLista === codMembro)));

      } catch (err) {
        console.error('Erro ao excluir grupo da lista:', err);
      }
    }
  };


  const handleAddListaDePartilha = async () => {
    const emptyFields = isAllFieldsFilled();

    if (emptyFields.length > 0) {
      const emptyFieldsMessage = emptyFields.join(', ');
      setMsgDoAlert(`Por favor, preencha os campos: ${emptyFieldsMessage}.`);
      setCorDoAlert('danger');
      return;
    }
    if (gruposAdicionados.length == 0 && !idEditGrupo) {
      setMsgDoAlert(`Por favor, adicione pelomenos um grupo para criar a sua lista.`);
      setCorDoAlert('danger');
      return;
    }
    setLoading(true);

    const novaLista = {
      nomeDaLista,
      fkUtilizador: user?.codUtilizador,
    };
    const editLista = {
      codListaDePartilha: idEditGrupo,
      nomeDaLista,
      fkUtilizador: user?.codUtilizador,
    };

    try {
      let response;
      if (idEditGrupo) {
        response = await service.listaDePartilha.update(editLista);

      } else {
        response = await service.listaDePartilha.add(novaLista);
        console.log(response)
      }

      if (response?.status === 201 || response?.status === 200) {

        await Promise.all(gruposAdicionados.map(item => {

          return (
            service.membrosDasListas.add({
              "fkGrupoDeAmigos": Number(item.codGrupoDeAmigos),
              "fkListaDePartilha": Number(response.data.codListaDePartilha),

            })
          )

        }));

        setMsgDoAlert(`Lista de Partilha ${idEditGrupo ? "Atualizado" : "Criado"} Com Sucesso!`);
        setCorDoAlert("success");
        if (!idEditGrupo) {
          setNomeDaLista("");
          setGruposAdicionados([]);
        }
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        setMsgDoAlert(`Falha na ${idEditGrupo ? "Atualização" : "Criação"} da Lista de Partilha, Tente Novamente!`);
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
    if (nomeDaLista.trim() === '') {
      emptyFields.push('Nome da lista de partilha');
    }
    return emptyFields;
  };

  return (
    <CCard className="mx-4">
      <CCardBody className="p-4">
        <CForm>
          <h1>Lista de Partilha</h1>
          <p className="text-medium-emphasis">Preencha os detalhes da Lista</p>
          {corDoAlert && <CAlert color={corDoAlert}>{msgDoAlert}</CAlert>}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilMusicNote} />
            </CInputGroupText>
            <CFormInput
              placeholder="Nome da lista"
              value={nomeDaLista}
              onChange={(e) => setNomeDaLista(e.target.value)}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormSelect
              value={grupoSelecionado}
              onChange={(e) => setGrupoSelecionado(e.target.value)}
            >
              <option value="">Selecione um grupo</option>
              {grupos.map(grupo => {
                const search = membros.find(v => v.fkGrupoDeAmigos === grupo.codGrupoDeAmigos);

                if (!search) {
                  return (
                    <option key={grupo.codGrupoDeAmigos} value={grupo.codGrupoDeAmigos}>
                      {grupo.nomeDoGrupo}
                    </option>
                  )
                }
              }

              )}
            </CFormSelect>
            <CButton type="button" onClick={handleAddGrupo}>Adicionar</CButton>
          </CInputGroup>

          <div className="mb-3">
            <h5>Grupos adicionados:</h5>
            {membros.length === 0 && <p>Nenhum grupo adicionado</p>}
            <ul>

              {membros.map((membro) => {

                return (
                  <li key={membro.codMembroLista}>
                    {membro.grupoDeAmigos.nomeDoGrupo}
                    <CButton
                      type="button"
                      color="danger"
                      size="sm"
                      onClick={() => handleExcluirMembro(membro.codMembroLista)}
                      className="ms-2"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </li>
                )


              }

              )}

              {gruposAdicionados.map((grupo) => {

                return (
                  <li key={grupo.codGrupoDeAmigos}>
                    {grupo.nomeDoGrupo}
                    <CButton
                      type="button"
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveUtilizador(grupo.codGrupoDeAmigos)}
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
              <CButton color="primary" className="px-4" onClick={handleAddListaDePartilha} disabled={loading}>
                {loading ? <CSpinner size="sm" /> : 'Salvar'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ConfigListaDePartilha;
