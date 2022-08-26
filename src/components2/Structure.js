import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import StructureService from '../services/StructureService';

const Structure = () => {   
    let emptyStructure ={
        id: 0,
        institution: {
            id: 0
        },
        libelle: "",
        responsable: "",
        telephone: ""
    }
    const [structures, setStructures] = useState(null);
    const [structureDialog, setStructureDialog] = useState(false);
    const [structure, setStructure] = useState(emptyStructure);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        StructureService.getStructure( (data)=> {
            setStructures(data);
            setLoading(false);
        });
    }, []);

    const openNew = () => {
        setStructure(emptyStructure);
        setSubmitted(false);
        setStructureDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setStructureDialog(false);
    }

    const editStructure = (structure) => {
        setStructure({ ...structure });
        setStructureDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _structure = { ...structure };
        _structure[`${name}`] = val;

        setStructure(_structure);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _structure = { ...structure };
        _structure[`${name}`] = val;

        setStructure(_structure);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editStructure(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }
    const structureDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );

    return (
        <div>
            <div className="card">
                <h5>Liste des structures</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={structures} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucune structure disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '10%', textAlign: 'center'}} />
                    <Column field="libelle" header="Libellé" sortable style={{width: '40%', fontWeight: 'bold'}} />
                    <Column field="responsable" header="Responsable" sortable style={{width: '30%', fontWeight: 'bold'}} />
                    <Column field="telephone" header="Téléphone" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate} style={{width: '10%', fontWeight: 'bold'}}></Column>
                </DataTable>
            </div>
            <div>
            <Dialog visible={structureDialog} style={{ width: '450px' }} header="Détails d'une structure" modal className="p-fluid" 
                    footer={structureDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="institution_id">Institution id</label>
                            <InputText id="institution_id" value={structure.institution.id} onChange={(e) => onInputNumberChange(e, 'institution.id')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="libelle">Libellé</label>
                            <InputText id="libelle" value={structure.libelle} onChange={(e) => onInputChange(e, 'libelle')} required autoFocus  />
                        </div>
                        <div className="field">
                            <label htmlFor="responsable">Responsable</label>
                            <InputText id="responsable" value={structure.responsable} onChange={(e) => onInputChange(e, 'responsable')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="telephone">Téléphone</label>
                            <InputText id="telephone" value={structure.telephone} onChange={(e) => onInputNumberChange(e, 'telephone')} required rows={3} cols={20} />
                        </div>
                       
                </Dialog>
            </div>
        </div>
    );
}

export default Structure;
