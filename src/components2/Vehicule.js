import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import VehiculeService from '../services/VehiculeService';

const Vehicule = () => {
    let emptyVehicule = {
        id: 0,
        categorie: "",
        etatActuel: "",
        immatriculation: "",
        institution: {
            id: 0
        },
        kilometrage: 0,
        marque: "",
        modele: "",
        typeEnergie: "",
        typeTransmission: "",
        vitesse: 0
    }

    const [vehicules, setVehicules] = useState(null);
    const [vehiculeDialog, setVehiculeDialog] = useState(false);
    const [vehicule, setVehicule] = useState(emptyVehicule);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);


    useEffect(() => {
        VehiculeService.getVehicule( (data)=> {
        setVehicules(data);
        setLoading(false);
        });
    }, []);

    const openNew = () => {
        setVehicule(emptyVehicule);
        setSubmitted(false);
        setVehiculeDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setVehiculeDialog(false);
    }

    const editVehicule = (utilisateur) => {
        setVehicule({ ...utilisateur });
        setVehiculeDialog(true);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _vehicule = { ...vehicule };
        _vehicule[`${name}`] = val;

        setVehicule(_vehicule);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _vehicule = { ...vehicule };
        _vehicule[`${name}`] = val;

        setVehicule(_vehicule);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editVehicule(APIData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"/>
            </div>
        );
    }

    const vehiculeDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text"  />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text"/>
        </>
    );
    return (
        <div>
            <div className="card">
                <h5>Liste des véhicules</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={vehicules} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucun véhicule disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '2%', textAlign: 'center'}} />
                    <Column field="immatriculation" header="Immatriculation" sortable style={{width: '20%', fontWeight: 'bold'}} />
                    <Column field="marque" header="Marque" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="model" header="Modèle" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column field="etatActuel" header="Etat actuel" sortable style={{width: '20%', fontWeight: 'bold'}} />
                    <Column field="kilometrage" header="Kilométrage" sortable style={{width: '5%', fontWeight: 'bold'}} />
                    <Column field="vitesse" header="Vitesse" sortable style={{width: '10%', fontWeight: 'bold'}} />
                    <Column body={actionBodyTemplate} style={{width: '5%', fontWeight: 'bold'}}></Column>
                </DataTable>
            </div>
            <div>
            <Dialog visible={vehiculeDialog} style={{ width: '450px' }} header="Détails d'un véhicule" modal className="p-fluid" 
                    footer={vehiculeDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="immatriculation">Immatriculation</label>
                            <InputText id="immatriculation" value={vehicule.immatriculation} onChange={(e) => onInputNumberChange(e, 'immatriculation')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="institution">institution id</label>
                            <InputText id="institution" value={vehicule.institution.id} onChange={(e) => onInputChange(e, 'institution.id')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="categorie">Catégorie</label>
                            <InputText id="categorie" value={vehicule.catgorie} onChange={(e) => onInputChange(e, 'categorie')} required autoFocus  />
                        </div>
                        <div className="field">
                            <label htmlFor="etatActuel">Etat Actuel</label>
                            <InputText id="etatActuel" value={vehicule.etatActuel} onChange={(e) => onInputChange(e, 'etatActuel')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="kilometrage">Kilométrage</label>
                            <InputText id="kilometrage" value={vehicule.kilometrage} onChange={(e) => onInputChange(e, 'kilometrage')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="marque">Marque</label>
                            <InputText id="marque" value={vehicule.marque} onChange={(e) => onInputChange(e, 'marque')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="vitesse">Vitesse</label>
                            <InputText id="vitesse" value={vehicule.vitesse} onChange={(e) => onInputChange(e, 'vitesse')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="typeEnergie">Type énergie</label>
                            <InputText id="typeEnergie" value={vehicule.typeEnergie} onChange={(e) => onInputNumberChange(e, 'typeEnergie')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="modele">Modele</label>
                            <InputText id="modele" value={vehicule.modele} onChange={(e) => onInputChange(e, 'modele')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="typeTransmission">Type transmission</label>
                            <InputText id="typeTransmission" value={vehicule.typeTransmission} onChange={(e) => onInputChange(e, 'typeTransmission')} required rows={3} cols={20} />
                        </div>
                       
                </Dialog>
            </div>
        </div>
    );
}

export default Vehicule;
