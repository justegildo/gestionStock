import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { InputNumber } from 'primereact/inputnumber';
import DemandeService from '../services/DemandeService';
import LieuService from '../services/LieuService';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown';


const DemandeVehicule = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{setForm, setYesNo}} />
                <Form {...{form, setYesNo}} />
                <Confirmation {...yesNo} />
            </div>
            
        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setForm, setYesNo} = props; 

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        DemandeService.get((data, status) => {
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
        console.log(items)
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
                DemandeService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    return (
        <>
            <h5>Liste des demandes</h5>
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
            <DataTable dataKey="id" value={items} 
                paginator rows={itemPerPage}  
                loading={loading} globalFilter={globalFilter} 
                responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

                <Column field="id" header="Identifiant" sortable  hidden />
                <Column field="dateDemande" header="Date de demande" sortable 
                    body={(item)=> new Date(item.dateDemande).toLocaleDateString()}/>
                <Column field="utilisateur.nom" header="Demandeur" sortable body= { (selectedItem)=>
                    selectedItem.utilisateur && (selectedItem.utilisateur.nom + " " 
                    + selectedItem.utilisateur.prenom)
                } />
                <Column field="lieu.libelle" header="Lieu" sortable />
                <Column field="nbreParticipant" header="Nombre de participants" sortable />
                <Column field="nbreVehicule" header="Nombre de véhicules" sortable style={{fontWeight: 'bold'}}/>
                <Column field="dateDebutActivite" header="Date début de l'activité" sortable 
                    body={(item)=> new Date(item.dateDebutActivite).toLocaleDateString()} />
                <Column field="dateFinActivite" header="Date fin de l'activité" sortable 
                    body={(item)=> new Date(item.dateFinActivite).toLocaleDateString()}/>

                <Column field="etatDemande" header="Etat de la demande" sortable body={ (item)=> 
                    <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                            ? 'qualified' 
                            : (item.etatDemande === 'APPROUVEE' ? 'new' 
                            : item.etatDemande === 'REJETEE' ? 'unqualified' :  'proposal')}`}>
                        {item.etatDemande}
                    </span>
                } />
                <Column body={ (selectedItem)=>
                    <div className="flex justify-content-end">
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(selectedItem)}/>
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={()=> deleteItem(selectedItem)}/>
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

    const [lieux, setLieux] = useState([]);

    useEffect(()=> {
        if(!visible) return;
        LieuService.get((data)=> data && setLieux(data), {size: pageMaxSize})
    }, [visible])
    
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
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let request = {...data, utilisateur : {id: currentUser.utilisateur.id }}
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
                    //console.log(JSON.stringify(data, null, 2))
                    if(data.id) DemandeService.update(request, onResponse); 
                    else DemandeService.add(request, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de la demande" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={submit} loading={loading} />
                </>
            } 
            onHide={hide}
            >  
                <div className="field" hidden>
                    <label htmlFor="id">Identifiant</label>
                    <InputText id="id" value={data?.id} onChange={bind} />
                </div>
                <div className="field" >
                    <label htmlFor="lieu">Lieu</label>
                    <Dropdown id="lieu" options={lieux} value={data?.lieu} onChange={bind}
                        optionLabel="libelle" /*optionValue="id"*/  
                        placeholder="Aucune sélection"/>
                </div>
                <div className="field" hidden>
                    <label htmlFor="dateDemande">Date de demande</label>
                    <Calendar id="dateDemande" value={data && new Date(data.dateDemande)} 
                        onChange={bind}  mask="99/99/9999" required  />
                </div>
                <div className="field">
                    <label htmlFor="nbreParticipant">Nombre de participants</label>
                    <InputNumber id="nbreParticipant" value={data?.nbreParticipant} 
                        onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                    <InputNumber id="nbreVehicule" value={data?.nbreVehicule} 
                        onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                    <Calendar id="dateDebutActivite" value={data && new Date(data.dateDebutActivite)} 
                        onChange={bind} mask="99/99/9999" required />
                </div>
                <div className="field">
                    <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                    <Calendar id="dateFinActivite" value={data && new Date(data.dateFinActivite)} 
                        onChange={bind} mask="99/99/9999" required  />
                </div>
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

export default DemandeVehicule;