import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';



export default function TestTableIns() {
    let emptyInstitut = {
        id: 0,
        libelle:'',
        nomChefParc: '',
        prenomChefParc: '',
        emailChefParc: '',
        contact: '',
        nomResponsable: '',
        email: ''
    };

    const [instituts, setInstituts] = useState(null);
    const [institutDialog, setInstitutDialog] = useState(false);
    const [deleteInstitutDialog, setDeleteInstitutDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [institut, setInstitut] = useState(emptyInstitut);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        const axios = require('axios');
        axios.get('https://ms-parc.herokuapp.com/api/crud/institution/get?', {
            params: {
                size: 20
            }
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
                setInstituts(response.data); 
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            })

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

    const hideDeleteInstitutDialog = () => {
        setDeleteInstitutDialog(false);
    }

    const saveInstitut = () => {
        setSubmitted(true);

        if (institut.name.trim()) {
            let _instituts = [...instituts];
            let _institut = { ...institut };
            if (institut.id) {
                const index = findIndexById(institut.id);

                _instituts[index] = _institut;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Institution modifiée', life: 3000 });
            }
            else {
                _institut.id = createId();
                _instituts.push(_institut);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Institution créee', life: 3000 });
            }

            setInstituts(_instituts);
            setInstitutDialog(false);
            setInstitut(emptyInstitut);
        }
    }

    const editInstitut = (institut) => {
        setInstitut({ ...institut });
        setInstitutDialog(true);
    }

    const confirmDeleteInstitut = (institut) => {
        setInstitut(institut);
        setDeleteInstitutDialog(true);
    }

    const deleteInstitut = () => {
        let _instituts = instituts.filter(val => val.id !== institut.id);
        setInstituts(_instituts);
        setDeleteInstitutDialog(false);
        setInstitut(emptyInstitut);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Institution supprimée', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < instituts.length; i++) {
            if (instituts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInstitut(APIData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteInstitut(APIData)}/>
            </div>
        );
    }

    const institutDialogFooter = (
        <>
            <Button label="Retour" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={saveInstitut}/>
        </>
    );

    const deleteInstitutDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstitutDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteInstitut}/>
        </>
    );
    
    //<!-- className="p-datatable-gridlines" showGridlines --> 
    return (
        <div className="col-12">
            <div className="card">
                <h5>Recent Sales</h5>
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable value={instituts} rows={4} paginator responsiveLayout="scroll"  
                    loading={loading} globalFilter={globalFilter} emptyMessage="Aucune institution disponible.">
                    <Column field="id" header="Matricule" sortable style={{width: '10%', textAlign: 'center'}} />
                    <Column field="libelle" header="Libellé" sortable style={{width: '50%', fontWeight: 'bold'}} />
                    <Column field="nomResponsable" header="Responsable" sortable style={{width: '20%'}}/>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
            <div>
                <Dialog visible={institutDialog} style={{ width: '450px' }} header="Détails d'une institution" modal className="p-fluid" 
                    footer={institutDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="libelle">Libellé</label>
                            <InputText id="libelle" value={institut.libelle} onChange={(e) => onInputChange(e, 'libelle')} required autoFocus  />
                        </div>
                        <div className="field">
                            <label htmlFor="nomChefParc">Nom chef parc</label>
                            <InputText id="nomChefParc" value={institut.nomChefParc} onChange={(e) => onInputChange(e, 'nomChefParc')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="prenomChefParc">Prénom chef parc</label>
                            <InputText id="prenomChefParc" value={institut.prenomChefParc} onChange={(e) => onInputChange(e, 'prenomChefParc')} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="emailChefParc">Email chef parc</label>
                            <InputText id="emailChefParc" value={institut.emailChefParc} onChange={(e) => onInputChange(e, 'emailChefParc')} required rows={3} cols={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="contact">Contact</label>
                            <InputNumber id="contact" value={institut.contact} onChange={(e) => onInputNumberChange(e, 'contact')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label htmlFor="nomResponsable">Nom Responsable</label>
                            <InputText id="nomResponsable" value={institut.nomResponsable} onChange={(e) => onInputChange(e, 'nomResponsable')} required rows={3} cols={20}  />
                        </div>
                        <div className="field ">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={institut.email}  required rows={3} onChange={(e) => onInputChange(e, 'email')} cols={20} />
                        </div>

                </Dialog>
            </div>
            <div>
                <Dialog visible={deleteInstitutDialog} style={{ width: '450px' }} header="Confirmation" modal 
                    footer={deleteInstitutDialogFooter} onHide={hideDeleteInstitutDialog}>

                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {institut && <span>Voulez-vous vraiment supprimé  <b>{institut.libelle}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

