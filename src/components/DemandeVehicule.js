import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

const DemandeVehicule = () => {
    let emptyDemande = {
        arrondissement: "",
        commune: "",
        dateDebutActivite: "",
        dateDemande: "",
        dateFinActivite: "",
        departement: "",
        id: 0,
        intituleActivite: "",
        lieu: {
            id: 0
        },
        nbreParticipant: 0,
        nbreVehicule: 0,
        observation: "",
        reponses: [
        {
            cvaId: 0,
            vehiculeId: 0
        }
        ],
        typeActivite: "",
        utilisateur: {
            id: 0
        }
    }

    const [demandes, setDemandes] = useState(null);
    const [demandeDialog, setDemandeDialog] = useState(false);
    const [demande, setDemande] = useState(emptyDemande);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        const axios = require('axios');
        axios.get('https://ms-parc.herokuapp.com/api/crud/demande-vehicule/get?', {
            params: {
                size: 20
            }
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
                setDemandes(response.data); 
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            })

    }, []);

    const openNew = () => {
        setDemande(emptyDemande);
        setSubmitted(false);
        setDemandeDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDemandeDialog(false);
    }

    const editDemande = (demande) => {
        setDemande({ ...demande });
        setDemandeDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _demande = { ...demande };
        _demande[`${name}`] = val;

        setDemande(_demande);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _demande = { ...demande };
        _demande[`${name}`] = val;

        setDemande(_demande);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDemande(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }

    const demandeDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );

    return (
        <div>
            <div className="card">
                <h5>Liste des demandes</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={demandes} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucune demande disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '10%', textAlign: 'center'}} />
                    <Column field="intituleActivite" header="Intitule activité" sortable style={{width: '40%', fontWeight: 'bold'}} />
                    <Column field="dateDebutActivite" header="Date début activité" sortable style={{width: '30%', fontWeight: 'bold'}} />
                    <Column field="dateFinActivite" header="Date fin activité" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="dateDemande" header="Date demande" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="typeActivite" header="Type activité" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate} style={{width: '10%', fontWeight: 'bold'}}></Column>
                </DataTable>
            </div>
            <div>
            <Dialog visible={demandeDialog} style={{ width: '450px' }} header="Détails d'une demande" modal className="p-fluid" 
                footer={demandeDialogFooter} onHide={hideDialog}>
                    
                    <div className="field">
                        <label htmlFor="utilisateur">Utilisateur matricule</label>
                        <InputText id="utilisateur" value={demande.utilisateur.id} onChange={(e) => onInputNumberChange(e, 'utilisateur.id')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="departement">Département</label>
                        <InputText id="departement" value={demande.departement} onChange={(e) => onInputChange(e, 'departement')} required rows={3} cols={10} />
                    </div>
                    <div className="field">
                        <label htmlFor="commune">Commune</label>
                        <InputText id="commune" value={demande.commune} onChange={(e) => onInputChange(e, 'commune')} required autoFocus  />
                    </div>
                    <div className="field">
                        <label htmlFor="arrondissement">Arrondissement</label>
                        <InputText id="arrondissement" value={demande.arrondissement} onChange={(e) => onInputChange(e, 'arrondissement')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="intituleActivite">Intitulé activité</label>
                        <InputText id="intituleActivite" value={demande.intituleActivite} onChange={(e) => onInputChange(e, 'intituleActivite')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="typeActivite">Type activité</label>
                        <InputText id="typeActivite" value={demande.typeActivite} onChange={(e) => onInputChange(e, 'typeActivite')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="lieu">Lieu matricule</label>
                        <InputText id="lieu" value={demande.lieu.id} onChange={(e) => onInputNumberChange(e, 'lieu.id')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="dateDebutActivite">Date début activité</label>
                        <InputText id="dateDebutActivite" value={demande.dateDebutActivite} onChange={(e) => onInputChange(e, 'dateDebutActivite')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="dateFinActivite">Date fin activité</label>
                        <InputText id="dateFinActivite" value={demande.dateFinActivite} onChange={(e) => onInputChange(e, 'dateFinActivite')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="dateDemande">Date demande</label>
                        <InputText id="dateDemande" value={demande.dateDemande} onChange={(e) => onInputChange(e, 'dateDemande')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="nbreParticipant">Nombre participant</label>
                        <InputText id="nbreParticipant" value={demande.nbreParticipant} onChange={(e) => onInputNumberChange(e, 'nbreParticipant')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="nbreVehicule">Nombre véhicule</label>
                        <InputText id="nbreVehicule" value={demande.nbreVehicule} onChange={(e) => onInputNumberChange(e, 'nbreVehicule')} required rows={3} cols={20} />
                    </div>
                    <div className="field">
                        <label htmlFor="observation">Observation</label>
                        <InputTextarea id="observation" value={demande.observation} onChange={(e) => onInputChange(e, 'observation')} required rows={3} cols={20} />
                    </div>
                   
            </Dialog>
            </div>
            
        </div>
    );
}

export default DemandeVehicule;
