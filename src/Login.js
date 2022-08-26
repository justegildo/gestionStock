import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AuthenticationService from './services/AuthenticationService';

function Login(props) {
    const [credentials, setCredentials] = useState({rememberMe: false});
    const [loading1, setLoading1] = useState(false);
    let history = useHistory();
    let params = useParams();

    function authenticate() {
        AuthenticationService.authenticate(credentials, (data)=> {
            localStorage.setItem('token', data.token)
            localStorage.setItem("user", JSON.stringify(data, null, 2))
            if(params.state) history.goBack(); else history.replace("/dashboard");
        });
    }

    function bind(e) {
        let type = e.target.type;
        if(type == 'text' || 'password')  setCredentials({...credentials, [e.target.id]: e.target.value});
        if(type == 'checkbox') setCredentials({...credentials, [e.target.id]: e.target.checked});
    }
    
    const onLoadingClick1 = () => {
        setLoading1(true);

        setTimeout(() => {
            setLoading1(false);
        }, 1000);
    }

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div className="text-center mb-5">
                <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
            </div>

            <div>
                <label htmlFor="username" className="block text-900 font-medium mb-2">Nom d'utilisateur</label>
                <InputText id="username" type="text" className="w-full mb-3" onChange={bind} required />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Mot de passe</label>
                <InputText id="password" type="password" className="w-full mb-3" onChange={bind} required />

                <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                        {/* <Checkbox inputId="rememberMe" binary className="mr-2" onChange={bind} checked={checked} /> */}
                        <Checkbox id = "rememberMe" binary className="mr-2" onChange={bind} checked={credentials.rememberMe} />
                        <label htmlFor="rememberMe">Se souvenir de moi</label>
                    </div>
                    <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" style={{display: 'none', visibility: 'hidden'}}>Forgot password?</a>
                </div>
                <Button label="Se connecter" icon="pi pi-user" className="w-full" loading={loading1} onClick={()=> {authenticate() ; onLoadingClick1()}}/>
                {/* <Link to="/dashboard"><Button label="Sign In" icon="pi pi-user" className="w-full" onClick={authenticate}/></Link> */}
            </div>
        </div>
    );
}

export default Login;
