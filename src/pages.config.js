/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import BasketballRecovery from './pages/BasketballRecovery';
import BookSession from './pages/BookSession';
import Contact from './pages/Contact';
import EventBooking from './pages/EventBooking';
import EventBookingFlow from './pages/EventBookingFlow';
import Home from './pages/Home';
import HyroxRecovery from './pages/HyroxRecovery';
import IndividualServiceSuccess from './pages/IndividualServiceSuccess';
import Pricing from './pages/Pricing';
import RunningRecovery from './pages/RunningRecovery';
import Services from './pages/Services';
import TeamPassAdmin from './pages/TeamPassAdmin';
import TeamPassSuccess from './pages/TeamPassSuccess';
import VolleyballRecovery from './pages/VolleyballRecovery';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminDashboard": AdminDashboard,
    "BasketballRecovery": BasketballRecovery,
    "BookSession": BookSession,
    "Contact": Contact,
    "EventBooking": EventBooking,
    "EventBookingFlow": EventBookingFlow,
    "Home": Home,
    "HyroxRecovery": HyroxRecovery,
    "IndividualServiceSuccess": IndividualServiceSuccess,
    "Pricing": Pricing,
    "RunningRecovery": RunningRecovery,
    "Services": Services,
    "TeamPassAdmin": TeamPassAdmin,
    "TeamPassSuccess": TeamPassSuccess,
    "VolleyballRecovery": VolleyballRecovery,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};