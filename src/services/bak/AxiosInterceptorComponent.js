import React, { useEffect, useRef, useState } from 'react';
import { /*useNavigate*/ useHistory } from 'react-router-dom';
import axios from 'axios';
import { url as apiUrl } from '../baseUrls/functions';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

//https://stackoverflow.com/questions/69953377/react-router-v6-how-to-use-navigate-redirection-in-axios-interceptor
export const AxiosInterceptorComponent = () => {

    /*const navigate = useNavigate();*/
    const history = useHistory();

    const interceptorId = useRef(null);
    
    useEffect(() => {
        interceptorId.current = axios.interceptors.response.use(undefined, (error) => {
            setDisplayBasic(true);
            history.replace("/dashboard");
            //switch (error.response.status) {
            //    case 400:
            //        /*navigate('/login');*/
            //        history.replace("/dashboard");
            //        setDisplayBasic(true);
            //        break;
                    
            //}
        });

        

        return () => {
            axios.interceptors.response.eject(interceptorId.current);
        };
    }, []);


    const [displayBasic, setDisplayBasic] = useState(false);
    const basicDialogFooter = <Button type="button" label="Dismiss" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-secondary" />;
    const basicDialogFooter2 = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayBasic(false)} className="p-button-text" />
            <Button type="button" label="Yes" icon="pi pi-check" onClick={() => setDisplayBasic(false)} className="p-button-text" autoFocus />
        </>
    );
    const basicDialogFooter3 = (
        <>
            <Button type="button" label="Fermer" onClick={() => setDisplayBasic(false)} className="p-button-text" autoFocus />
        </>
    );
    return (
        <>
            {/* <Dialog 
                header="Erreur" 
                visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                <p>
                    Lorem ipsum
                </p>
            </Dialog> */}

            {/* <Dialog 
                header="Opération echouée" 
                visible={displayBasic} style={{ width: '350px' }}  modal footer={basicDialogFooter2} onHide={() => setDisplayBasic(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: 'red' }} />
                    <i className="pi pi-times-circle p-button-danger mr-3" style={{ fontSize: '2rem', color: 'red' }} />
                    <span>Le nom d'utilisateur doit être d'au moins 8 caractères</span>
                </div>
            </Dialog> */}

            <Dialog 
                header="Opération echouée" 
                visible={displayBasic} style={{ width: '350px' }}  modal footer={basicDialogFooter3} onHide={() => setDisplayBasic(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-times-circle p-button-danger mr-3" style={{ fontSize: '2rem', color: 'red' }} />
                    <span>Le nom d'utilisateur doit être d'au moins 8 caractères</span>
                </div>
            </Dialog>

        </>
    );
};
