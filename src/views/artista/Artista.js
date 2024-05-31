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

const Artista = () => {

  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await service.artista.listar();
        setArtistas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchArtistas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este artista?");
    if (confirmDelete) {
      try {
        await service.artista.excluir(id);
        setArtistas(artistas.filter(artista => artista.codArtista !== id));
      } catch (err) {
        console.error('Erro ao excluir o artista:', err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Listagem dos Artistas</strong>
            <Link to="/configArtista">
              <CButton color="primary" role="button">
                Novo Artista
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gênero Musical</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Grupo Musical</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Utilizador</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Operações</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {artistas.map((artista, index) => (
                  <CTableRow key={artista.codArtista}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{artista.nomeArtista}</CTableDataCell>
                    <CTableDataCell>{artista.generoMusical}</CTableDataCell>
                    <CTableDataCell>{artista.grupoMusical?.nomeGrupoMusical}</CTableDataCell>
                    <CTableDataCell>{artista.registadopor?.username}</CTableDataCell>
                    <CTableDataCell>
                      <CDropdown>
                        <CDropdownToggle color="secondary">Escolha a Operação</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem><Link to={`/configArtista/${artista.codArtista}`}>Editar</Link></CDropdownItem>
                          <CDropdownItem onClick={() => handleDelete(artista.codArtista)}>Excluir</CDropdownItem>
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

export default Artista;
