import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import ApprovisionnementService from '../services/ApproviService';
import { itemPerPage, pageMaxSize } from '../baseUrls/consts';
import { Dropdown } from 'primereact/dropdown';
import ProduitService from '../services/ProduitService';

const Approvisionnement = () => {
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
        ApprovisionnementService.get((data, status) => {
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
                ApprovisionnementService.delete(item.id, (data, status)=>{
                    setLoading(false);
                    loadItems();
                });
            },
        });
    }
    
    return (
        <>
            <h5>Liste des approvisionnements</h5>
            <Toolbar className="mb-4" 
                left={
                    <React.Fragment>
                        <div className="my-2">
                            <Button label="Nouveau" icon="pi pi-plus" className="p-button-success mr-2" 
                                onClick={openNew}/>
                            <Button label="Actualiser" icon="pi pi-refresh" className="p-button-primry mr-2" 
                                onClick={()=>{setLoading(true); loadItems()}} />
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
                responsiveLayout="scroll" emptyMessage="Aucune donn??e disponible.">

                <Column field="id" header="Identifiant" hidden sortable />
                <Column field="libelle" header="Libell??" sortable style={{fontWeight: 'bold'}} />
                <Column field="observation" header="Observation" sortable />
                <Column field="typeEntreeSortie" header="Type entr??e-sortie" sortable />
                
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

    const [selectedCoupleProduit, setselectedCoupleProduit] = useState();
    const [coupleProduits, setCoupleProduits] = useState([]);
    const [produits, setProduits] = useState(null);

    const addChoice = ()=>{
        if(!selectedCoupleProduit) return;
        let items = [...coupleProduits, ...[selectedCoupleProduit]];
        setCoupleProduits(items);
        setselectedCoupleProduit(null);
        //console.log(selectedCoupleProduit);
    }

    const removeSelectedCoupleProduit = (selectedCoupleProduit)=> {
        let index = coupleProduits.indexOf(selectedCoupleProduit);
        coupleProduits.splice(index, 1);
        setCoupleProduits([...coupleProduits]);
    }

    useEffect(() => {
        if (!visible) return;
        loadProduits();
        setselectedCoupleProduit([]);
    }, [visible])

    const loadProduits = () =>{
        ProduitService.get((data)=> data && setProduits(data), {size: pageMaxSize})
    }
 
     

    const submit = () => {
        if(!data) return;
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
                    if(data.id) ApprovisionnementService.update(data, onResponse); else ApprovisionnementService.add(data, onResponse);
                },
            }
        )
    }


    return(
        <Dialog visible={visible} style={{ width: '800px' }} header="D??tails de l'Approvisionnement" modal className="p-fluid"
            footer={
                <>
                    <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hide} />
                    <Button label="Choisir" icon="pi pi-plus" className="p-button-text" onClick={addChoice} loading={loading} />
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
                <label htmlFor="libelle">Libell??</label>
                <InputText id="libelle" value={data?.libelle} onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="observation">Observation</label>
                <InputText id="observation" value={data?.obseravtion} onChange={bind} required placeholder='ex: ' />
            </div>
            <div className="field">
                <label htmlFor="typeEntreeSortie">Type entr??e-sortie</label>
                <Dropdown id="typeEntreeSortie" onChange={bind} placeholder="APPROVISIONNEMENT" 
                    options={["APPROVISIONNEMENT"]}
                    value={data?.typeEntreeSortie} />
            </div>
            <div className="field">
                <label htmlFor="produit">Produit</label>
                <Dropdown id="produit" onChange={(e)=> {setselectedCoupleProduit({...selectedCoupleProduit, produit: e.value})}}
                    options={produits} value={selectedCoupleProduit?.produit} 
                    optionLabel="libelle" /*optionValue="id"*/
                    placeholder="Aucune s??lection" />
            </div>
            <div className="col-12">
                <div className="grid p-fluid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="prixAchatTotal">Prix achat total</label>
                        <InputText id="prixAchatTotal" onChange={bind} required placeholder='ex: ' />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="quantite">Quantit??</label>
                        <InputText id="quantite" onChange={bind} required placeholder='ex: ' />
                    </div>
                </div>
            </div>

            <div>
                <DataTable dataKey="id" value={coupleProduits} responsiveLayout="scroll"
                    paginator rows={10}>
                    <Column field="produit.libelle" header="Produit"></Column>
                    <Column field="produit.prixVenteUnitaire" header="Prix vente unitaire"></Column>
                    <Column field="produit.stockAlerte" header="Stock"></Column>
                    <Column body={(selectedItem) =>
                        <div className="flex justify-content-end">
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2"
                                onClick={() => removeSelectedCoupleProduit(selectedItem)} />
                        </div>
                    } />
                </DataTable>
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

export default Approvisionnement;