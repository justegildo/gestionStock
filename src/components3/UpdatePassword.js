import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import UtilisateurService from '../services/UtilisateurService';
import { itemPerPage} from '../baseUrls/consts';
import { Password } from 'primereact/password';


const UpdatePassword = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});
    
    return (
        <div>
            <div className="card">
                <Form {...{form, setYesNo}} />
                <Confirmation {...yesNo} />
            </div>
            
        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setForm, setYesNo} = props;

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        UtilisateurService.get((data, status) => {
                setLoading(false);
                if(status) setItems(data);   
            },
            {size: itemPerPage}
        );
    }
}

const Form = (props) => {
    const {visible, hide, data, setData, callback } = props.form;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);

    const bind = (e) => {
        let type = e.target.type;
        if(type === 'text' || 'password')  setData({...data, [e.target.id]: e.target.value});
        if(type === 'checkbox') setData({...data, [e.target.id]: e.target.checked});
        
    }
    
    const submit = () => {
        setYesNo(
            {   
                visible: true,
                message : data.id ? "Confirmez-vous la modification ?" : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    if(data.id) UtilisateurService.update(data, onResponse); else UtilisateurService.add(data, onResponse);
                },
            }
        )
    }

    return(  
        <div style={{display: 'flex', flexDirection: 'row', height: '80vh', justifyContent: 'center', alignItems: 'center'}}>
            <div className="surface-card p-5 shadow-2 w-full lg:w-6 border-round w-12/12 h-4 ">
            
                <div className="text-center mb-5">
                    {/* <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" /> */}
                    <div className="text-900 text-3xl font-medium mb-3">Modifier votre mot de passe</div>
                </div>

                <div className='p-fluid '>
                    <label htmlFor="ancien" className="block text-900 font-medium mb-2">Ancien mot de passe</label>
                    <Password id="ancien" type="text" className="w-full mb-3" toggleMask required value={data?.ancien} onChange={bind}  />
                    
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Nouveau mot de passe</label>
                    <Password inputId="password" className="w-full mb-3" toggleMask required value={data?.password} onChange={bind}
                         />
                    <label htmlFor="password" className="block text-900 font-medium mb-2">Taper à nouveau le mot de passe</label>
                    <Password inputId="password" className="w-full mb-3" toggleMask required value={data?.password} onChange={bind}
                         />
                    
                    <Button autoFocus label="Modifier" icon="pi pi-user" iconPos="right" className="w-full" loading={loading} /*onClick={authenticate}*/ />
                
                </div>

            </div>
        </div>
    )
}

const Confirmation = (props) => {
    const {visible, hide, message, callback } = props;
    
    return (
        <Dialog modal visible={visible} onHide={hide} 
            header="Confirmation" style={{ width: '350px' }}
            footer={
                <>
                    <Button type="button" label="Non" icon="pi pi-times" 
                        onClick={hide} 
                        className="p-button-text" />
                    <Button type="button" label="Oui" icon="pi pi-check" 
                        onClick={() => { hide(); callback() }} 
                        className="p-button-text" autoFocus />
                </>
            }>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>{message != null ? message : "Voulez-vous continuer ?"}</span>
            </div>
        </Dialog>
    )
}

export default UpdatePassword;