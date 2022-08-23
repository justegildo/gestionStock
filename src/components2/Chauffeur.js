import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


const Chauffeur = () => {
    let emptyChauffeur = {
        dateNais: "",
        etatChauffeur: "",
        id: 0,
        institution: {
            id: 0
        },
        nationalite: "",
        nom: "",
        prenom: "",
        sexe: "",
        telephone: "",
        ville: ""
    }

    const [chauffeurs, setChauffeurs] = useState(null);
    const [chauffeurDialog, setChauffeurDialog] = useState(false);
    const [chauffeur, setChauffeur] = useState(emptyChauffeur);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);


    useEffect(() => {
        const axios = require('axios');
        axios.get('https://ms-parc.herokuapp.com/api/crud/cva/get?', {
            params: {
                size: 20
            }
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
                setChauffeurs(response.data); 
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            })

    }, []);

    const openNew = () => {
        setChauffeur(emptyChauffeur);
        setSubmitted(false);
        setChauffeurDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setChauffeurDialog(false);
    }

    const editChauffeur = (chauffeur) => {
        setChauffeur({ ...chauffeur });
        setChauffeurDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _chauffeur = { ...chauffeur };
        _chauffeur[`${name}`] = val;

        setChauffeur(_chauffeur);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _chauffeur = { ...chauffeur };
        _chauffeur[`${name}`] = val;

        setChauffeur(_chauffeur);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editChauffeur(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }

    const chauffeurDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );
    return (
        <div>
            <div className="card">
                <h5>Liste des chauffeurs</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={chauffeurs} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucun chauffeur disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '2%', textAlign: 'center'}} />
                    <Column field="nom" header="Nom" sortable style={{width: '20%', fontWeight: 'bold'}} />
                    <Column field="prenom" header="Prénom" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="telephone" header="Téléphone" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="etatChauffeur" header="Etat chauffeur" sortable style={{width: '20%', fontWeight: 'bold'}} />
                    <Column field="institution.libelle" header="Institution" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="sexe" header="Sexe" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate} style={{width: '5%', fontWeight: 'bold'}}></Column>
                </DataTable>
            </div>
            <div>
            <Dialog visible={chauffeurDialog} style={{ width: '450px' }} header="Détails d'un chauffeur" modal className="p-fluid" 
                    footer={chauffeurDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="institution">Institution matricule</label>
                            <InputText id="institution" value={chauffeur.institution.id} onChange={(e) => onInputNumberChange(e, 'institution.id')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" value={chauffeur.nom} onChange={(e) => onInputChange(e, 'nom')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="prenom">Prénom</label>
                            <InputText id="prenom" value={chauffeur.prenom} onChange={(e) => onInputChange(e, 'prenom')} required autoFocus  />
                        </div>
                        <div className="field">
                            <label htmlFor="sexe">Sexe</label>
                            <InputText id="sexe" value={chauffeur.sexe} onChange={(e) => onInputChange(e, 'sexe')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="nationalite">Nationalite</label>
                            <InputText id="nationalite" value={chauffeur.nationalite} onChange={(e) => onInputChange(e, 'nationalite')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="etatChauffeur">Etat chauffeur</label>
                            <InputText id="etatChauffeur" value={chauffeur.etatChauffeur} onChange={(e) => onInputChange(e, 'etatChauffeur')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="dateNais">Date de naissance</label>
                            <InputText id="dateNais" value={chauffeur.dateNais} onChange={(e) => onInputChange(e, 'dateNais')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="telephone">Téléphone</label>
                            <InputText id="telephone" value={chauffeur.telephone} onChange={(e) => onInputNumberChange(e, 'telephone')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="ville">Ville</label>
                            <InputText id="ville" value={chauffeur.ville} onChange={(e) => onInputNumberChange(e, 'ville')} required rows={3} cols={20} />
                        </div>
                       
                </Dialog>
            </div>
        </div>
    );
}

export default Chauffeur;
