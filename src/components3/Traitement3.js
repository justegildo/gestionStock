import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { InputNumber } from 'primereact/inputnumber';
import DemandeService from '../services/DemandeService';
import LieuService from '../services/LieuService';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast'
import { Route, Switch, useHistory } from 'react-router-dom';


const Traitement = () => {
    const [yesNo, setYesNo] = useState({});
    const [chefParcform, setChefParcForm] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{ setChefParcForm, setYesNo }} />
                <ChefParcForm {...{ chefParcform, setYesNo }} />
                <Confirmation {...yesNo} />
            </div>

        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setChefParcForm, setYesNo } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        DemandeService.get((data, status) => {
            setLoading(false);
            if (status) setItems(data);
        },
            { size: itemPerPage }
        );
    }

    const showDemandeDetails = (item) => {
        setChefParcForm({
            visible: true,
            hide: () => setChefParcForm((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setChefParcForm((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    const table = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            loading={loading} globalFilter={globalFilter}
            responsiveLayout="scroll" emptyMessage="Aucune donnée disponible.">

            <Column field="id" header="Identifiant" sortable hidden />
            {/* <Column field="dateDemande" header="Date de demande" sortable 
                    body={(item)=> new Date(item.dateDemande).toLocaleDateString()}/> */}
            <Column field="utilisateur.nom" header="Demandeur" sortable body={(selectedItem) =>
                selectedItem.utilisateur && (selectedItem.utilisateur.nom + " "
                    + selectedItem.utilisateur.prenom)
            } />
            <Column field="lieu.libelle" header="Lieu" sortable />
            {/* <Column field="nbreParticipant" header="Nombre de participants" sortable /> */}
            <Column field="nbreVehicule" header="Nombre de véhicules" sortable style={{ fontWeight: 'bold' }} />
            <Column field="dateDebutActivite" header="Date début de l'activité" sortable
                body={(item) => new Date(item.dateDebutActivite).toLocaleDateString()} />
            <Column field="dateFinActivite" header="Date fin de l'activité" sortable
                body={(item) => new Date(item.dateFinActivite).toLocaleDateString()} />

            <Column field="etat" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etat === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etat === 'APPROUVEE' ? 'new'
                        : item.etat === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etat}
                </span>
            } />
            <Column body={(selectedItem) =>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                        onClick={() => showDemandeDetails(selectedItem)} />
                </div>
            } />
        </DataTable>
    );

    return (
        <>
            <h5>Liste des demandes</h5>
            <Toolbar className="mb-4"
                right={
                    <React.Fragment>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" placeholder="Recherche..."
                                onInput={(e) => setGlobalFilter(e.target.value)} />
                        </span>
                    </React.Fragment>
                } />

            <TabView activeIndex={activeIndex} onTabChange={(e) => { setActiveIndex(e.index);/* alert(e.index)*/ }} >
                <TabPanel header="Demandes en traitement">{table}</TabPanel>
                <TabPanel header="Demandes traitées">{table}</TabPanel>
            </TabView>
        </>
    );
}

const ChefParcForm = (props) => {
    const { visible, hide, data, setData, callback } = props.chefParcform;
    const { setYesNo } = props;
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [lieux, setLieux] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();

    useEffect(() => {
        setActiveIndex(0);
        history.replace("/traitement/step1")
        if (!visible) return;

    }, [visible])

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
            history.replace("/traitement/step1")
        } else {
            hide(e);
        }
    }

    const goNext = (e) => {
        if (activeIndex !== 1) {
            setActiveIndex(1);
            history.replace("/traitement/step2")
        }
    }

    const submit = (e) => {
        goNext();

        /*
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let request = {...data, utilisateur : {id: currentUser.utilisateur.id }}
        setYesNo(
            {   
                visible: true,
                message : data.id ? "Confirmez-vous la modification ?" : "Confirmez-vous l'ajout ?",
                hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
                callback : ()=> {
                    setLoading(true);
                    let onResponse = (data, status)=> {
                            setLoading(false);
                            if(!status) return;
                            hide();
                            callback();
                    }
                    //console.log(JSON.stringify(data, null, 2))
                    if(data.id) DemandeService.update(request, onResponse); 
                    else DemandeService.add(request, onResponse);
                },
            }
        )
            */
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data && data.id} onChange={bind} />
            </div>
            <div className="field" >
                <label htmlFor="lieu">Lieu</label>
                <Dropdown id="lieu" options={lieux} value={data?.lieu} onChange={bind}
                    optionLabel="libelle" /*optionValue="id"*/
                    placeholder="Aucune sélection" />
            </div>
            <div className="field" hidden>
                <label htmlFor="dateDemande">Date de demande</label>
                <Calendar id="dateDemande" value={data && data.dateDemande} onChange={bind} mask="99/99/9999" required />
            </div>
            <div className="field">
                <label htmlFor="nbreParticipant">Nombre de participants</label>
                <InputNumber id="nbreParticipant" value={data && data.nbreParticipant} onValueChange={bind} required />
            </div>
            <div className="field">
                <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                <InputNumber id="nbreVehicule" value={data && data.nbreVehicule} onValueChange={bind} required />
            </div>
            <div className="field">
                <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                <Calendar id="dateDebutActivite" value={data && data.dateDebutActivite} onChange={bind} mask="99/99/9999" required />
            </div>
            <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <Calendar id="dateFinActivite" value={data && data.dateFinActivite} onChange={bind} mask="99/99/9999" required />
            </div>
        </div>
    )

    const step2Form = (
        <div className='p-fluid'>
           <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <Calendar id="dateFinActivite" value={data && data.dateFinActivite} onChange={bind} mask="99/99/9999" required />
            </div>
        </div>
    )

    return (
        <Dialog visible={visible} style={{ width: '800px' }} modal className="p-fluid"
            header={
                <div className='flex flex-row align-items-center'>
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text mr-2"
                        onClick={goBack} />
                    <h5 className='m-0'>Traitement demande</h5>
                </div>
            }
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                    <Button className="p-button-text" loading={loading}
                        label={activeIndex === 1 ? "Terminer" : "Continuer"}
                        icon={`pi pi-${activeIndex === 1 ? "check" : "angle-right"}`}
                        iconPos={`${activeIndex === 1 ? "left" : "right"}`}
                        onClick={submit} />
                </>
            }
            onHide={hide}
        >
            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/traitement/step1') },
                    { label: 'Ajout véhicules', command: () => history.push('/traitement/step2') }
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true}
            />
            
                <Route path={'/traitement/step1'} exact
                    component={() => <div className='mt-5'>{step1Form}</div>} />
                <Route path={'/traitement/step2'}
                    component={() => <div className='mt-5'>{step2Form}</div>} />
                
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

{/*
return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de la demande" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Continuer" icon="pi pi-check" className="p-button-text"  loading={loading} />
                    </>
                } 
                onHide={hide}
                >  
    
                <TabView visible={visible} onHide={hide} >
                    <TabPanel header="Demandes initiées" >
                        <DataTable dataKey="id" value={items}>
                            <Column field="utilisateur.nom" header="Demandeur" sortable body= { (selectedItem)=>
                            selectedItem.utilisateur && (selectedItem.utilisateur.nom + " " 
                            + selectedItem.utilisateur.prenom)
                            } />
                            <Column field="etat" sortable body={ (item)=> 
                                <span className={`customer-badge status-${item.etat === 'ACCEPTEE'
                                        ? 'qualified' 
                                        : (item.etat === 'APPROUVEE' ? 'new' 
                                        : item.etat === 'REJETEE' ? 'unqualified' :  'proposal')}`}>
                                    {item.etat}
                                </span>
                            } />
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Demandes approuvées">
                    </TabPanel>
                </TabView>
            </Dialog>    
        )
*/}


export default Traitement;