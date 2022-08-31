import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import UtilisateurService from '../services/UtilisateurService';
import { itemPerPage } from '../baseUrls/consts'; 

const Utilisateur = () => {
    let emptyUtilisateur ={
        dateNais: "",
        id: 0,
        nationalite: "",
        nom: "",
        prenom: "",
        sexe: "",
        statutCompte: "",
        structure: {
            id: 0
        },
        telephone: "",
        typeUtilisateur: {
            id: 0
        },
        ville: ""
    }

    const [utilisateurs, setUtilisateurs] = useState(null);
    const [utilisateurDialog, setUtilisateurDialog] = useState(false);
    const [utilisateur, setUtilisateur] = useState(emptyUtilisateur);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        UtilisateurService.get( (data)=> {
            setUtilisateurs(data);
            setLoading(false);
        },
        {size: itemPerPage});
    }, []);

    const openNew = () => {
        setUtilisateur(emptyUtilisateur);
        setSubmitted(false);
        setUtilisateurDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUtilisateurDialog(false);
    }

    const editUtilisateur = (utilisateur) => {
        setUtilisateur({ ...utilisateur });
        setUtilisateurDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _utilisateur = { ...utilisateur };
        _utilisateur[`${name}`] = val;

        setUtilisateur(_utilisateur);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _utilisateur = { ...utilisateur };
        _utilisateur[`${name}`] = val;

        setUtilisateur(_utilisateur);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUtilisateur(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }

    const utilisateurDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );

    return (
        <div>
            <div className="card">
                <h5>Liste des utilisateurs</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={utilisateurs} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucun utilisateur disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '5%', textAlign: 'center'}} />
                    <Column field="nom" header="Nom" sortable style={{width: '30%', fontWeight: 'bold'}} />
                    <Column field="prenom" header="Prénom" sortable style={{width: '30%', fontWeight: 'bold'}} />
                    <Column field="telephone" header="Téléphone" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="typeUtilisateur" header="Type utilisateur" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="sexe" header="Sexe" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="structure.libelle" header="Structure" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="structure.institution.libelle" header="Institution" sortable style={{width: '20%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate} style={{width: '5%', fontWeight: 'bold'}}></Column>
                </DataTable>
            </div>
            <div>
            <Dialog visible={utilisateurDialog} style={{ width: '450px' }} header="Détails d'un utilisateur" modal className="p-fluid" 
                    footer={utilisateurDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="nom">Nom</label>
                            <InputText id="nom" value={utilisateur.nom} onChange={(e) => onInputChange(e, 'nom')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="prenom">Prénom</label>
                            <InputText id="prenom" value={utilisateur.prenom} onChange={(e) => onInputChange(e, 'prenom')} required autoFocus  />
                        </div>
                        <div className="field">
                            <label htmlFor="sexe">Sexe</label>
                            <InputText id="sexe" value={utilisateur.sexe} onChange={(e) => onInputChange(e, 'sexe')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="statutCompte">Statut compte</label>
                            <InputText id="statutCompte" value={utilisateur.statutCompte} onChange={(e) => onInputChange(e, 'statutCompte')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="nationalite">Nationalité</label>
                            <InputText id="nationalite" value={utilisateur.nationalite} onChange={(e) => onInputChange(e, 'nationalite')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="dateNais">Date de naissance</label>
                            <InputText id="dateNais" value={utilisateur.dateNais} onChange={(e) => onInputChange(e, 'dateNais')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="telephone">Téléphone</label>
                            <InputText id="telephone" value={utilisateur.telephone} onChange={(e) => onInputNumberChange(e, 'telephone')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="ville">Ville</label>
                            <InputText id="ville" value={utilisateur.ville} onChange={(e) => onInputNumberChange(e, 'ville')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="typeUtilisateur">Type utilisateur</label>
                            <InputText id="typeUtilisateur" value={utilisateur.typeUtilisateur.id} onChange={(e) => onInputNumberChange(e, 'typeUtilisateur.id')} required rows={3} cols={20} />
                        </div>
                       
                </Dialog>
            </div>
        </div>
    );
}

export default Utilisateur;
