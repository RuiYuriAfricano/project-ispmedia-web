import React, { useEffect, useState } from 'react';
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
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CAvatar,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { cilPen, cilPeople, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { service } from './../../services';

const Utilizadores = () => {
  const [utilizadores, setUtilizadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define the number of items per page

  useEffect(() => {
    const fetchUtilizadores = async () => {
      try {
        const response = await service.auth.listar();
        setUtilizadores(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUtilizadores();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este utilizador?");
    if (confirmDelete) {
      try {
        await service.auth.excluir(id);
        setUtilizadores(utilizadores.filter((utilizador) => utilizador.codUtilizador !== id));
      } catch (err) {
        console.error('Erro ao excluir o utilizador:', err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedutilizadores = utilizadores.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Listagem dos utilizadores</strong>

            </CCardHeader>
            <CCardBody>
              <CTable className="text-center" align="middle" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="text-center" scope="col"><CIcon icon={cilPeople} /></CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Username</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Telefone</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">Operações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedutilizadores.map((utilizador, index) => {
                    if (utilizador.codUtilizador !== user.codUtilizador && utilizador.estado !== 'excluido') {
                      return (
                        <CTableRow key={utilizador.codUtilizador}>
                          <CTableHeaderCell scope="row"><CAvatar size="md" src={"http://localhost:3333/utilizador/download/" + utilizador?.username} status='success' /></CTableHeaderCell>
                          <CTableDataCell>{utilizador.username}</CTableDataCell>
                          <CTableDataCell>{utilizador.email}</CTableDataCell>
                          <CTableDataCell>{utilizador.telefone}</CTableDataCell>
                          <CTableDataCell>{utilizador.estado}</CTableDataCell>
                          <CTableDataCell>

                            <Link onClick={() => handleDelete(utilizador.codUtilizador)}><CIcon icon={cilTrash} /></Link>

                          </CTableDataCell>
                        </CTableRow>
                      )
                    }
                  }

                  )}
                </CTableBody>
              </CTable>
              <CPagination align="center" className="mt-3">
                <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </CPaginationItem>
                {[...Array(Math.ceil(utilizadores.length / itemsPerPage)).keys()].map(number => (
                  <CPaginationItem
                    key={number + 1}
                    active={currentPage === number + 1}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === Math.ceil(utilizadores.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                  Próxima
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


    </>
  );
};

export default Utilizadores;
