import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './css/search-track.css';

const axios = require('axios');

const SearchTrack = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();

    const trackInfo = JSON.parse(location.state[0]);
    const searchTerm = location.state[1];

    const [trackAudioFeatures, setTrackAudioFeatures] = useState({});

    console.log(trackInfo);

    useEffect(() => {
        const queryAudioFeatures = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/audio-features/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )

            console.log(response);

            setTrackAudioFeatures(response.data);

        }
        queryAudioFeatures();
    }, [])

    return (
        <div>
            <div className='track-container__result'>
                <div className='track-left__result' >
                    <img src={trackInfo.image} className='track-left-image__result' />
                </div>
                <div className='track-right__result' >
                    <div className='track-right-section-one__result'>
                        <div className='track-info-container'>
                            <h1 className='track-name__result'>{trackInfo.track.name}</h1>
                            <p className='artist-name__result'>{trackInfo.artist.name}</p>
                            <p className='album-info__result'>{trackInfo.album.name}</p>
                        </div>
                    </div>
                    <div className='track-right-section-two__result'>
                        <div className='box-information__container'>
                            <div className='top'>
                                <div className='top-first'><p>duration</p></div>
                                <div className='top-second'><p>key</p></div>
                                <div className='top-third'><p>mode</p></div>
                            </div>
                            <div className='bottom'>
                                <div className='top-first'><p>tempo</p></div>
                                <div className='top-second'><p>loudness</p></div>
                                <div className='top-third'><p>time signature</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchTrack;
