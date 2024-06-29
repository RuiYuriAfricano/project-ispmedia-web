// SearchResults.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SearchResults.css'
import { service } from './../../services';
import { isNumber } from 'chart.js/helpers';
import { useNavigate } from 'react-router-dom'; // Import useNavigate



const SearchResults = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { query } = useParams();
    const [searchResults2, setSearchResults2] = useState([])

    const handleSearch = async () => {

        // Simulate a search request to get videos
        const response = await service.album.pesquisarVideosMusicasEAlbunsDoGrupoPorTitulo(query);
        setSearchResults2(response.data.success ? response.data.data : []);
        console.log(response.data.data)

    };
    useEffect(() => {
        handleSearch()
    }, [query])

    const timeElapsed = (date) => {
        const now = new Date();
        const past = new Date(date);

        const diffInMs = now - past;

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44); // Approximation
        const years = Math.floor(days / 365.25); // Approximation

        if (years > 0) {
            return { value: years, unit: 'anos' };
        } else if (months > 0) {
            return { value: months, unit: 'meses' };
        } else if (days > 0) {
            return { value: days, unit: 'dias' };
        } else if (hours > 0) {
            return { value: hours, unit: 'horas' };
        } else if (minutes > 0) {
            return { value: minutes, unit: 'minutos' };
        } else {
            return { value: seconds, unit: 'segundos' };
        }
    };

    const handleMouseEnter = (event, result) => {
        if (result.tipo === 'video') {
            const videoElement = event.currentTarget.querySelector('.video-preview');
            const thumbnailElement = event.currentTarget.querySelector('.thumbnail');
            thumbnailElement.style.display = 'none';
            videoElement.style.display = 'block';
            videoElement.play();
        }
    };

    const handleMouseLeave = (event, result) => {
        if (result.tipo === 'video') {
            const videoElement = event.currentTarget.querySelector('.video-preview');
            const thumbnailElement = event.currentTarget.querySelector('.thumbnail');
            thumbnailElement.style.display = 'block';
            videoElement.style.display = 'none';
            videoElement.pause();
            videoElement.currentTime = 0; // Reset video to start
        }
    };

    const handleClick = (result) => { // Function to handle click
        navigate(`/videoReproducao/${result.codigo}`);
    };

    const handleClickMusica = (result) => { // Function to handle click
        navigate(`/musicaReproducao/${result.codigo}`);
    };
    const handleClickAlbum = (result) => { // Function to handle click
        navigate(`/albumReproducao/${result.codigo}`);
    };

    return (
        <div className="search-results">
            <h4>Resultados para "{query}"</h4>
            <div className="results-list">
                {searchResults2.map((result, index) => {
                    if (result.tipo === 'video') {
                        return (
                            <div
                                key={result.codigo + "-" + result.tipo}
                                className="result-item"
                                onClick={() => handleClick(result)}
                                onMouseEnter={(e) => handleMouseEnter(e, result)}
                                onMouseLeave={(e) => handleMouseLeave(e, result)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className="thumbnail"
                                    src={`https://localhost:3333/video/${result.codigo}/thumbnail`}
                                    alt={result.titulo}
                                />
                                {result.tipo === 'video' && (
                                    <video
                                        className="video-preview"
                                        src={`https://localhost:3333/video/downloadVideo/${result.codigo}`}
                                        style={{ display: 'none', width: '500px', height: '300px', borderRadius: '10px' }}
                                        muted
                                    />
                                )}
                                <div className="result-info">
                                    <img className="author-image" src={'https://localhost:3333/utilizador/download/' + 'RuiMalemba'} alt={result.fkArtista ? result.artista.nomeArtita : result.grupoMusical.nomeGrupoMusical} />
                                    <div className="result-details">
                                        <h3>{result.titulo}</h3>
                                        <p className="author-name">{isNumber(result.fkArtista) ? result.artista.nomeArtista : result.grupoMusical.nomeGrupoMusical}</p>
                                        <p className="author-name">Mídia: Video</p>
                                        <p className="views-timestamp">6.7M views • {"Há " + timeElapsed(result.dataDeRegisto).value + " " + timeElapsed(result.dataDeRegisto).unit}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if (result.tipo === 'musica') {
                        return (
                            <div key={result.codigo + '-' + result.tipo}
                                onClick={() => handleClickMusica(result)}
                                className="result-item">
                                <img className="thumbnail" src={`https://localhost:3333/musica/downloadCapa/${result.codigo}`} alt={result.titulo} />
                                <div className="result-info">
                                    <img className="author-image" src={'https://localhost:3333/utilizador/download/' + 'RuiMalemba'} alt={result.fkArtista ? result.artista.nomeArtita : result.grupoMusical.nomeGrupoMusical} />
                                    <div className="result-details">
                                        <h3>{result.titulo}</h3>
                                        <p className="author-name">{isNumber(result.fkArtista) ? result.artista.nomeArtista : result.grupoMusical.nomeGrupoMusical}</p>
                                        <p className="author-name">Mídia: Música</p>
                                        <p className="views-timestamp">6.7M views • {"Há " + timeElapsed(result.dataDeRegisto).value + " " + timeElapsed(result.dataDeRegisto).unit}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if (result.tipo === 'album') {
                        return (
                            <div key={result.codigo + '-' + result.tipo}
                                onClick={() => handleClickAlbum(result)}
                                className="result-item">
                                <img className="thumbnail" src={`https://localhost:3333/album/downloadCapa/${result.codigo}`} alt={result.titulo} />
                                <div className="result-info">
                                    <img className="author-image" src={'https://localhost:3333/utilizador/download/' + 'RuiMalemba'} alt={result.fkArtista ? result.artista.nomeArtita : result.grupoMusical.nomeGrupoMusical} />
                                    <div className="result-details">
                                        <h3>{result.titulo}</h3>
                                        <p className="author-name">{isNumber(result.fkArtista) ? result.artista.nomeArtista : result.grupoMusical.nomeGrupoMusical}</p>
                                        <p className="author-name">Album</p>
                                        <p className="views-timestamp">6.7M views • {"Há " + timeElapsed(result.dataDeRegisto).value + " " + timeElapsed(result.dataDeRegisto).unit}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }

                )}
            </div>
        </div>
    );
};

export default SearchResults;
