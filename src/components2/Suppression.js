import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';

const Suppression = () => {
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
    const [deleteInstitutDialog, setDeleteInstitutDialog] = useState(false);
    const [institut, setInstitut] = useState(emptyInstitut);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() =>{
        const axios = require('axios');
        axios.get('https://ms-parc.herokuapp.com/api/crud/institution/get?', {
            params: {
                size: 3
              }
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data, null, 2));
                setInstituts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })

    }, []);

    const hideDeleteInstitutDialog = () => {
        setDeleteInstitutDialog(false);
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
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteInstitut(rowData)} />
            </div>
        );
    }

    const deleteInstitutDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstitutDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteInstitut} />
        </>
    );
    
    return (
        <div>
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable ref={dt} value={instituts}  
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Projection {first} à {last} de {totalRecords} institution"
                         emptyMessage="Aucune institution disponible."  responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem'}}></Column>
                        <Column field="id" header="Id" sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="libelle" header="Libellé" sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="nomResponsable" header="Nom responsable" sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
                <Dialog visible={deleteInstitutDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInstitutDialogFooter} onHide={hideDeleteInstitutDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {institut && <span>Are you sure you want to delete <b>{institut.libelle}</b>?</span>}
                        </div>
                    </Dialog>

                    
        </div>
    );
}

export default Suppression;
