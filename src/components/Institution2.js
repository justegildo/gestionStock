import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


const Institution2 = () => {
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
    const [deleteInstitutsDialog, setDeleteInstitutsDialog] = useState(false);
    const [institut, setInstitut] = useState(emptyInstitut);
    const [selectedInstituts, setSelectedInstituts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
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

    const hideDeleteInstitutsDialog = () => {
        setDeleteInstitutsDialog(false);
    }

    const saveInstitut = () => {
        setSubmitted(true);

        if (institut.name.trim()) {
            let _instituts = [...instituts];
            let _institut = { ...institut };
            if (institut.id) {
                const index = findIndexById(institut.id);

                _instituts[index] = _institut;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                _institut.id = createId();
                _instituts.push(_institut);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
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
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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

   

    const confirmDeleteSelected = () => {
        setDeleteInstitutsDialog(true);
    }

    const deleteSelectedInstituts = () => {
        let _instituts = instituts.filter(val => !selectedInstituts.includes(val));
        setInstituts(_instituts);
        setDeleteInstitutsDialog(false);
        setSelectedInstituts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedInstituts || !selectedInstituts.length} />
                </div>
            </React.Fragment>
        )
    }

  

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const libelleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Libellé</span>
                {rowData.libelle}
            </>
        );
    }

    const nomChefParcBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nom chef Parc</span>
                {rowData.nomChefParc}
            </>
        );
    }

    const prenomChefParcBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Prénom chef Parc</span>
                {rowData.prenomChefParc}
            </>
        );
    }
    const emailChefParcBodyTemplate = (rowData) => {
        return (
            <>
               <span className="p-column-title">Email Chef Parc</span>
                {rowData.emailChefParc}
            </>
        )
    }
    const contactBodyTemplate = (rowData) => {
        return (
            <>
               <span className="p-column-title">Contact</span>
                {rowData.contact}
            </>
        )
    }

    const nomResponsableBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nom responsable</span>
                {rowData.nomResponsable}
            </>
        );
    }
    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    }

  
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInstitut(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteInstitut(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const institutDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveInstitut} />
        </>
    );
    const deleteInstitutDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstitutDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteInstitut} />
        </>
    );
    const deleteInstitutsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstitutsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedInstituts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                    <DataTable ref={dt} value={instituts} selection={selectedInstituts} onSelectionChange={(e) => setSelectedInstituts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Projection {first} à {last} de {totalRecords} institution"
                        globalFilter={globalFilter} emptyMessage="Aucune institution disponible." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '1rem'}}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="libelle" header="Libellé" sortable body={libelleBodyTemplate} headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="nomResponsable" header="Nom responsable" body={nomResponsableBodyTemplate} sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable headerStyle={{ width: '8rem', minWidth: '5rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={institutDialog} style={{ width: '450px' }} header="Détails de l'institution" modal className="p-fluid" footer={institutDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="libelle">Libellé</label>
                            <InputText id="libelle" value={institut.libelle} onChange={(e) => onInputChange(e, 'libelle')} required autoFocus className={classNames({ 'p-invalid': submitted && !institut.libelle })} />
                            {submitted && !institut.libelle && <small className="p-invalid">Le Libellé est recommandé</small>}
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
                                <InputNumber id="nomResponsable" value={institut.nomResponsable} onValueChange={(e) => onInputNumberChange(e, 'nomResponsable')} required rows={3} cols={20}  />
                            </div>
                            <div className="field col">
                                <label htmlFor="email">Email</label>
                                <InputNumber id="email" value={institut.email} onValueChange={(e) => onInputNumberChange(e, 'email')} required rows={3} cols={20} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInstitutDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInstitutDialogFooter} onHide={hideDeleteInstitutDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {institut && <span>Are you sure you want to delete <b>{institut.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInstitutsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInstitutsDialogFooter} onHide={hideDeleteInstitutsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {institut && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Institution2, comparisonFn);