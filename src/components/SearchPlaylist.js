import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { player_id } from './Player';
import msToMinuteSecond from '../functions/msToMinuteSecond';
import left_arrow from '../images/icons8-back-arrow-50.png';
import play_button from '../images/play-button-4.png';
import './css/search-playlist.css';

const axios = require('axios');

const SearchPlaylist = (props) => {

    const [playlistID, setPlaylistID] = useState('');
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState({});

    const location = useLocation();
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setPlaylistID(id);
    }, [])

    // GET playlist info and tracks
    useEffect(() => {
        const getPlaylist = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);
            

            let info = await response.data;
            setPlaylistInfo({
                'id': info.id,
                'name': info.name,
                'description': info.description,
                'public': info.public,
                'type': info.type,
                'uri': info.uri,
                'followers_number': info.followers.total,
                'image': info.images[0].url,
                'owner_name': info.owner.display_name,
                'owner_id': info.owner.id,
                'tracks_total': info.tracks.total
            })

            setPlaylistTracks([]);

            let tracks = await response.data.tracks.items;
            for (let i in tracks) {
                setPlaylistTracks(prev => [...prev, {
                    'playlist_id': response.data.uri,
                    'album': {
                        'type': tracks[i].track.album.album_type,
                        'id': tracks[i].track.album.id,
                        'image': tracks[i].track.album.images[0].url,
                        'name': tracks[i].track.album.name,
                        'release_date': tracks[i].track.album.release_date,
                        'total_tracks': tracks[i].track.album.total_tracks,
                        'uri': tracks[i].track.album.uri
                    },
                    'artist': {
                        'id': tracks[i].track.artists[0].id,
                        'name': tracks[i].track.artists[0].name,
                        'uri': tracks[i].track.artists[0].uri
                    },
                    'track': {
                        'duration_ms': tracks[i].track.duration_ms,
                        'id': tracks[i].track.id,
                        'name': tracks[i].track.name,
                        'track_number': tracks[i].track.track_number,
                        'uri': tracks[i].track.uri
                    }
                }])
            }
            
        }
        
        getPlaylist();
    }, [playlistID])

    // PUT request
    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedPlaylist.uri,
                "offset": {
                    "uri": selectedPlaylist.track
                },
                "position_ms": 0
            },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            }
            )
            console.log(response);
        }

        if (selectedPlaylist !== {}) {
            putRequest();
        } else {
            console.log('HOME - Put Request Empty selected album.');
        }

    }, [selectedPlaylist])

    return (
        <div className='playlist-main__container'>
            <img src={left_arrow} className='playlist-back-button' onClick={() => navigate(-1)} />
            <div className='playlist__container'>
                
                <div className='playlist-left__container'>
                    <div className='playlist-left__inner-container'>
                        <div className='playlist-left__image-container'>
                            <img src={playlistInfo.image} className='playlist-left__image' />
                        </div>
                        <p className='playlist-left__name'>{playlistInfo.name}</p>
                        {playlistInfo.description == '' ? '' : <p className='playlist-left__description' dangerouslySetInnerHTML={{__html: playlistInfo.description}}></p>}
                        <p className='playlist-left__owner'>By {playlistInfo.owner_name}</p>
                        
                    </div>
                </div>
                <div className='playlist-right__container'>
                    <p className='playlist-left__total-tracks'>{playlistInfo.tracks_total} Tracks</p>
                    {playlistTracks.map(elem => (
                        <div key={elem.track.id} className='playlist-right__card'>
                            <div className='playlist-right__image-container'>
                                <img src={elem.album.image} className='playlist-right__image' />
                            </div>
                            <div className='playlist-right__text-container'>
                                <p className='playlist-right__track-name'>{elem.track.name}</p>
                                <p className='playlist-right__artist-name' onClick={() => navigate(`/search/artist/${elem.artist.id}`, {state: ['']})} >{elem.artist.name}</p>
                            </div>
                            <p className='playlist-right__duration'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                            <img src={play_button} className='playlist-right__play-button' onClick={() => setSelectedPlaylist({'uri': elem.playlist_id, 'track': elem.track.uri})} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchPlaylist


// "☕ Freshly roasted Lofi &amp; Jazz Hop. <a href="http://youtube.com/thejazzhopcafe">The Jazz Hop Café</a>'s monthly selection"

