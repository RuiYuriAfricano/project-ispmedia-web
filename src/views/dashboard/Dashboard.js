import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import "./style/dashboard.css"

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

// Importando as músicas do diretório musics
import music1 from './musicas/Cough.mp3';
import music2 from './musicas/Dam_sio_Brothers_Button_Rose_Ney_Chiqui_-_Viagemalcsv.mp3';
import music3 from './musicas/Kizz-Daniel-Buga-ft.-Tekno.mp3';
import music4 from './musicas/Rihanna_-_Lift_Me_Up_CeeNaija.com_.mp3';
import music5 from './musicas/ya_levis_amour_audio_mp3_3344.mp3';
import music6 from './musicas/Ghost __ TrendyBeatz.com.mp3';

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
            <div className="video-card mb-3" key={index}>
              <div className="video-thumbnail">
                <video controls width="500" height="300"> {/* Definindo altura e largura */}
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-details">
                <h5>{video.title}</h5>
                <p>Author: {video.author}</p>
                <p>Year: {video.year}</p>
              </div>
            </div>
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
      author: 'Author 1',
      year: '2023',
      cover: cover1,
      url: music1, // Variável para a URL da música
    },
    {
      title: 'Dam_sio_Brothers_Button_Rose_Ney_Chiqui_-_Viagemalcsv',
      author: 'Author 2',
      year: '2022',
      cover: cover2,
      url: music2, // Variável para a URL da música
    },
    {
      title: 'Kizz-Daniel-Buga-ft.-Tekno',
      author: 'Author 3',
      year: '2021',
      cover: cover3,
      url: music3, // Variável para a URL da música
    },
    {
      title: 'Rihanna_-_Lift_Me_Up_CeeNaija.com_',
      author: 'Author 4',
      year: '2020',
      cover: cover4,
      url: music4, // Variável para a URL da música
    },
    {
      title: 'ya_levis_amour_audio_mp3_3344',
      author: 'Author 5',
      year: '2019',
      cover: cover5,
      url: music5, // Variável para a URL da música
    },
    {
      title: 'Ghost',
      author: 'Author 6',
      year: '2018',
      cover: cover6,
      url: music6, // Variável para a URL da música
    },
  ];

  return (
    <CCol md={6}>
      <CCard className="mb-4">
        <CCardHeader>Músicas Recentes</CCardHeader>
        <CCardBody>
          {musics.map((music, index) => (
            <div className="music-card mb-3" key={index}>
              <div className="music-thumbnail">
                <img src={music.cover} alt={music.title} width="230" height="150" /> {/* Definindo altura e largura */}
                <audio controls>
                  <source src={music.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="music-details">
                <h5>{music.title}</h5>
                <p>Author: {music.author}</p>
                <p>Year: {music.year}</p>
              </div>
            </div>
          ))}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

const Dashboard = () => {
  return (
    <CRow>
      <VideoList />
      <MusicList />
    </CRow>
  );
};

export default Dashboard;
