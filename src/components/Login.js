import React from "react";
import logo from '../images/spotify_logo.png';
import './css/login.css';
import Button from '@mui/material/Button';

const Login = () => {
    return (
        <div className='login-page__container'>
            <img className='login-page__spotify-logo' src={logo} alt='Spotify'/>
            <Button variant="contained" href='/auth/login' className='login-page__button' >Login with Spotify Premium</Button>
        </div>
    )
}

export default Login;