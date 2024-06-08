import React from 'react';
import { Navigate } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CCardImage, CCardFooter, CButton } from '@coreui/react';
import "./style/dashboard.css";

// Importando os vídeos do diretório medias
import video1 from './videos/Sandra Mbuyi - Goodness (clip officiel).mp4';
import video2 from './videos/Grace Zola - Deus de Promessas (Official Music Video).mp4';
import video3 from './videos/Rosny Kayiba - Mon meilleur ami ( Clip officiel).mp4';
import video4 from './videos/Grace Zola - Oza Monene feat. Ruth Kuniasa (Official Music Video).mp4';
import video5 from './videos/Rhema Loseke - Yaya ( Clip Officiel).mp4';
import video6 from './videos/Eva Rapdiva x Deezy - Incondicional _ Prod Teo No Beat.mp4';

// Importando as imagens das capas das músicas
import cover1 from './capas/Capa1.jpg';
import cover2 from './capas/Capa2.jpeg';
import cover3 from './capas/Capa3.jpg';
import cover4 from './capas/Capa4.jpg';
import cover5 from './capas/Capa5.jpg';
import cover6 from './capas/Capa6.jpg';
import cover7 from './capas/Capa7.jpeg';
import cover8 from './capas/Capa8.jpeg';
import cover9 from './capas/Capa9.jpeg';
import cover10 from './capas/Capa10.jpeg';
import cover11 from './capas/Capa11.jpeg';
import cover12 from './capas/Capa12.jpeg';

// Importando as músicas do diretório musics
import music1 from './musicas/Cough.mp3';
import music2 from './musicas/Dam_sio_Brothers_Button_Rose_Ney_Chiqui_-_Viagemalcsv.mp3';
import music3 from './musicas/Kizz-Daniel-Buga-ft.-Tekno.mp3';
import music4 from './musicas/Rihanna_-_Lift_Me_Up_CeeNaija.com_.mp3';
import music5 from './musicas/ya_levis_amour_audio_mp3_3344.mp3';
import music6 from './musicas/Ghost __ TrendyBeatz.com.mp3';
import { isNullOrUndef } from 'chart.js/helpers';

const VideoList = () => {
  const videos = [
    {
      title: 'Rosny Kayiba - Mon meilleur ami',
      author: 'Rosny Kayiba',
      year: '2021',
      url: video3,
    },
    {
      title: 'Sandra Mbuyi - Goodness',
      author: 'Sandra Mbuyi',
      year: '2023',
      url: video1,
    },
    {
      title: 'Grace Zola - Deus de Promessas',
      author: 'Grace Zola',
      year: '2022',
      url: video2,
    },
    {
      title: 'Grace Zola - Oza Monene feat. Ruth Kuniasa',
      author: 'Grace Zola',
      year: '2020',
      url: video4,
    },
    {
      title: 'Rhema Loseke - Yaya',
      author: 'Rhema Loseke',
      year: '2019',
      url: video5,
    },
    {
      title: 'Eva Rapdiva x Deezy - Incondicional _ Prod Teo No Beat',
      author: 'Eva Rapdiva',
      year: '2018',
      url: video6,
    },
  ];
  return (
    <CCol md={6}>
      <CCard className="mb-4">
        <CCardHeader>Vídeos Recentes</CCardHeader>
        <CCardBody>

          {videos.map((video, index) => (
            <CCard className="video-card mb-3" key={index}>

              <CCardBody>
                <div className="video-thumbnail">
                  <video controls width="100%" height="300">
                    {/* Definindo altura e largura */}
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

              </CCardBody>
              <CCardFooter>

                <div className="video-details" style={{}}>
                  <h5 color='secondary'>{video.title}</h5>
                  <p>{video.author}, {video.year}</p>
                </div>
              </CCardFooter>
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const MusicList = () => {
  const musics = [
    {
      title: 'Cough',
      author: 'Kizz Daniel',
      year: '2023',
      cover: cover1,
      url: music1, // Variável para a URL da música
    },
    {
      title: 'Viagem',
      author: 'Damásio Brothers ft Button Rose',
      year: '2022',
      cover: cover2,
      url: music2, // Variável para a URL da música
    },
    {
      title: 'Buga',
      author: 'Kizz Daniel-ft.-Tekno',
      year: '2021',
      cover: cover3,
      url: music3, // Variável para a URL da música
    },
    {
      title: 'Lift_Me_Up_',
      author: 'Rihanna_-_',
      year: '2020',
      cover: cover4,
      url: music4, // Variável para a URL da música
    },
    {
      title: '_amour_',
      author: 'ya_levis',
      year: '2019',
      cover: cover5,
      url: music5, // Variável para a URL da música
    },
    {
      title: 'Ghost',
      author: 'Justin Bieber',
      year: '2018',
      cover: cover6,
      url: music6, // Variável para a URL da música
    },
  ];

  return (
    <CCol md={3} >
      <CCard className="mb-4" >
        <CCardHeader>Músicas Recentes</CCardHeader>
        <CCardBody className='pt-1'>
          {musics.map((music, index) => (
            <CCard className="music-card mb-3" key={index}>
              <CCardHeader>
                <div className="music-details">
                  <h5>{music.title}</h5>
                  <p>{music.author}, {music.year}</p>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="music-thumbnail">
                  <CCardImage src={music.cover} alt={music.title} width="230" height="150" />
                  {/* Definindo altura e largura */}

                </div>
              </CCardBody>
              <CCardFooter style={{ textAlign: 'center', paddingBottom: '18px' }}>
                <div style={{ width: '100%', height: '45px', marginTop: '10px', overflow: 'hidden' }}>
                  <audio controls style={{ width: '100%', height: '100%' }}>
                    <source src={music.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </CCardFooter>
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const AlbumList = () => {
  const albums = [
    {
      title: 'Album - Pro2',
      author: 'Prodigio',
      year: '2023',
      cover: cover12,
    },
    {
      title: 'Album - NGA',
      author: 'NGA',
      year: '2022',
      cover: cover11,
    },
    {
      title: 'Album - Yola',
      author: 'Yola Semedo',
      year: '2021',
      cover: cover7,
    },
    {
      title: 'Lift Me Up - Pro2',
      author: 'Prodigio',
      year: '2020',
      cover: cover10,
    },
    {
      title: 'Album - Matias',
      author: 'Matias Damásio',
      year: '2019',
      cover: cover8,
    },
    {
      title: 'Album - Chelsea',
      author: 'Chelsea Dinorath',
      year: '2018',
      cover: cover9,
    },
  ];

  return (
    <CCol md={3}>
      <CCard className="mb-4">
        <CCardHeader>Álbuns Recentes</CCardHeader>
        <CCardBody>
          {albums.map((album, index) => (
            <CCard className="album-card mb-3" key={index}>
              <CCardHeader>
                <div className="album-details pt-2">
                  <h5>{album.title}</h5>
                  <p>{album.author}, {album.year}</p>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="album-thumbnail">
                  <CCardImage src={album.cover} alt={album.title} width="230" height="150" />
                  {/* Definindo altura e largura */}
                </div>

              </CCardBody>
              <CCardFooter style={{ textAlign: 'center', padding: '13px' }}>
                <CButton color='secondary' style={{ padding: '8px', margin: '2.5px', color: '#000' }} > Mais Detalhes</CButton>
              </CCardFooter>
            </CCard>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const Dashboard = () => {
  if (isNullOrUndef(localStorage.getItem("loggedUser"))) {
    return <Navigate to="/login"></Navigate>;
  }
  return (
    <CRow>
      <VideoList />
      <MusicList />
      <AlbumList />
    </CRow>
  );
};

export default Dashboard;
