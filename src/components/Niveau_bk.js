import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import NiveauService from '../services/NiveauService';
import { itemPerPage } from '../baseUrls/consts';

const Niveau = () => {
    let emptyNiveau = {
        id: 0,
        libelle: ""
    }
    
    const [callback, setCallback] = useState();
    const [niveaux, setNiveaux] = useState(null);
    const [niveauDialog, setNiveauDialog] = useState(false);
    const [niveau, setNiveau] = useState(emptyNiveau);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        NiveauService.get((data) => {
            setNiveaux(data); 
            setLoading(false);
        }, 
        {size: itemPerPage});
    }, []);

    const openNew = () => {
        setNiveau(emptyNiveau);
        setSubmitted(false);
        setNiveauDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setNiveauDialog(false);
    }

    const editNiveau = (niveau) => {
        setNiveau({ ...niveau });
        setNiveauDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _niveau = { ...niveau };
        _niveau[`${name}`] = val;

        setNiveau(_niveau);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" 
                    onClick={()=>setCallback(()=>()=>alert('Bonsoir'))/*openNew*/}/>
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" placeholder="Recherche..." onInput={(e) => setGlobalFilter(e.target.value)}/>
                </span>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (APIData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editNiveau(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }

    const niveauDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );
    
    return (
        <div>
            <div className="card">
                <h5>Liste des niveaux</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={niveaux} rows={itemPerPage} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucun niveau disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '10%', textAlign: 'center'}} />
                    <Column field="libelle" header="Libellé" sortable style={{width: '70%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
                <Confirmation {...{callback, setCallback}} />
            </div>
            <div>
                <Dialog visible={niveauDialog} style={{ width: '450px' }} header="Détails d'un niveau" modal className="p-fluid" 
                    footer={niveauDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="id">Matricule</label>
                            <InputText id="id" value={niveau.id} onChange={(e) => onInputChange(e, 'id')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="libelle">Libellé</label>
                            <InputText id="libelle" value={niveau.libelle} onChange={(e) => onInputChange(e, 'libelle')} required autoFocus  />
                        </div>
                </Dialog>
            </div>
        </div>
    );
}

const Table = (props) => {
    const [data, setData] = useState([]);
    const [seletedItem, setSeletedItem] = useState(null);
    const [loading, setLoading] = useState(null);
    const [callback, setCallback] = useState();
    
    useEffect(() => {
        NiveauService.get((data) => {
            setData(data); 
            setLoading(false);
        }, 
        {size: itemPerPage});
    }, []);

    const editItem = (item) => {
        //setNiveau({ ...niveau });
        //setNiveauDialog(true);
    }

    const deleteItem = (item) => {
        //setNiveau({ ...niveau });
        //setNiveauDialog(true);
    }
    
    return (
        <DataTable value={data} rows={itemPerPage} paginator responsiveLayout="scroll"  
            loading={loading} /*globalFilter={globalFilter}*/ emptyMessage="Aucun niveau disponible.">
            <Column field="id" header="Matricule" sortable style={{/*textAlign: 'center'*/}} />
            <Column field="libelle" header="Libellé" sortable style={{/*width: '70%', */fontWeight: 'bold'}} />
            <Column body={
                <div className="actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(seletedItem)}/>
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={()=> deleteItem(seletedItem)}/>
                </div>
            } />
        </DataTable>
    );
} 

const Form = (props) => {
    const [data, setData] = useState();
    const [visible, setVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    if(props.data && props.data != data) setData(props.data)

    const hideDialog = () => {
        setSubmitted(false);
        setVisible(false);
    }

    const bind = (e) => {
        let type = e.target.type;
        if(type === 'text' || 'password')  setData({...data, [e.target.id]: e.target.value});
        if(type === 'checkbox') setData({...data, [e.target.id]: e.target.checked});
    }

    const submit = () => {

    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails d'un niveau" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
                    <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={submit}/>
                </>       
            } 
            onHide={hideDialog}
            >  
                <div className="field">
                    <label htmlFor="id">Matricule</label>
                    <InputText id="id" value={data.id} onChange={bind} required rows={3} cols={10} />
                </div>
                <div className="field">
                    <label htmlFor="libelle">Libellé</label>
                    <InputText id="libelle" value={data.libelle} onChange={bind} required autoFocus  />
                </div>
        </Dialog>
    )
}

const Confirmation = (props) => {
    const [confirmation, setConfirmation] = useState(false);

    const hide = () => {
        setConfirmation(false);
        props.setCallback(null)
    }

    if(props.callback && !confirmation) {
        setConfirmation(true);
        return null;
    }
    
    return (
        <Dialog modal visible={confirmation} onHide={hide} 
            header="Confirmation" style={{ width: '350px' }}
            footer={
                <>
                    <Button type="button" label="Non" icon="pi pi-times" 
                        onClick={hide} 
                        className="p-button-text" />
                    <Button type="button" label="Oui" icon="pi pi-check" 
                        onClick={() => { hide(); props.callback() }} 
                        className="p-button-text" autoFocus />
                </>
            }>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Voulez-vous continuer ?</span>
            </div>
        </Dialog>
    )
}

export default Niveau;