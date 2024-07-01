import React from 'react';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter } from '@coreui/react';
import { cilWifiSignal3 } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPlayer from 'react-player';
import { Navigate } from 'react-router-dom';
import radioStationsData from './radioStations.json';
import { isNullOrUndef } from 'chart.js/helpers';

// Mapear ícones para que possam ser usados dinamicamente
const icons = {
  cilWifiSignal3,
};

const EstacoesRadio = () => {
  if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/login" />;
  }

  // Adicionar as imagens mapeadas às estações de rádio
  const radioStations = radioStationsData.map((station) => ({
    ...station,
    icon: icons[station.icon], // Atribuir o ícone correto
  }));

  // Agrupar estações por país
  const groupedByCountry = radioStations.reduce((acc, station) => {
    if (!acc[station.pais]) {
      acc[station.pais] = [];
    }
    acc[station.pais].push(station);
    return acc;
  }, {});

  const cardStyle = {
    marginBottom: '2rem',
    textAlign: 'center',
    width: '290px',
  };

  return (
    <>
      {Object.keys(groupedByCountry).map((country) => (
        <div key={country}>
          <h3 style={{ textAlign: 'center', margin: '2rem 0' }}>{country}</h3>
          <CRow className="justify-content-center mt-5">
            {groupedByCountry[country].map((station, index) => (
              <CCol xl='3' sm="6" md="4" key={index}>
                <CCard style={cardStyle}>
                  <CCardHeader>
                    <h5>{station.name}</h5>
                  </CCardHeader>
                  <CCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={station.image} alt={station.name} style={{ marginBottom: '1rem', width: '170px', height: '110px', borderRadius: '5px' }} />
                    <ReactPlayer url={station.link} playing={false} controls={true} width="100%" height="50px" />
                  </CCardBody>
                  <CCardFooter>
                    <p></p>
                    <p>{station.frequencia}</p>
                    <p>{station.pais}</p>
                  </CCardFooter>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </div>
      ))}
    </>
  );
};

export default EstacoesRadio;
