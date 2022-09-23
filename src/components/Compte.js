import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import CompteService from '../services/CompteService';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import InstitutionService from '../services/InstitutionService';
import StructureService from '../services/StructureService';
import UtilisateurService from '../services/UtilisateurService'

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

    /*
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
    */

    const deleteItem = (item) => {
        setYesNo({   
            visible: true,
            message : "Confirmez-vous la suppression ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true);
                CompteService.delete(item.id, (_data, _status)=>{
                    //setLoading(false);
                    loadItems();
                });
            },
        });
    }

    const disableAccount = (account) => {
        setYesNo({   
            visible: true,
            message : "Voulez-vous vraiment bloquer ce compte ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true)
                CompteService.disableAccount({utilisateurId: account.id}, (response, status)=> {
                    loadItems();
                });
            },
        });
    }

    const enableAccount = (account) => {
        setYesNo({   
            visible: true,
            message : "Voulez-vous vraiment débloquer ce compte ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true)
                CompteService.enableAccount({utilisateurId: account.id}, (response, status)=> {
                    loadItems();
                });
            },
        });
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
                {/*<Column field="matricule" header="Matricule" sortable />*/}
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
                    <div className='flex justify-content-end'>
                        <Button 
                            icon={`pi pi-${selectedItem.inactif ? 'lock-open' : 'lock'}`} 
                            className={`p-button-rounded p-button-${selectedItem.inactif ? 'danger' : 'normal'} mr-2`} 
                            tooltip={selectedItem.inactif ? 'Déverouiller' : 'Verrouiller'}
                            onClick={()=> selectedItem.inactif ? enableAccount(selectedItem) : disableAccount(selectedItem)}/>
                        <Button icon="pi pi-ellipsis-v" className="p-button-rounded p-button-warning mr-2" 
                            onClick={(e)=> {setSelectedMenuItem(selectedItem); menu.current.toggle(e)} }/>
                    </div>
                } />
                {/*
                        <div style={{display: 'flex flex-', flexDirection: 'row-reverse'}}>    
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
                        </div>
                    */} 
            </DataTable>
        </>
    );
}

const Form = (props) => {
    const {visible, hide, data, setData, callback } = props.form;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);

    const [structures, setStructures] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [selectedUtilisateurId, setSelectedUtilisateurId] = useState();

    useEffect(()=> {
        if(!visible) return;
        loadInstitutions();
    }, [visible]);

    const loadInstitutions = () => {
        InstitutionService.get((data)=> data && setInstitutions(data), {size: pageMaxSize})
    }

    const loadStructures = (institutionId) => {
        StructureService.getByInstitutionId(institutionId, (data)=> data && setStructures(data), {size: pageMaxSize});
    }

    const loadUtilisateurs =(structureId) =>{
        UtilisateurService.getByStructureId(structureId, (data)=> data && setUtilisateurs(data), {size: pageMaxSize})
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
    }

    const bindUtilisateurDropDown = (e) => {
        setSelectedUtilisateurId(e.value);
        setData({...data, utilisateurId : e.value});
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
                    //console.log(JSON.stringify(data, null,2))
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
                <>
                    <div className="field">
                        <label htmlFor="institution">Institution</label>
                        <Dropdown id="institution" options={institutions} 
                            value={data?.institution}
                            onChange={ (e)=> {loadStructures(e.value.id)} }
                            optionLabel="libelle" 
                            placeholder="Aucune sélection"/>
                    </div>
                    <div className="field">
                        <label htmlFor="structure">Structure</label>
                        <Dropdown id="structure" options={structures} 
                            value={data?.structure} 
                            onChange={(e)=> {loadUtilisateurs(e.value.id)}}
                            optionLabel="libelle" 
                            placeholder="Aucune sélection"
                            //filter endsWith 
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="utilisateur">Utilisateur</label>
                        <Dropdown id="utilisateur" options={utilisateurs}
                            value={selectedUtilisateurId} //{data?.utilisateur}
                            onChange={bindUtilisateurDropDown} 
                            //optionLabel="prenom"
                            optionLabel={(data)=> data.nom + " " + data.prenom}
                            optionValue="id"
                            placeholder="Aucune sélection" />
                    </div>
                    <div className="field">
                        <label htmlFor="login">Nom de compte</label>
                        <InputText id="login" value={data && data.username} onChange={bind} required />
                    </div>
                    <div className="field" >
                        <label htmlFor="password">Mot de passe</label>
                        <InputText id="password" type="password" onChange={bind}  required />
                    </div>      
                </>
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