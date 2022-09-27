import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import UtilisateurService from '../services/UtilisateurService';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { Dropdown } from 'primereact/dropdown';
import StructureService from '../services/StructureService';
import InstitutionService from '../services/InstitutionService';


const Utilisateur = () => {
    const [yesNo, setYesNo] = useState({});
    const [form, setForm] = useState({});
    
    return (
        <div>
            <div className="card">
                <Table {...{setForm, setYesNo}} />
                <Form {...{form, setYesNo}} />
                <Confirmation {...yesNo} />
            </div>
            
        </div>
    );
}

const Table = (props) => {
    const [items, setItems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const {setForm, setYesNo} = props;

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        UtilisateurService.get((data, status) => {
                setLoading(false);
                if(status) setItems(data);  
            },
            {size: itemPerPage}
        );
    }

    const openNew = () => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: null,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        });
    }

    const editItem = (item) => {
        setForm({
            visible: true,
            hide: ()=> setForm((prev)=>({...prev, visible: false})),
            data: item,
            setData: (data)=> setForm((prev)=>({...prev, data})),
            callback: ()=> {
                setLoading(true);
                loadItems();
            }
        })
    }

    const deleteItem = (item) => {
        setYesNo({   
            visible: true,
            message : "Confirmez-vous la suppression ?",
            hide: ()=> setYesNo((prev)=>({...prev, visible: false})),
            callback : ()=> {
                setLoading(true);
                UtilisateurService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    return (
        <>
            <h5>Liste des utilisateurs</h5>
            <Toolbar className="mb-4" 
                left={
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" 
                                onClick={openNew}/>
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

                <Column field="id" header="Identifiant" sortable  hidden />
                <Column field="matricule" header="Matricule" sortable />
                <Column field="image" header="Photo" sortable />
                <Column header="Nom" sortable style={{fontWeight: 'bold'}} body={(item)=> item.nom + " " + item.prenom}/>
                <Column field="telephone" header="Téléphone" sortable />
                <Column field="typeUtilisateur" header="Type utilisateur" sortable body={ (item)=> 
                    <span className={`customer-badge status-${item.typeUtilisateur === 'ADMINISTRATEUR'
                            ? 'new' 
                            : (item.typeUtilisateur ==='RESPONSABLE_STRUCTURE' ? 'renewal' 
                            : item.typeUtilisateur === 'CHEF_PARC' ? 'proposal' : 'qualified' )}`}>
                        {item.typeUtilisateur}
                    </span>
                } />
                <Column field="structure.libelle" header="Structure" sortable />
                <Column field="structure.institution.libelle" header="Institution" sortable />

                <Column body={ (selectedItem)=>
                    <div className="flex justify-content-end">
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editItem(selectedItem)}/>
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={()=> deleteItem(selectedItem)}/>
                    </div>
                } />
            </DataTable>
        </>
    );
}

const Form = (props) => {
    const {visible, hide, data, setData, callback } = props.form;
    const {setYesNo} = props;
    const[loading, setLoading] = useState(false);

    const [structures, setStructures] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    const[selectedInstitution, setSelectedInstitution] = useState();

    useEffect(()=> {
        if(!visible) return;
        loadInstitutions();
        data && loadStructures(data.structure.institution.id);
        data && setSelectedInstitution(data?.structure?.institution);
    }, [visible]);

    const loadInstitutions = () => {
        InstitutionService.get((data)=> data && setInstitutions(data), {size: pageMaxSize})
    }

    const loadStructures = (institutionId) => {
        StructureService.getByInstitutionId(institutionId, (data)=> data && setStructures(data), {size: pageMaxSize});
    }
    
    const bind = (e) => {
        if(e.target.value !== undefined) {
            let value = e.target.value;
            setData({...data, [e.target.id]: value});
        }
        else if(e.checked !== undefined) {
            setData({...data, [e.target.id]: e.target.checked});
        }else{
            alert("Binding fails.")
        }
    }
    
    const submit = () => {
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
                    console.log(JSON.stringify(data, null, 2))
                    if(data.id) UtilisateurService.update(data, onResponse); else UtilisateurService.add(data, onResponse);
                },
            }
        )
    
    }

    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="Détails de l'utilisateur" modal className="p-fluid" 
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide}  />
                    <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={submit} loading={loading} />
                </>
            } 
            onHide={hide}
            >  
                <div className="field" hidden>
                    <label htmlFor="id">Identifiant</label>
                    <InputText id="id" value={data?.id} onChange={bind} />
                </div>
                <div className="field">
                    <label htmlFor="matricule">Matricule</label>
                    <InputText id="matricule" value={data?.matricule} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="nom">Nom</label>
                    <InputText id="nom" value={data?.nom} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="prenom">Prénoms</label>
                    <InputText id="prenom" value={data?.prenom} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="telephone">Téléphone</label>
                    <InputText id="telephone" value={data?.telephone} onChange={bind} required  />
                </div>
                <div className="field">
                    <label htmlFor="typeUtilisateur">Type utilisateur</label>
                    <Dropdown id="typeUtilisateur" onChange={bind} placeholder="Aucune sélection"
                        options={["ADMINISTRATEUR", "RESPONSABLE_STRUCTURE", "SIMPLE_UTILISATEUR", "CHEF_PARC"]} 
                        value={data?.typeUtilisateur} />
                </div>
                <div className="field">
                    <label htmlFor="institution">Institution</label>
                    <Dropdown id="institution" onChange={(e)=>{setSelectedInstitution(e.value); loadStructures(e.value.id);} } 
                        placeholder="Aucune sélection"
                        options={institutions} 
                        value={selectedInstitution} 
                        optionLabel="libelle" />
                </div>
                <div className="field">
                    <label htmlFor="structure">Structure</label>
                    <Dropdown id="structure" onChange={bind} placeholder="Aucune sélection"
                        options={structures}
                        value={data?.structure}
                        optionLabel="libelle" />
                </div>
            
            </Dialog>
    )
}

const Confirmation = (props) => {
    const {visible, hide, message, callback } = props;
    
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

export default Utilisateur;