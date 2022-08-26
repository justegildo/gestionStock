import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthenticationService from './services/AuthenticationService';
import axios from 'axios';


import apiUrl from './baseUrls/functions';
import AxiosService from './axiosConfig/AxiosService';

function Login(props) {
    const [checked, setChecked] = useState(false);
    const [credentials, setCredentials] = useState(null);
    let history = useHistory();

    function authenticate() {
        AuthenticationService.authenticate(credentials, (data)=> {
            localStorage.setItem('token', data.token)
            history.replace("/dashboard");
        });
    }

    function bind(e) {
        setCredentials({...credentials, [e.target.id]: e.target.value})
        // if(e.target.checked !== undefined) {
        //     console.log(e.target.checked)
        // }
        //if(e.target.checked !== undefined) setCredentials({...credentials, [e.target.inputId]: e.target.checked})
    }

    const [loading1, setLoading1] = useState(false);
    const onLoadingClick1 = () => {
        setLoading1(true);

        setTimeout(() => {
            setLoading1(false);
        }, 2000);
    }
    
    return (
        <div className=''>
            <div className="flex justify-content-center mt-6">
                <div className="surface-card p-5 shadow-2 w-full lg:w-3 border-round w-6/12 h-4 ">
                    <div className="text-center mb-5">
                        <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Connexion</div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-900 font-medium mb-2">Nom d'utilisateur</label>
                        <InputText id="username" type="text" className="w-full mb-3" onChange={bind} required />

                        <label htmlFor="password" className="block text-900 font-medium mb-2">Mot de passe</label>
                        <InputText id="password" type="password" className="w-full mb-3" onChange={bind} required />

                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                                {/* <Checkbox inputId="rememberMe" binary className="mr-2" onChange={bind} checked={checked} /> */}
                                {/*<Checkbox inputId="rememberMe" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                                <label htmlFor="rememberme1">Se souvenir de moi</label>*/}
                            </div>
                        </div>
                        <Button label="Se connecter" icon="pi pi-user" className="w-full" loading={loading1} onClick={()=> {authenticate() ; onLoadingClick1()}}/>
                        {/* <Link to="/dashboard"><Button label="Sign In" icon="pi pi-user" className="w-full" onClick={authenticate}/></Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;




    