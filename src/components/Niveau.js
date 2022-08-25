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
                    <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew}/>
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

export default Niveau;
