import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import CompteService from '../services/CompteService';
import { itemPerPage } from '../baseUrls/consts';
import { Menu } from 'primereact/menu';

const Compte = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});
    const [resetPasswordForm, setResetPasswordForm] = useState({});
    
    return (
        <div>
            <div className="card">
                <Table {...{setForm, setResetPasswordForm, setYesNo}} />
                <Form {...{form, setYesNo}} />
                <ResetPasswordForm {...{resetPasswordForm, setYesNo}} />
                <Confirmation {...yesNo} />
            </div>
            
        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setForm, setResetPasswordForm, setYesNo} = props;
    const menu = useRef(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    
    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        CompteService.get((data, status) => {
                setLoading(false);
                if(status) setItems(data);   
            },
            {size: itemPerPage}
        );
    }

    const openNew = () => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: null,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        });
    }

    const editItem = (item) => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: item,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        })
    }

    const deleteItem = (item) => {
        setYesNo({   
            visible: true,
            message : "Confirmez-vous la suppression ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true);
                CompteService.delete(item.id, (_data, _status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }

    const enableOrDisableAccount = (_item, _status) => {

    }

    const resetPassword = (item) => {
        setResetPasswordForm({
            visible: true,
            hide: ()=> setResetPasswordForm((prev)=>({...prev, visible: false})),
            data: item,
            setData: (data)=> setResetPasswordForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        })
    }

    return (
        <>
            <h5>Liste des comptes</h5>
            <Toolbar className="mb-4" 
                left={
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" 
                                onClick={openNew}/>
                        </div>
                    </React.Fragment>
                } 
                right={
                    <React.Fragment>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" placeholder="Recherche..." onInput={(e) => setGlobalFilter(e.target.value)} />
                        </span>
                    </React.Fragment>
                } />

            <Menu ref={menu} 
                model={[
                        {label: 'Réinitilaliser mot de passe', icon: 'pi pi-refresh', command: ()=> resetPassword(selectedMenuItem)},
                        {label: 'Supprimer compte', icon: 'pi pi-trash', command: ()=> deleteItem(selectedMenuItem)},
                        //{separator: true},
                    ]}
                popup />
            
            <DataTable dataKey="id" value={items} 
                paginator rows={itemPerPage}  
                loading={loading} globalFilter={globalFilter} 
                responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

                <Column field="id" header="Identifiant" sortable  hidden />
                <Column field="matricule" header="Matricule" sortable />
                <Column field="login" header="Nom de compte" sortable style={{fontWeight: 'bold'}} />
                <Column header="Nom et prénoms" sortable body={(item)=> item.nom + " " + item.prenom}/>
                <Column field="structure.libelle" header="Structure" sortable />
                <Column field="structure.institution.libelle" header="Institution" sortable />
                <Column field="inactif" header="Etat du compte" sortable body={ (item)=> 
                    <span className={`customer-badge status-${item.inactif ? 'unqualified' : 'qualified'}`}>
                        {item.inactif ? "INACTIF" : "ACTIF"}
                    </span>
                } />
                <Column body={ (selectedItem)=>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Button icon="pi pi-ellipsis-v" className="p-button-rounded p-button-warning" 
                            onClick={(e)=> {setSelectedMenuItem(selectedItem); menu.current.toggle(e)} }/>
                        <span style={{padding: '.3rem'}}/>
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editItem(selectedItem)}/>
                        <span style={{padding: '.3rem'}}/>
                        {/*
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={()=> deleteItem(selectedItem)}/>
                        <span style={{padding: '.3rem'}}/>
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editItem(selectedItem)}/>
                        <span style={{padding: '.3rem'}}/>
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editItem(selectedItem)}/>
                        <span style={{padding: '.3rem'}}/> 
                        <Button 
                            icon={`pi pi-${selectedItem.inactif ? 'lock-open' : 'lock'}`} 
                            className={`p-button-rounded p-button-${selectedItem.inactif ? 'danger' : 'normal'}`} 
                            tooltip={selectedItem.inactif ? 'Déverouiller' : 'Verrouiller'}
                            onClick={()=> deleteItem(selectedItem)}/> 
                        */}   
                    </div>
                } />
            </DataTable>
        </>
    );
}

const Form = (props) => {
    const {visible, hide, data, setData, callback } = props.form;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);
    
    const bind = (e) => {
        if(e.target.value !== undefined) {
            let value = e.target.value;
            //value = value.id ? {id: value.id} : value;
            setData({...data, [e.target.id]: value});
        }
        else if(e.checked !== undefined) {
            setData({...data, [e.target.id]: e.target.checked});
        }else{
            alert("Binding fails.")
        }
    }
    
    const submit = () => {
        setYesNo(
            {   
                visible: true,
                message : data.id ? "Confirmez-vous la modification ?" : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (_data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    if(data.id) CompteService.update(data, onResponse); else CompteService.add(data, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header={"Détails de compte"} modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={submit} loading={loading} />
                </>
            } 
            onHide={hide}
            >  
                {data 
                    ?
                    <>
                        <div className="field" hidden>
                            <label htmlFor="id">Etat du compte</label>
                            <InputText id="id" value={data.id} onChange={bind} />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Mot de passe</label>
                            <InputText id="password" type="password" onChange={bind} required />
                        </div>
                    </>
                    :
                    <>
                        <div className="field">
                            <label htmlFor="institution">Institution</label>
                            <InputText id="institution" value={1} onChange={bind} />
                        </div>
                        <div className="field">
                            <label htmlFor="structure">Structure</label>
                            <InputText id="structure" value={1} onChange={bind} />
                        </div>
                        <div className="field">
                            <label htmlFor="utilisateur">Utilisateur</label>
                            <InputText id="utilisateur" value={1} onChange={bind} />
                        </div>
                        <div className="field">
                            <label htmlFor="login">Nom de compte</label>
                            <InputText id="login" value={data && data.login} onChange={bind} required />
                        </div>
                        <div className="field" hidden>
                            <label htmlFor="password">Mot de passe</label>
                            <InputText id="password" type="password" onChange={bind}  required />
                        </div>       
                    </>
                }   
            </Dialog>
    )
}

const ResetPasswordForm = (props) => {
    const {visible, hide, data, setData, callback } = props.resetPasswordForm;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);

    const[resetData, setResetData] = useState();

    useEffect(()=> {
        if(!visible) return;
        setResetData({utilisateurId: data.id})
    }, [visible]);

    const bind = (e) => {
        if(e.target.value !== undefined) {
            let value = e.target.value;
            //value = value.id ? {id: value.id} : value;
            setData({...data, [e.target.id]: value});
        }
        else if(e.checked !== undefined) {
            setData({...data, [e.target.id]: e.target.checked});
        }else{
            alert("Binding fails.")
        }
    }
    
    const submit = () => {
        setYesNo(
            {   
                visible: true,
                message : "Voulez-vous continuer ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    CompteService.resetPassword(resetData, (_undefined, status)=> {
                        setLoading(false);
                        if(!status) return;
                        hide();
                        callback();
                    })
                },
            }
        )
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} 
            header={"Réinitialisation de mot de passe"} modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={submit} loading={loading} />
                </>
            } 
            onHide={hide}>  
                <>  
                    <div className="field" hidden>
                        <label htmlFor="utilisateurId">Identifiant</label>
                        <InputText id="utilisateurId" value = {data?.id} />
                    </div>
                    <div className="field">
                        <label htmlFor="login">Nom de compte</label>
                        <InputText value={data?.login} readOnly  />
                    </div>
                    <div className="field">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <InputText id="newPassword" onChange={bind} required autoFocus />
                    </div>   
                
                </>                
        </Dialog>
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

export default Compte;