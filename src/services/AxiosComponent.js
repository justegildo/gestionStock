import React, { useEffect, useRef, useState } from 'react';
import { /*useNavigate*/ useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

//https://stackoverflow.com/questions/69953377/react-router-v6-how-to-use-navigate-redirection-in-axios-interceptor
export const AxiosComponent = () => {

    /*const navigate = useNavigate();*/
    const history = useHistory();
    const interceptorId = useRef(null);
    
    useEffect(() => {
        axios.interceptors.request.use(config => {
            console.log(JSON.stringify(config.headers, null, 2))
            return config;
        } )


        interceptorId.current = axios.interceptors.response.use(handleSuccess, handleError);
        return () => {
            axios.interceptors.response.eject(interceptorId.current);
        };
    }, []);

    const handleSuccess = (response) => {
        return response;
    }

    const handleError = (error) => {
        if (error.response) {
            if(error.response.status == 401 || error.response.status == 403) {
                history.push("/login");
            }else{
                showDialog(error.response.data.message);
            }
        } else if (error.request) {
            showToast("Aucune réponse du serveur");
        } else {
            showToast(error.message);
        }
        return Promise.reject(error);
    }

    
    // Views (Dialog and Toast)
    const showToast = (message) => {
        toast.current.show({ severity: 'error', summary: 'Opération echouée', detail: message, life: 3000 });
    };

    const [dialogMessage, setDialogMessage] = useState("");
    const showDialog = (message) => {
        setDialogMessage(message);
        setDisplayBasic(true);
    };

    const toast = useRef();
    const [displayBasic, setDisplayBasic] = useState(false);
    const basicDialogFooter = (
        <>
            <Button type="button" label="Fermer" onClick={() => setDisplayBasic(false)} className="p-button-text" autoFocus />
        </>
    );
    return (
        <>
            <Toast ref={toast} />
            <Dialog 
                header="Opération echouée" 
                visible={displayBasic} style={{ width: '350px' }}  modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-times-circle p-button-danger mr-3" style={{ fontSize: '2rem', color: 'red' }} />
                    <span>{dialogMessage}</span>
                </div>
            </Dialog>

        </>
    );
};
