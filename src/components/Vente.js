import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import VenteService from '../services/ApproviService';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { Dropdown } from 'primereact/dropdown';
import { Steps } from 'primereact/steps';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';

const Vente = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{ setForm, setYesNo }} />
                <Form {...{ form, setYesNo }} />
                <Confirmation {...yesNo} />
            </div>

        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setForm, setYesNo } = props;

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        VenteService.get((data, status) => {
            setLoading(false);
            if (status) setItems(data);
        },
            { size: itemPerPage }
        );
    }

    const openNew = () => {
        setForm({
            visible: true,
            hide: () => setForm((prev) => ({ ...prev, visible: false })),
            data: null,
            setData: (data) => setForm((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        });
    } 


    const editItem = (item) => {
        setForm({
            visible: true,
            hide: () => setForm((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setForm((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    const deleteItem = (item) => {
        setYesNo({
            visible: true,
            message: "Confirmez-vous la suppression ?",
            hide: () => setYesNo((prev) => ({ ...prev, visible: false })),
            callback: () => {
                setLoading(true);
                VenteService.delete(item.id, (data, status) => {
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }

    return (
        <>
            <h5>Liste des ventes</h5>
            <Toolbar className="mb-4"
                left={
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2"
                                onClick={openNew} />
                            <Button label="Actualiser" icon="pi pi-refresh" className="p-button-primry mr-2"
                                onClick={() => { setLoading(true); loadItems() }} />
                        </div>
                    </React.Fragment>
                }
                right={
                    <React.Fragment>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" placeholder="Recherche..." onInput={(e) => setGlobalFilter(e.target.value)} />
                        </span>
                    </React.Fragment>
                } />
            <DataTable dataKey="id" value={items}
                paginator rows={itemPerPage}
                loading={loading} globalFilter={globalFilter}
                responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

                <Column field="id" header="Identifiant" hidden sortable />
                <Column field="libelle" header="Libellé" sortable style={{ fontWeight: 'bold' }} />
                <Column field="observation" header="Observation" sortable />
                <Column field="typeEntreeSortie" header="Type entrée-sortie" sortable />

                <Column body={(selectedItem) =>
                    <div className="flex justify-content-end">
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(selectedItem)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => deleteItem(selectedItem)} />
                    </div>
                } />
            </DataTable>
        </>
    );
}

const Form = (props) => {
    const { visible, hide, data, setData, callback } = props.form;
    const { setYesNo } = props;
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const [activeIndex, setActiveIndex] = useState(0);
    const [stepCount, setStepCount] = useState(0);
    

    const bind = (e) => {
        if (e.target.value !== undefined) {
            let value = e.target.value;
            setData({ ...data, [e.target.id]: value });
        }
        else if (e.checked !== undefined) {
            setData({ ...data, [e.target.id]: e.target.checked });
        } else {
            alert("Binding fails.")
        }
    }

    const goBack = (e) => {
        if (activeIndex === 1) {
            setActiveIndex(0);
            history.replace("/vente")
        } else {
            hide(e);
        }
    }

    const goNext = (e) => {
        if (activeIndex !== 1) {
            setActiveIndex(1);
            history.replace("/vente/step2")
            return true;
        }
        return false;
    }
  
    const submit = () => {
        if(goNext()) return;
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data?.id} onChange={bind} />
            </div>
            <div className="field">
                <label htmlFor="libelle">Libellé</label>
                <InputText id="libelle" value={data?.libelle} onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="observation">Observation</label>
                <InputText id="observation" value={data?.obseravtion} onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="typeEntreeSortie">Type entrée-sortie</label>
                <Dropdown id="typeEntreeSortie" onChange={bind} placeholder="Aucune sélection"
                    options={["AJUSTEMENT", "ANNULATION_APPROVISIONNEMENT", "ANNULATION_VENTE", "APPROVISIONNEMENT", "INVENTAIRE", "VENTE"]}
                    value={data?.typeEntreeSortie} />
            </div>
        </div>
            
    );

    const step2Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" onChange={bind} />
            </div>
            <div className="field">
                <label htmlFor="prixVenteUnitaire">Prix vente unitaire</label>
                <InputText id="prixVenteUnitaire" onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="prixVenteTotal">Prix vente total</label>
                <InputText id="prixVenteTotal" onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="quantite">Quantité</label>
                <InputText id="quantite" onChange={bind} required placeholder='ex: ' />
            </div>
        </div>
    );


    return (
        <Dialog visible={visible} style={{ width: '800px' }} modal className="p-fluid"
            header={
                <div className='flex flex-row align-items-center'>
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text mr-2"
                        onClick={goBack} />
                    <h5 className='m-0'>Vente </h5>
                </div>
            }
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                
                    <Button className="p-button-text" loading={loading}
                        label={activeIndex === 0 ? "Continuer" : "Terminer"}
                        icon={`pi pi-${activeIndex === 0 ? "angle-right" : "check"}`}
                        iconPos={`${activeIndex === 0 ? "right" : "left"}`}
                        onClick={submit} />
                </>
            }
            onHide={hide} >

            <Steps className='mt-1'
                model={[
                    { label: 'Détails ', command: () => history.push('/vente') },
                    { 
                        label: "Vente",
                        command: () => history.push('/vente/step2') 
                    }
                 
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} 
                />
            
            <Route path={'/vente'} exact render={() => <div className='mt-5'>{step1Form}</div>} />
            <Route path={'/vente/step2'} render={() => <div className='mt-5'>{step2Form}</div>} />
            
        </Dialog>
    )
}

const Confirmation = (props) => {
    const { visible, hide, message, callback } = props;

    return (
        <Dialog modal visible={visible} onHide={hide}
            header="Confirmation" style={{ width: '350px' }}
            footer={
                <>
                    <Button type="button" label="Non" icon="pi pi-times"
                        onClick={hide}
                        className="p-button-text" />
                    <Button type="button" label="Oui" icon="pi pi-check"
                        onClick={() => { hide(); callback() }}
                        className="p-button-text" autoFocus />
                </>
            }>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>{message != null ? message : "Voulez-vous continuer ?"}</span>
            </div>
        </Dialog>
    )
}

export default Vente;