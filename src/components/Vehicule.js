import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import VehiculeService from '../services/VehiculeService';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import Institution from './Institution';
import { Dropdown } from 'primereact/dropdown';
import InstitutionService from '../services/InstitutionService';

const Vehicule = () => {
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
        VehiculeService.get((data, status) => {
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
                VehiculeService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    return (
        <>
            <h5>Liste des véhicules</h5>
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
                <Column field="immatriculation" header="Immatriculation" sortable />
                {/*<Column field="libelle" header="Libellé" sortable />*/}
                <Column field="marque" header="Marque" sortable />
                <Column field="modele" header="Modèle" sortable />
                <Column field="etatVehicule" header="Etat" sortable body={ (item)=> 
                    <span className={`customer-badge status-${item.etatVehicule == 'DISPONIBLE'? 'qualified' : 'unqualified'}`}>
                        {item.etatVehicule}
                    </span>
                } />
                <Column field="institution.libelle" header="Institution" sortable />

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

    const [institutions, setInstitutions] = useState([]);

    useEffect(()=> {
        if(!visible) return;
        InstitutionService.get((data)=> data && setInstitutions(data), {size: pageMaxSize})
    }, [visible])
    
    const bind = (e) => {
        let type = e.target.type;
        if(type === 'text' || 'password')  setData({...data, [e.target.id]: e.target.value});
        if(type === 'checkbox') setData({...data, [e.target.id]: e.target.checked});

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
        //alert(JSON.stringify(data))
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
                    if(data.id) VehiculeService.update(data, onResponse); else VehiculeService.add(data, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails du véhicule" modal className="p-fluid" 
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
                    <InputText id="id" value={data && data.id} onChange={bind} />
                </div>
                <div className="field">
                    <label htmlFor="immatriculation">Immatriculation</label>
                    <InputText id="immatriculation" value={data && data.immatriculation} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="marque">Marque</label>
                    <InputText id="marque" value={data && data.marque} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="modele">Modèle</label>
                    <InputText id="modele" value={data && data.modele} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="institution">Institution</label>
                    <Dropdown id="institution" options={institutions} value={data?.institution} onChange={bind}
                        optionLabel="libelle" /*optionValue="id"*/  
                        placeholder="Aucune sélection"/>
                </div>
                {/*
                <div className="field">
                    <label htmlFor="institution">Institution</label>
                    <InputText id="niveau" value={institut.niveau.id} onChange={(e) => onInputChange(e, 'niveau.id')} required autoFocus />
                </div>
                 */}
                 {/*
                <div className="field">
                    <label htmlFor="etatVehicule">Niveau</label>
                    <InputText id="etatVehicule" value={institut.niveau.id} onChange={(e) => onInputChange(e, 'niveau.id')} required autoFocus />
                </div>
                */}
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

export default Vehicule;