import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton
} from '@coreui/react';
import { cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';

const Album = () => {

  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbuns = async () => {
      try {
        const response = await service.album.listar();
        setAlbuns(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAlbuns();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este álbum?");
    if (confirmDelete) {
      try {
        await service.album.excluir(id);
        setAlbuns(albuns.filter(album => album.codAlbum !== id));
      } catch (err) {
        console.error('Erro ao excluir o álbum:', err);
      }
    }
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Listagem dos Álbuns</strong>
            <Link to="/configAlbum">
              <CButton color="primary" role="button">
                Novo Álbum
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Título</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descrição</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Editora</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Data de Lançamento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Artista/Grupo Musical</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Capa</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Utilizador</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Operações</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {albuns.map((album, index) => (
                  <CTableRow key={album.codAlbum}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{album.tituloAlbum}</CTableDataCell>
                    <CTableDataCell>{album.descricao}</CTableDataCell>
                    <CTableDataCell>{album.editora}</CTableDataCell>
                    <CTableDataCell>{formatarData(album.dataLancamento)}</CTableDataCell>

                    <CTableDataCell>{album.artista ? `Artista: ${album.artista.nomeArtista}` : `Grupo Musical: ${album.grupoMusical.nomeGrupoMusical}`}</CTableDataCell>
                    <CTableDataCell><img src={"http://localhost:3333/album/downloadCapa/" + album.codAlbum + "?destination=C:/ISPMediaCapasAlbum"} alt="Capa do Álbum" style={{ width: '50px' }} /></CTableDataCell>
                    <CTableDataCell>{album.registadopor.username}</CTableDataCell>
                    <CTableDataCell>
                      <CDropdown>
                        <CDropdownToggle color="secondary">Escolha a Operação</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem><Link to={`/configAlbum/${album.codAlbum}`}>Editar</Link></CDropdownItem>
                          <CDropdownItem onClick={() => handleDelete(album.codAlbum)}>Excluir</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Album;
