import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import msToMinuteSecond from '../functions/msToMinuteSecond';
import left_arrow from '../images/icons8-back-arrow-50.png';
import play_button from '../images/play-button-4.png';
import { player_id } from './Player.jsx';
import './css/search-album.css';

const axios = require('axios');

const SearchAlbum = (props) => {

    const [albumID, setAlbumID] = useState('');
    const [albumInfo, setAlbumInfo] = useState({});
    const [albumTracks, setAlbumTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState({});

    const location = useLocation();
    const {id} = useParams();
    const navigate = useNavigate();

    const searchTerm = location.state[0];

    const handleGoBack = () => {
        navigate('/search', {state: searchTerm});
    }

    useEffect(() => {
        setAlbumID(id);
    }, [])

    // GET Album details
    useEffect(() => {
        const getAlbum = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);

            setAlbumTracks([]);

            let info = await response.data;
            setAlbumInfo({
                'album_type': info.album_type,
                'id': info.id,
                'label': info.label,
                'name': info.name,
                'popularity': info.popularity,
                'release_date': info.release_date,
                'total_tracks': info.total_tracks,
                'uri': info.uri,
                'type': info.type,
                'artist_name': info.artists[0].name,
                'artist_id': info.artists[0].id,
                'artist_uri': info.artists[0].uri,
                'copyrights_text': info.copyrights[0].text,
                'image': info.images[0].url      
            })

            let tracks = response.data.tracks.items;
            for (let i in tracks) {
                setAlbumTracks(prev => [...prev, {
                    'duration_ms': tracks[i].duration_ms,
                    'id': tracks[i].id,
                    'name': tracks[i].name,
                    'track_number': tracks[i].track_number,
                    'uri': tracks[i].uri
                }])
            }

        }
        getAlbum();
    }, [albumID])

    // PUT request to player 
    useEffect(() => {
        const putRequest = async () => {
            await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "uris": [
                    selectedTrack.uri
                  ]
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
        }
        if (selectedTrack !== {}) {
            putRequest();
        } else {
            console.log('Empty selected track.');
        }
    }, [selectedTrack])

    // useEffect(() => {
    //     console.log(albumTracks);
    // }, [albumTracks])

    return (
        <div>
            <div className='artist-back'>
                <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
            </div>
            <div className='album-upper-box__result'>
                <img src={albumInfo.image} className='album-image__result'/>
                <div className='album-upper-box__name__result'>
                    <h1 className='album-name__result'>{albumInfo.name}</h1>
                    <p className='album-basic-info__result'>{albumInfo.artist_name} <span>&#8226;</span> {albumInfo.release_date} <span>&#8226;</span> {albumInfo.total_tracks} tracks</p>
                </div>
            </div>
            <div className='album-bottom-box__result'>
                <div className='album-bottom-box__title-name__result'>
                    <span className='title-name__numbering__result'>No.</span>
                    <span className='title-name__name__result'>Name</span>
                    <span className='title-name__duration__result'>Duration</span>
                </div>
                <hr className='divider' />
                    <div className='album-bottom-box__track-name__result'>
                    {albumTracks.map((elem, idx) => 
                        (
                            <div>
                                <p className='track-name__box__result'>
                                    <div className='track-name__index-box__result'>
                                        <span className='track-name__index__result'>{idx + 1}</span>
                                    </div>
                                    <div className='track-name__song-artist__result'>
                                        <span className='track-name__name__result' >{elem.name}</span>
                                        <span className='track-name__artist__result'>{albumInfo.artist_name}</span>
                                    </div>
                                    <span className='track-name__duration__result'>{msToMinuteSecond(elem.duration_ms)}</span>
                                    <img className='track-name__play-button__result' src={play_button} onClick={() => setSelectedTrack({'uri': elem.uri})} />
                                </p>
                            </div>
                        )    
                    )}   
                </div>
            </div>
        </div>
    )
};

export default SearchAlbum;
