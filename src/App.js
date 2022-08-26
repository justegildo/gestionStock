import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

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

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import Institution from './components2/Institution';
import Institution2 from './components2/Institution2';
import TextTable from './components2/TextTable';
import TestTableIns from './components2/TestTableIns';
import Suppression from './components2/Suppression';
import Niveau from './components2/Niveau';
import Structure from './components2/Structure';
import Utilisateur from './components2/Utilisateur';
import Vehicule from './components2/Vehicule';
import Chauffeur from './components2/Chauffeur';
import Compte from './components2/Compte';
import DemandeVehicule from './components2/DemandeVehicule';
import Form from './components2/Form';



const App = () => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

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

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
            
            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/dashboard" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
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
                    <Route path="/chart" render={() => <ChartDemo colorMode={layoutColorMode} location={location} />} />
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
                    <Route path="/demande" component={DemandeVehicule} />
                 
                
                </div>

                {/* <AppFooter layoutColorMode={layoutColorMode} /> */}
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
