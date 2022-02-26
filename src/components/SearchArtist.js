import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import msToMinuteSecond from '../functions/msToMinuteSecond';
import { extractYear, extractMonth, extractDay } from '../functions/extractDate';
import play_button from '../images/play-button-4.png';
import left_arrow from '../images/icons8-back-arrow-50.png';
import { player_id } from './Player.jsx';
import './css/search-artist.css';
import { useWindowDimensions } from '../functions/custom-hook';

const axios = require('axios');

const SearchArtist = (props) => {

    const [artistID, setArtistID] = useState('');
    const [artistInfo, setArtistInfo] = useState({});
    const { height, width } = useWindowDimensions();

    // GET Top Tracks 
    const [arrTop10, setArrTop10] = useState([]);

    // GET Albums
    const [arrCompilationEightCard, setArrCompilationEightCard] = useState([]);
    const [arrAlbumEightCard, setArrAlbumEightCard] = useState([]);
    const [arrSingleEightCard, setArrSingleEightCard] = useState([]);

    // POST selected Track
    const [selectedTrack, setSelectedTrack] = useState({});
    const [selectedAlbum, setSelectedAlbum] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
    const {id} = useParams();

    const searchTerm = location.state[0];
    const [maxObtainAlbum, setMaxObtainAlbum] = useState(0);
    const [maxObtainSingle, setMaxObtainSingle] = useState(0);
    const [maxObtainCompilation, setMaxObtainCompilation] = useState(0);

    const handleGoBack = () => {
        navigate('/search', {state: searchTerm});
    }

    // For followers number
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        setArtistID(id);
    }, [])

    // Get Artist Information
    useEffect(() => {
        const getArtist = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response);

            let info = await response.data;
            setArtistInfo({
                'name': info.name,
                'type': info.type,
                'id': info.id,
                'uri': info.uri,
                'popularity': info.popularity,
                'image': info.images[0].url,
                'followers': numberWithCommas(info.followers.total),
                'genres': info.genres
            })
        }
        getArtist();
    }, [artistID])

    // GET Top 10
    useEffect(() => {
        const getArtistTopTracks = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=MY`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }
            })

            setArrTop10([]);

            let tracks = response.data.tracks;
            for (let i in tracks) {
                setArrTop10(prev => [...prev, {
                    'track': {
                        'name': tracks[i].name,
                        'duration_ms': tracks[i].duration_ms,
                        'id': tracks[i].id,
                        'track_number': tracks[i].track_number,
                        'uri': tracks[i].uri
                    },
                    'image': tracks[i].album.images[0].url,
                    'album': {
                        'type': tracks[i].album.album_type,
                        'id': tracks[i].album.id,
                        'name': tracks[i].album.name,
                        'release_date': tracks[i].album.release_date,
                        'total_tracks': tracks[i].album.total_tracks,
                        'uri': tracks[i].album.uri
                    }
                }])
            }

        }
        getArtistTopTracks();
    }, [artistID])

    // GET Album
    useEffect(() => {
        const getArtistAlbum = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`,
            {
                params: {
                    'include_groups': 'album',
                    market: 'MY',
                    limit: 9,
                    offset: 0
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }

            }
            )
            // console.log(response);

            setArrAlbumEightCard([]);

            let albums = response.data.items;

            for (let i in albums) {
                setMaxObtainAlbum(parseInt(i) + 1);
                setArrAlbumEightCard(prev => [...prev, {
                    'year': extractYear(albums[i].release_date),
                    'month': extractMonth(albums[i].release_date),
                    'day': extractDay(albums[i].release_date),
                    'album': {
                        'album_type': albums[i].album_type,
                        'id': albums[i].id,
                        'name': albums[i].name,
                        'release_date': albums[i].release_date,
                        'total_tracks': albums[i].total_tracks,
                        'uri': albums[i].uri
                    },
                    'image': albums[i].images[0].url
                }]);
            }
        }
        getArtistAlbum();

    }, [artistID])

    // GET Single
    useEffect(() => {

        const getArtistSingle = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`,
            {
                params: {
                    'include_groups': 'single',
                    market: 'MY',
                    limit: 9,
                    offset: 0
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }

            }
            )

            setArrSingleEightCard([]);

            let singles = response.data.items;

            for (let i in singles) {
                setMaxObtainSingle(parseInt(i) + 1);
                setArrSingleEightCard(prev => [...prev, {
                    'year': extractYear(singles[i].release_date),
                    'month': extractMonth(singles[i].release_date),
                    'day': extractDay(singles[i].release_date),
                    'album': {
                        'album_type': singles[i].album_type,
                        'id': singles[i].id,
                        'name': singles[i].name,
                        'release_date': singles[i].release_date,
                        'total_tracks': singles[i].total_tracks,
                        'uri': singles[i].uri
                    },
                    'image': singles[i].images[0].url
                }]);

            }
        }
        getArtistSingle();
    }, [artistID])

    // GET include_ons and compilation
    useEffect(() => {
        const getArtistCompilation = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`,
            {
                params: {
                    'include_groups': 'compilation',
                    market: 'MY',
                    limit: 30,
                    offset: 0
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }

            }
            )

            setArrCompilationEightCard([]);

            let compilation = response.data.items;

            for (let i in compilation) {
                setMaxObtainCompilation(parseInt(i) + 1);
                setArrCompilationEightCard(prev => [...prev, {
                    'year': extractYear(compilation[i].release_date),
                    'month': extractMonth(compilation[i].release_date),
                    'day': extractDay(compilation[i].release_date),
                    'album': {
                        'album_type': compilation[i].album_type,
                        'id': compilation[i].id,
                        'name': compilation[i].name,
                        'release_date': compilation[i].release_date,
                        'total_tracks': compilation[i].total_tracks,
                        'uri': compilation[i].uri
                    },
                    'image': compilation[i].images[0].url
                }]);
            }

        }
        getArtistCompilation();
        
    }, [artistID])

    // PUT TRACK request to player
    useEffect(() => {
        const putTrackRequest = async () => {
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
            putTrackRequest();
        } else {
            console.log('Empty selected track.');
        }
    }, [selectedTrack])

    // PUT ALBUM request to player
    useEffect(() => {
        const putAlbumRequest = async () => {
            await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedAlbum.uri,
                "offset": {
                    "position": selectedAlbum.track_number
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
        }

        if (selectedTrack !== {}) {
            putAlbumRequest();
        } else {
            console.log('Empty selected track.');
        }
    }, [selectedAlbum])

    if (width < 600) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 2).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 2).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>

                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 2).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 2).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>

                    }
                    
                    {arrCompilationEightCard.length === 0
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 2).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 2).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else if (width < 800) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 3).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 3).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 3).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 3).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>

                    }
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 3).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 3).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else if (width < 1100) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 4).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 4).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 4).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 4).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 4).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 4).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else if (width < 1300) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 5).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 5).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 5).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 5).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 5).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 5).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else if (width < 1600) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 6).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 6).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0 
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 6).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 6).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>

                    }
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 6).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 6).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else if (width < 1900) {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                    
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 7).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 7).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 7).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 7).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__title__result'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 7).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 7).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className='artist-back'>
                    <p onClick={() => {navigate(-1)}}><img src={left_arrow} className='go-back-artist__result'/></p>
                </div>
                <div className='artist-upper-box__result'>
                    <img src={artistInfo.image} className='artist-image__result'/>
                    <div className='artist-upper-box__name__result'>
                        <p className='artist-type__result'>{artistInfo.type}</p>
                        <p className='artist-name'>{artistInfo.name}</p>
                        <p className='artist-followers__result'>{artistInfo.followers} followers</p>
                    </div>
                </div>
                <div className='artist-lower-box__result'>
                    <h5 className='artist-lower-box__title__result'>Top Tracks</h5>
                    <div className='artist-lower-box__top-tracks__result'>
                        {arrTop10.map((elem, idx) => 
                            (
                                <>
                                    <div className='artist-lower-box__track-box__result'>
                                        <div className='track-box__index-container'>
                                            <span className='track-box__index'>{idx + 1}</span>
                                        </div>
                                        <img src={elem.image} className='track-box__image__result' />
                                        <div className='track-box__name-album__result'>
                                            <p className='track-box__name__result'>{elem.track.name}</p>
                                            <p className='track-box__album__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                        </div>
                                        <p className='track-box__ms__result'>{msToMinuteSecond(elem.track.duration_ms)}</p>
                                        <span><img src={play_button} className='track-box__play-button' onClick={() => setSelectedTrack({'uri': elem.track.uri})} /></span>
                                    </div>
                                </>
                            )
                        )}
                    </div>
                    {arrAlbumEightCard.length === 0
                        ? ''
                        : 
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Albums</h5>
                                {(arrAlbumEightCard.slice(0, 8).length < maxObtainAlbum) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/albums`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrAlbumEightCard.slice(0, 8).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/albums/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrSingleEightCard.length === 0
                        ? ''
                        :
                        <>
                            <div className='artist-lower-box__title-container'>
                                <h5 className='artist-lower-box__title__result'>Single</h5>
                                {(arrSingleEightCard.slice(0, 8).length < maxObtainSingle) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/singles`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrSingleEightCard.slice(0, 8).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedAlbum({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/singles/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </>
                    }
                    {arrCompilationEightCard.length === 0 
                        ? ''
                        : 
                        <div>
                            <div className='artist-lower-box__compilation-title'>
                                <h5 className='artist-lower-box__compilation'>Compilations</h5>
                                {(arrCompilationEightCard.slice(0, 8).length < maxObtainCompilation) ?  <p className='more' onClick={() => {navigate(`/search/artist/${id}/compilations`, {state: searchTerm}); }}>See More</p> : ''}
                            </div>
                            <div className='artist-lower-box__album__result'>
                                {arrCompilationEightCard.slice(0, 8).map(elem => 
                                    (
                                        <>
                                            <div className='box-container__result'>
                                                <div className='box-image-container__result'>
                                                    <img src={elem.image} className='box-image__album-picture__result' />
                                                    <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                                </div>
                                                <div className='box-bottom__result'>
                                                    <div className='artist-lower-box__name-year-album__result'>
                                                        <p className='box-album-name__result' onClick={() => {navigate(`/search/artist/${id}/compilations/${elem.album.id}`, {state: [searchTerm]}); }}>{elem.album.name}</p>
                                                        <p className='album-year__result'>{elem.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )    
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    } 
};

export default SearchArtist;
