// SearchResults.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './SearchResults.css'

const SearchResults = () => {
    const { query } = useParams();

    // Mock data for search results, replace with actual data fetching logic
    const results = [
        {
            id: 1,
            title: 'Say The Word - Hillsong UNITED - Live in Israel',
            views: '296k views',
            timestamp: '5 years ago',
            image: 'https://img.youtube.com/vi/xyz/0.jpg', // Replace with actual image URL
            author: 'Hillsong UNITED',
            authorImage: 'https://source.unsplash.com/random/36x36?profile' // Replace with actual author image URL
        },
        {
            id: 2,
            title: 'Say The Word - Music Video - Hillsong UNITED',
            views: '6.7M views',
            timestamp: '8 years ago',
            image: 'https://img.youtube.com/vi/xyz/0.jpg', // Replace with actual image URL
            author: 'Hillsong UNITED',
            authorImage: 'https://yt3.ggpht.com/ytc/AKedOLQXZ5R1eN1nGZ-HlT8yzvnJmZz2hvz1a8C9=s88-c-k-c0x00ffffff-no-rj' // Replace with actual author image URL
        },
    ];

    return (
        <div className="search-results">
            <h4>Resultados para "{query}"</h4>
            <div className="results-list">
                {results.map((result) => (
                    <div key={result.id} className="result-item">
                        <img className="thumbnail" src={result.image} alt={result.title} />
                        <div className="result-info">
                            <img className="author-image" src={result.authorImage} alt={result.author} />
                            <div className="result-details">
                                <h3>{result.title}</h3>
                                <p className="author-name">{result.author}</p>
                                <p className="views-timestamp">{result.views} • {result.timestamp}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
