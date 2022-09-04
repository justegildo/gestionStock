import React from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import Dashboard from './components2/Dashboard';
import ButtonDemo from './components2/ButtonDemo';
import ChartDemo from './components2/ChartDemo';
import Documentation from './components2/Documentation';
import FileDemo from './components2/FileDemo';
import FloatLabelDemo from './components2/FloatLabelDemo';
import FormLayoutDemo from './components2/FormLayoutDemo';
import InputDemo from './components2/InputDemo';
import ListDemo from './components2/ListDemo';
import MenuDemo from './components2/MenuDemo';
import MessagesDemo from './components2/MessagesDemo';
import MiscDemo from './components2/MiscDemo';
import OverlayDemo from './components2/OverlayDemo';
import MediaDemo from './components2/MediaDemo';
import PanelDemo from './components2/PanelDemo';
import TableDemo from './components2/TableDemo';
import TreeDemo from './components2/TreeDemo';
import InvalidStateDemo from './components2/InvalidStateDemo';
import BlocksDemo from './components2/BlocksDemo';
import IconsDemo from './components2/IconsDemo';
import Crud from './pages/Crud';
import EmptyPage from './pages/EmptyPage';
import TimelineDemo from './pages/TimelineDemo';
import Institution from './components/Institution';
import Institution2 from './components2/Institution2';
import TextTable from './components2/TextTable';
import TestTableIns from './components2/TestTableIns';
import Suppression from './components2/Suppression';
import Niveau from './components/Niveau';
import Structure from './components2/Structure';
import Utilisateur from './components2/Utilisateur';
import Vehicule from './components2/Vehicule';
import Chauffeur from './components2/Chauffeur';
import Compte from './components2/Compte';
import DemandeVehicule from './components2/DemandeVehicule';
import Form from './components2/Form';
import './App.scss';
import { CommonService } from './util/CommonService';

const App = (props) => {

    let serv = new CommonService();
    serv.showArguments((ok, non)=>{ alert(ok + " - " +non);});


    const menu = [
        {
            label: 'Accueil',
            items: [{
                label: 'Tableau de bord', icon: 'pi pi-fw pi-home', to: '/dashboard'
            }]
        },
        {
            label: 'Operation',
            items: [
                { label: 'Demande de véhicule', icon: 'pi pi-fw pi-list', to: '/demande' },
                { label: 'Traitement des demandes', icon: 'pi pi-fw pi-list' },
                { label: 'Point du parking', icon: 'pi pi-fw pi-list' },
            ]
        },
        {
            label: 'Paramètre',
            items: [
                { label: 'Chauffeur', icon: ' pi pi-fw pi-list', to: '/chauffeur' },
                { label: 'Compte', icon: ' pi pi-fw pi-list', to: '/compte' },
                { label: 'Institution', icon: 'pi pi-fw pi-list', to: '/institution' },
                { label: 'Niveau', icon: 'pi pi-fw pi-list', to: '/niveau' },
                { label: 'Structure', icon: 'pi pi-fw pi-list', to: '/structure' },
                { label: 'Utilisateur', icon: 'pi pi-fw pi-list', to: '/utilisateur' },
                { label: 'Véhicule', icon: 'pi pi-fw pi-list', to: '/vehicule' }
            ]
        },
        {
            label: 'Administration',
            items: [
                { label: 'Modifier mot de passe', icon: 'pi pi-fw pi-cog', to: '/demande' },
                { label: 'Réinitialiser mot de passe', icon: 'pi pi-fw pi-list', },
            ] 
        },
        {
            label: 'Test',
            items: [
                { label: 'Institution2', icon: 'pi pi-fw pi-calendar', to: '/institution2' },
                { label: 'TestTable', icon: 'pi pi-fw pi-calendar', to: '/textTable' },
                { label: 'TestTableIns', icon: 'pi pi-fw pi-calendar', to: '/testTableIns' },
                { label: 'Sup', icon: 'pi pi-fw pi-calendar', to: '/sup' }
            ]
        },
        {
            label: 'Home',
            items: [{
                label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
            }]
        },
        {
            label: 'UI components2', icon: 'pi pi-fw pi-sitemap',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
                { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel" },
                { label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "invalidstate" },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
                { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' },
            ]
        },
        {
            label: 'UI Blocks',
            items: [
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: "NEW" },
                { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-react' }
            ]
        },
        {
            label: 'Icons',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/icons' }
            ]
        },
        {
            label: 'Pages', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
                { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline' },
                { label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty' }
            ]
        },
        
        {
            label: 'Menu Hierarchy', icon: 'pi pi-fw pi-search',
            items: [
                {
                    label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ]
                        },
                        {
                            label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                    ]
                },
                {
                    label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ]
                        },
                        {
                            label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
                { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sakai-react" } }
            ]
        }
    ];

    return (
        <>
            <AppTopbar onToggleMenuClick={props.onToggleMenuClick} 
                layoutColorMode={props.layoutColorMode}
                mobileTopbarMenuActive={props.mobileTopbarMenuActive} 
                onMobileTopbarMenuClick={props.onMobileTopbarMenuClick} 
                onMobileSubTopbarMenuClick={props.onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={props.onSidebarClick}>
                <AppMenu model={menu} 
                    onMenuItemClick={props.onMenuItemClick} 
                    layoutColorMode={props.layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/dashboard" exact render={() => <Dashboard colorMode={props.layoutColorMode} location={props.location} />} />
                    <Route path="/niveau" component={Niveau} />
                    <Route path="/structure" component={Structure} />
                    <Route path="/utilisateur" component={Utilisateur} />
                    <Route path="/vehicule" component={Vehicule} />
                    <Route path="/chauffeur" component={Chauffeur} />
                    <Route path="/compte" component={Compte} />
                    <Route path="/demande" component={DemandeVehicule} />
                
                    <Route path="/formlayout" component={FormLayoutDemo} />
                    <Route path="/input" component={InputDemo} />
                    <Route path="/floatlabel" component={FloatLabelDemo} />
                    <Route path="/invalidstate" component={InvalidStateDemo} />
                    <Route path="/button" component={ButtonDemo} />
                    <Route path="/table" component={TableDemo} />
                    <Route path="/list" component={ListDemo} />
                    <Route path="/tree" component={TreeDemo} />
                    <Route path="/panel" component={PanelDemo} />
                    <Route path="/overlay" component={OverlayDemo} />
                    <Route path="/media" component={MediaDemo} />
                    <Route path="/menu" component={MenuDemo} />
                    <Route path="/messages" component={MessagesDemo} />
                    <Route path="/blocks" component={BlocksDemo} />
                    <Route path="/icons" component={IconsDemo} />
                    <Route path="/file" component={FileDemo} />

                    <Route path="/chart" render={() => <ChartDemo colorMode={props.layoutColorMode} location={props.location} />} />
                    <Route path="/misc" component={MiscDemo} />
                    <Route path="/timeline" component={TimelineDemo} />
                    <Route path="/crud" component={Crud} />
                    <Route path="/empty" component={EmptyPage} />
                    <Route path="/documentation" component={Documentation} />
                    <Route path="/institution" component={Institution} />
                    <Route path="/institution2" component={Institution2} />
                    <Route path="/textTable" component={TextTable} />
                    <Route path="/testTableIns" component={TestTableIns} />
                    <Route path="/sup" component={Suppression} />
                    <Route path="/form" component={Form} />
                </div>
                {/* <AppFooter layoutColorMode={layoutColorMode} /> */}
            </div>
        </>
    );

}

export default App;
