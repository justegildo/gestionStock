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

import Approvision from './components/Approvision';
import Vente from './components/Vente';
import Ajustement from './components/Ajustement';
import Inventaire from './components/Inventaire';
import Depense from './components/Depense';
import Produit from './components/Produit';
import TypeProduit from './components/TypeProduit';
import Utilisateur from './components/Utilisateur';
import Journee from './components/Journee';
import Compte from './components/Compte';
import LigneInventaire from './components/LigneInventaire';


const App = (props) => {
    
    const menu = [
        {
            label: 'Accueil',
            items: [{
                label: 'Tableau de bord', icon: 'pi pi-fw pi-home', to: '/dashboard'
            }]
        },
        {
            label: 'Op??ration',
            items: [
                { label: 'Approvisionnement', icon: 'pi pi-fw pi-list', to: '/approvisionnement' },
                { label: 'Vente', icon: 'pi pi-fw pi-list', to: '/vente' },
                { label: 'Ajustement', icon: 'pi pi-fw pi-list', to: '/ajustement' },
                { label: 'Inventaire', icon: 'pi pi-fw pi-list', to:'/inventaire' },
                { label: 'Ligne inventaire', icon: 'pi pi-fw pi-list', to:'/ligneInventaire' },
                { label: 'D??pense', icon: 'pi pi-fw pi-list', to:'/depense' },
                { label: 'Utilisateur', icon: 'pi pi-fw pi-list', to:'/utilisateur' },
                { label: 'Compte', icon: 'pi pi-fw pi-list', to:'/compte' },
            ]
        },
        {
            label: 'Param??tre',
            items: [
                { label: 'Produit', icon: ' pi pi-fw pi-list', to: '/produit' },
                { label: 'Type de produit', icon: ' pi pi-fw pi-list', to: '/typeProduit' },
                { label: 'Journ??e', icon: 'pi pi-fw pi-list', to:'/journee' },
               
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
                
                    <Route path="/approvisionnement" component={Approvision} />
                    <Route path="/vente" component={Vente} />
                    <Route path="/ajustement" component={Ajustement} />
                    <Route path="/inventaire" component={Inventaire} />
                    <Route path="/depense" component={Depense} />
                    <Route path="/produit" component={Produit} />
                    <Route path="/typeProduit" component={TypeProduit} />
                    <Route path="/utilisateur" component={Utilisateur} />
                    <Route path="/journee" component={Journee} />
                    <Route path="/compte" component={Compte} />
                    <Route path="/ligneInventaire" component={LigneInventaire} />

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
                </div>
                {/* <AppFooter layoutColorMode={layoutColorMode} /> */}
            </div>
        </>
    );

}

export default App;
