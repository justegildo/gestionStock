import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import InstitutionService from '../services/InstitutionService';
import { itemPerPage } from '../baseUrls/consts';

const Institution = () => {
    let emptyInstitut = {
        id: 0,
        libelle: '',
        nomChefParc: '',
        prenomChefParc: '',
        emailChefParc: '',
        contact: '',
        nomResponsable: '',
        email: '',
        niveau: {
            id: 0
        },
    };


    const [instituts, setInstituts] = useState(null);
    const [institutDialog, setInstitutDialog] = useState(false);
    const [institut, setInstitut] = useState(emptyInstitut);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        InstitutionService.get((data) => {
            setInstituts(data);
            setLoading(false);
        }, 
        {size: itemPerPage});
    }, []);

    const openNew = () => {
        setInstitut(emptyInstitut);
        setSubmitted(false);
        setInstitutDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setInstitutDialog(false);
    }

    const editInstitut = (institut) => {
        setInstitut({ ...institut });
        setInstitutDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _institut = { ...institut };
        _institut[`${name}`] = val;

        setInstitut(_institut);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _institut = { ...institut };
        _institut[`${name}`] = val;

        setInstitut(_institut);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" placeholder="Recherche..." onInput={(e) => setGlobalFilter(e.target.value)} />
                </span>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (APIData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInstitut(APIData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" />
            </div>
        );
    }

    const institutDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text" />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" />
        </>
    );
    return (
        <div>
            <div className="card">
                <h5>Liste des institutions</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={instituts} rows={itemPerPage} paginator responsiveLayout="scroll"
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucune institution disponible.">
                    <Column field="id" header="Matricule" sortable style={{ width: '10%', textAlign: 'center' }} />
                    <Column field="libelle" header="Libellé" sortable style={{ width: '50%', fontWeight: 'bold' }} />
                    <Column field="nomResponsable" header="Responsable" sortable style={{ width: '20%' }} />
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
            <div>
                <Dialog visible={institutDialog} style={{ width: '450px' }} header="Détails de l'institution" modal className="p-fluid" footer={institutDialogFooter} onHide={hideDialog}>

                    <div className="field">
                        <label htmlFor="libelle">Libellé</label>
                        <InputText id="libelle" value={institut.libelle} onChange={(e) => onInputChange(e, 'libelle')} required autoFocus />
                    </div>
                    <div className="field">
                        <label htmlFor="niveau">Niveau matricule</label>
                        <InputText id="niveau" value={institut.niveau.id} onChange={(e) => onInputChange(e, 'niveau.id')} required autoFocus />
                    </div>
                    <div className="field">
                        <label htmlFor="nomChefParc">Nom chef parc</label>
                        <InputTextarea id="nomChefParc" value={institut.nomChefParc} onChange={(e) => onInputChange(e, 'nomChefParc')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="prenomChefParc">Prénom chef parc</label>
                        <InputTextarea id="prenomChefParc" value={institut.prenomChefParc} onChange={(e) => onInputChange(e, 'prenomChefParc')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="emailChefParc">Email chef parc</label>
                        <InputTextarea id="emailChefParc" value={institut.emailChefParc} onChange={(e) => onInputChange(e, 'emailChefParc')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="contact">Contact</label>
                        <InputTextarea id="contact" value={institut.contact} onChange={(e) => onInputChange(e, 'contact')} required rows={3} cols={20} />
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="nomResponsable">Nom Responsable</label>
                            <InputNumber id="nomResponsable" value={institut.nomResponsable} onValueChange={(e) => onInputChange(e, 'nomResponsable')} required rows={3} cols={20} />
                        </div>
                        <div className="field col">
                            <label htmlFor="email">Email</label>
                            <InputNumber id="email" value={institut.email} onValueChange={(e) => onInputChange(e, 'email')} required rows={3} cols={20} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default Institution;