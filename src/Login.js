import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AuthenticationService from './services/AuthenticationService';

function Login(props) {
    const [data, setData] = useState({rememberMe: false});
    const [loading, setLoading] = useState(false);
    let history = useHistory();
    let params = useParams();

    useEffect(()=> {
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
          };
    })

    const keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            authenticate();
        }
    }

    const bind = (e) => {
        if(e.target.value !== undefined) {
            let value = e.target.value;
            setData({...data, [e.target.id]: value});
        }
        else if(e.checked !== undefined) {
            setData({...data, [e.target.id]: e.target.checked});
        }else{
            alert("Binding fails.")
        }
        //console.log(e)
    }

    function authenticate() {
        setLoading(true);
        let credentials = data;
        AuthenticationService.authenticate(credentials, (response, status)=> {
            setLoading(false);
            if(!status) return;
            localStorage.setItem('token', response.token)
            localStorage.setItem("user", JSON.stringify(response, null, 2))
            if(params.state) history.goBack(); else history.replace("/dashboard");
        });
    }

    
    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <div className="surface-card p-5 shadow-2 w-full lg:w-4 border-round w-6/12 h-4 ">
                
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Connexion</div>
                </div>

                <div className='p-fluid '>
                    <label htmlFor="username" className="block text-900 font-medium mb-2">Nom d'utilisateur</label>
                    <InputText id="username" type="text" className="w-full mb-3" value={data?.username} onChange={bind} required />
                    
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Mot de passe</label>
                    <Password inputId="password" className="w-full mb-3" toggleMask required value={data?.password} onChange={bind}
                        /*onKeyPress={alert("press")} onKeyDown={alert("down")}*/ />
                    
                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox id="rememberMe" binary className="mr-2" onChange={bind} checked={data.rememberMe} /> 
                            <label htmlFor="rememberMe">Se souvenir de moi</label>
                        </div>
                    </div>
                    
                    <Button autoFocus label="Se connecter" icon="pi pi-user" iconPos="right" className="w-full" loading={loading} onClick={authenticate}/>
                    {/* <Link to="/dashboard"><Button label="Sign In" icon="pi pi-user" className="w-full" onClick={authenticate}/></Link> */}
                </div>

            </div>
        </div>
    );
}

export default Login;
