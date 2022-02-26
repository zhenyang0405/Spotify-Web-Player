import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { extractYear, extractMonth, extractDay } from '../functions/extractDate';
import singer from '../images/singer.png';
import play_button from '../images/play-button-4.png';
import left_arrow from '../images/icons8-back-arrow-50.png';
import { player_id } from './Player';
import '../components/css/search-more.css';

const axios = require('axios');

const SearchMoreArtist = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {id, type} = useParams();
    console.log(`${id} - ${type}`);

    const [selectedTrack, setSelectedTrack] = useState({});
    const [arrItems, setArrItems] = useState([]);

    const searchTerm = location.state;
    
    useEffect(() => {
        let query_type = ''; 
         if (type == 'albums') {
            query_type = 'album';
        } else if (type == 'singles') {
            query_type = 'single';
        } else if (type == 'compilations') {
            query_type = 'compilation'
        }

        const queryInfo = async () => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`,
            {
                params: {
                    'include_groups': query_type,
                    market: 'MY',
                    offset: 0
                },
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                }

            }
            )

            console.log(response);

            setArrItems([]);

            let album_info = await response.data.items;
            for (let i in album_info) {
                let image_url = (album_info[i].images).length == 0 ? singer : album_info[i].images[0].url;
                setArrItems(prev => [...prev, {
                    'year': extractYear(album_info[i].release_date),
                    'month': extractMonth(album_info[i].release_date),
                    'day': extractDay(album_info[i].release_date),
                    'artist': {
                        'name': album_info[i].artists[0].name,
                        'id': album_info[i].artists[0].id,
                        'uri': album_info[i].artists[0].uri,
                    },
                    'image': image_url,
                    'album': {
                        'name': album_info[i].name,
                        'id': album_info[i].id,
                        'release_date': album_info[i].release_date,
                        'total_tracks': album_info[i].total_tracks,
                        'uri': album_info[i].uri
                    }
                }]);
            }

            // let info = [];
            // switch (query_type) {
            //     case 'album':
            //         let album_info = await response.data.items;
            //         for (let i in album_info) {
            //             let image_url = (album_info[i].images).length == 0 ? singer : album_info[i].images[0].url;
            //             setArrItems(prev => [...prev, {
            //                 'year': extractYear(album_info[i].release_date),
            //                 'month': extractMonth(album_info[i].release_date),
            //                 'day': extractDay(album_info[i].release_date),
            //                 'artist': {
            //                     'name': album_info[i].artists[0].name,
            //                     'id': album_info[i].artists[0].id,
            //                     'uri': album_info[i].artists[0].uri,
            //                 },
            //                 'image': image_url,
            //                 'album': {
            //                     'name': album_info[i].name,
            //                     'id': album_info[i].id,
            //                     'release_date': album_info[i].release_date,
            //                     'total_tracks': album_info[i].total_tracks,
            //                     'uri': album_info[i].uri
            //                 }
            //             }]);
            //         }
            //         break;
            //     default:
            //         console.log('Error on query_type');
            // }



        }
        queryInfo();
    }, [])

    // POST 
    useEffect(() => {
        const putRequest = async () => {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${player_id}`,
            {
                "context_uri": selectedTrack.uri,
                "offset": {
                    "position": selectedTrack.track_number
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

            console.log(response);
        }

        if (selectedTrack !== {}) {
            putRequest();
        } else {
            console.log('Empty selected track.');
        }
        

    }, [selectedTrack])


    
    // if (type == 'albums') {
        return (
            <div className='search-container__result'>
                <div>
                    <div className='title__more-page__container'>
                        <span onClick={() => navigate(-1)}><img src={left_arrow} className='go-back__more-page'/></span>
                        <h5 className='title__more-page'>More {type} from {searchTerm}</h5>
                        
                    </div>
                    <ul className='see-more-box-images__result'>
                        {arrItems.map(elem => 
                            (
                                <div className='box-container__result'>
                                     <div className='box-image-container__result'>
                                        <li className='box-image__result'>
                                            <img src={elem.image} className='box-image__album-picture__result' />
                                        </li>
                                        <img src={play_button} className='box-image__play-button__result' onClick={() => setSelectedTrack({'uri': elem.album.uri, 'track_number': 0 })} />
                                    </div>
                                    <div className='box-bottom__result'>
                                        <div className='box-bottom__left__result'>
                                            <p className='box-album-name__result' onClick={() => {navigate(`/search/album/${elem.album.id}`, {state: [searchTerm]}); }} >{elem.album.name}</p>
                                            <p className='box-artist-year' >{elem.year}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
            </div>
        )
    // }
}

export default SearchMoreArtist;
