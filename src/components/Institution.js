import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import InstitutionService from '../services/InstitutionService';
import { itemPerPage } from '../baseUrls/consts';

const Institution = () => {
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
        InstitutionService.get((data, status) => {
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
                InstitutionService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    return (
        <>
            <h5>Liste des institutions</h5>
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

                <Column field="id" header="Identifiant" hidden sortable />
                <Column field="libelle" header="Libellé" sortable style={{fontWeight: 'bold'}} />
                <Column field="niveau.libelle" header="Niveau" sortable />
                <Column field="contact" header="Téléphone" sortable />
                <Column field="nomChefParc" header="Chef parc" sortable />
                
                <Column body={ (selectedItem)=>
                    <div className="actions flex flex-row-reverse">
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
                    if(data.id) InstitutionService.update(data, onResponse); else InstitutionService.add(data, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de l'institution" modal className="p-fluid" 
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
                    <label htmlFor="libelle">Libellé</label>
                    <InputText id="libelle" value={data && data.libelle} onChange={bind} required  />
                </div>
                {/*
                <div className="field">
                    <label htmlFor="niveau">Niveau</label>
                    <InputText id="niveau" value={institut.niveau.id} onChange={(e) => onInputChange(e, 'niveau.id')} required autoFocus />
                </div>
                 */}
                <div className="field">
                    <label htmlFor="contact">Téléphone</label>
                    <InputText id="contact" value={data && data.contact} onChange={bind} />
                </div>
                
                {/*
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="nomResponsable">Nom Chef parc</label>
                        <InputNumber id="nomResponsable" value={institut.nomResponsable} onValueChange={(e) => onInputChange(e, 'nomResponsable')} required rows={3} cols={20} />
                    </div>
                    <div className="field col">
                        <label htmlFor="email">Email</label>
                        <InputNumber id="email" value={institut.email} onValueChange={(e) => onInputChange(e, 'email')} required rows={3} cols={20} />
                    </div>
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

export default Institution;