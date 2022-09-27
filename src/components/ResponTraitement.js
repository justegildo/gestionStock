import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { InputNumber } from 'primereact/inputnumber';
import DemandeService from '../services/DemandeService';
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast'
import { Route, Switch, useHistory } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode, FilterOperator } from 'primereact/api';



const ResponTraitement = () => {
    const [yesNo, setYesNo] = useState({});
    const [responsableStructure, setResponsableStructure] = useState({});

    return (
        <div>
            <div className="card">
                <Table {...{ setResponsableStructure, setYesNo }} />
                <ResponsableStructure {...{ responsableStructure, setYesNo }} />
                <Confirmation {...yesNo} />
            </div>

        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setResponsableStructure, setYesNo } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [filters1, setFilters1] = useState(null);
    const [filters2, setFilters2] = useState(null);
    const [filters3, setFilters3] = useState(null);

    useEffect(() => {
        loadItems();
        initFilters1();
        initFilters2();
        initFilters3();
    }, []);

    const initFilters1 = () => {
        setFilters1({
            'etatDemande': { operator: FilterOperator.AND, 
                constraints: [{ value: 'INITIEE', matchMode: FilterMatchMode.EQUALS }] },
        });
    }

    const initFilters2 = () => {
        setFilters2({
            'etatDemande': { operator: FilterOperator.AND, 
                constraints: [{ value: 'ACCEPTEE', matchMode: FilterMatchMode.EQUALS }] },
        });
    }

    const initFilters3 = () => {
        setFilters3({
            'etatDemande': { operator: FilterOperator.AND, 
                constraints: [{ value: 'REJETEE', matchMode: FilterMatchMode.EQUALS }] },
        });
    }

    const loadItems = () => {
        DemandeService.get((data, status) => {
            setLoading(false);
            if (status) setItems(data);
        },
            { size: itemPerPage }
        );
    }

    const showDemandeDetails = (item) => {
        setResponsableStructure({
            visible: true,
            hide: () => setResponsableStructure((prev) => ({ ...prev, visible: false })),
            data: item,
            setData: (data) => setResponsableStructure((prev) => ({ ...prev, data })),
            callback: () => {
                setLoading(true);
                loadItems();
            }
        })
    }

    const table = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            filters={filters1}
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

            <Column field="etatDemande" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etatDemande === 'APPROUVEE' ? 'new'
                        : item.etatDemande === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etatDemande}
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

    const table2 = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            loading={loading} globalFilter={globalFilter}
            filters={filters2}
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

            <Column field="etatDemande" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etatDemande === 'APPROUVEE' ? 'new'
                        : item.etatDemande === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etatDemande}
                </span>
            } />
            {/* <Column body={(selectedItem) =>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                        onClick={() => showDemandeDetails(selectedItem)} />
                </div>
            } /> */}
        </DataTable>
    );

    const table3 = (
        <DataTable dataKey="id" value={items}
            paginator rows={itemPerPage}
            filters={filters3}
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

            <Column field="etatDemande" header="Etat" sortable body={(item) =>
                <span className={`customer-badge status-${item.etatDemande === 'ACCEPTEE'
                    ? 'qualified'
                    : (item.etatDemande === 'APPROUVEE' ? 'new'
                        : item.etatDemande === 'REJETEE' ? 'unqualified' : 'proposal')}`}>
                    {item.etatDemande}
                </span>
            } />
            {/* <Column body={(selectedItem) =>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2"
                        onClick={() => showDemandeDetails(selectedItem)} />
                </div>
            } /> */}
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
                <TabPanel header="Demandes traitées">{table2}</TabPanel>
                <TabPanel header="Demandes rejetées">{table3}</TabPanel> 
            </TabView>
        </>
    );
}

const ResponsableStructure = (props) => {
    const { visible, hide, data, setData, callback } = props.responsableStructure;
    const { setYesNo } = props;
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [lieux, setLieux] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();

    useEffect(() => {
        setActiveIndex(0);
        history.replace("/responsable/step1")
        if (!visible) return;
    }, [visible])

   
    const bind = (e) => {
        //console.log(JSON.stringify(reponse, null, 2))
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

    const goNext = (e) => {
        if (activeIndex !== 1) {
            setActiveIndex(1);
            history.replace("/responsable/step2")
            return true;
        }
        return false;
    }
    
    const goBack = (e) => {
        if (activeIndex === 1) {
            setActiveIndex(0);
            history.replace("/traitement/step1")
        } else {
            hide(e);
        }
    } 

    const submit = (e) => {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        let request = {...data, utilisateur : {id: currentUser.utilisateur.id }}
        setYesNo(
            {   
                visible: true,
                message : data.id ? "Confirmez-vous la demande ?" : "Confirmez-vous l'ajout ?",
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
            
    }

    const step1Form = (
        <div className='p-fluid'>
            <div className="field" hidden>
                <label htmlFor="id">Identifiant</label>
                <InputText id="id" value={data && data.id} />
            </div>
            <div className="field" >
                <label htmlFor="dateDemande">Date de demande</label>
                <Calendar id="dateDemande" value={data && new Date(data.dateDemande)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
            <div className="field" >
                <label htmlFor="lieu">Lieu</label>
                <InputText id="lieu" value={data?.lieu.libelle} readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreParticipant">Nombre de participants</label>
                <InputNumber id="nbreParticipant" value={data && data.nbreParticipant} 
                    required readOnly />
            </div>
            <div className="field">
                <label htmlFor="nbreVehicule">Nombre de véhicules</label>
                <InputNumber id="nbreVehicule" value={data && data.nbreVehicule} readOnly/>
            </div>
            <div className="field">
                <label htmlFor="dateDebutActivite">Date début de l'activité</label>
                <Calendar id="dateDebutActivite" value={data && new Date(data.dateDebutActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
                    
            </div>
            <div className="field">
                <label htmlFor="dateFinActivite">Date fin de l'activité</label>
                <Calendar id="dateFinActivite" value={data && new Date(data.dateFinActivite)} 
                    mask="99/99/9999" readOnlyInput showOnFocus={false} />
            </div>
        </div>
    )

    const step2Form = (
        <div className='p-fluid'>
            <div className="field" >
                <label htmlFor="observation">Observation</label>
                <InputTextarea id="observation" value={data?.observation} onChange={bind} autoResize required />
            </div>
        </div>
        
    )

    return (
        <Dialog visible={visible} style={{ width: '800px' }} modal className="p-fluid"
            header={
                <div className='flex flex-row align-items-center'>
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text mr-2"
                        onClick={goBack} 
                        /> 
                    <h5 className='m-0'>Traitement demande</h5>
                </div>
            } 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                    
                    {activeIndex === 0 &&
                        <Button icon="pi pi-ban" className="p-button-danger p-button-text" 
                            label={ "Rejeter" }
                            onClick={goNext}  
                            />
                    }
                    <Button className="p-button-text" loading={loading} 
                        label={activeIndex === 1 ? "Terminer" : "Accepter"}
                        icon="check"
                        iconPos="left" 
                        onClick={submit} />
                </>
            }
            onHide={hide}
        >
            <Steps className='mt-1'
                model={[
                    { label: 'Détails demande', command: () => history.push('/responsable/step1') },
                    { label: 'Observation', command: () => history.push('/responsable/step2') },
                ]}
                activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true}
            />
            
                <Route path={'/responsable/step1'} exact
                    render={() => <div className='mt-5'>{step1Form}</div>} />
                <Route path={'/responsable/step2'} exact
                    render={() => <div className='mt-5'>{step2Form}</div>} />
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

export default ResponTraitement;