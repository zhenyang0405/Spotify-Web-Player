import React, { useState, useEffect } from 'react';
import './css/search-empty.css';
import play_button from '../images/play-button-4.png';
import { player_id } from './Player.jsx';
import { useNavigate } from 'react-router-dom';

const axios = require('axios');

const SearchEmpty = (props) => {

    const [rawNewReleases, setRawNewReleases] = useState('');
    const [newRelease, setNewRelease] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState({});

    const navigate = useNavigate();
    
    const search = props.search;

    useEffect(() => {
        const getNewRelease = async () => {
            const response = await axios.get('https://api.spotify.com/v1/browse/new-releases',
            {
                params: {limit: 20},
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setRawNewReleases(response.data);
            setNewRelease([]);

            let releases = response.data.albums.items;
            for (let i in releases) {
                setNewRelease(prev => [...prev, {
                    'album': {
                        'name': releases[i].name,
                        'total_tracks': releases[i].total_tracks,
                        'release_date': releases[i].release_date,
                        'uri': releases[i].uri,
                        'id': releases[i].id
                    },
                    'artist': {
                        'id': releases[i].artists[0].id,
                        'name': releases[i].artists[0].name,
                        'uri': releases[i].artists[0].uri
                    },
                    'image': releases[i].images[0].url
                }])
            }

        }
        getNewRelease();
    }, [])

    useEffect(() => {
        const putRequest = async () => {
            await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedTrack.album_uri,
                "offset": {
                    "position": 0
                },
                "position_ms": 0
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            // console.log(response);
        }

        if (selectedTrack !== '') {
            putRequest();
        } else {
            console.log('Empty selected track.');
        }
        

    }, [selectedTrack])

    return (
        <div>
            <div className='search-container__empty'>
                <h5 className='new-release-title'>New Releases</h5>
                <ul className='new-release-images'>
                    {newRelease.map(elem => 
                        (
                            <div key={elem.album.id} className='box-container__empty'>
                                <div className='box-image-container__empty'>
                                    <li className='box-image__empty'>
                                        <img src={elem.image} className='box-image__album-picture__empty' />
                                    </li>
                                    <img src={play_button} className='box-image__play-button__empty' onClick={() => setSelectedTrack({'album_uri': elem.album.uri })} />
                                </div>
                                <div className='box-bottom__empty'>
                                    <div className='box-bottom__left-empty'>
                                        <p className='box-song-name__empty'>{elem.album.name}</p>
                                        <p className='box-artist-name__empty' onClick={() => {navigate(`artist/${elem.artist.id}`, {state: [search]}); }}>{elem.artist.name}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </ul>
            </div>
        </div>
    )
}

export default SearchEmpty;
