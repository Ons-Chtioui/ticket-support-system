import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des Contextes
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ToastProvider } from './context/ToastContext';

// Import des Composants Pages
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';
import TicketDetails from './components/TicketDetails';
import Signup from './components/Signup';

// Import des Composants de structure
import Navigation from './components/Navigation';
import Home from './components/Home';

// Import du widget Tawk
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function App() {
  // ⚠️ Toutes les fonctions de callback (handleLoad, handleStatusChange, etc.) ont été supprimées
  //    pour éviter tout conflit de typage ou d'initialisation.

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <TicketProvider>
            
            <Navigation />
            
            <div className="main-content">
               <Routes>
                 {/* Routes */}
                 <Route path="/" element={<Home />} />
                 <Route path="/login" element={<Login />} />
                 <Route path="/signup" element={<Signup />} />
                 <Route path="/dashboard" element={<UserDashboard />} />
                 <Route path="/admin" element={<AdminPanel />} />
                 <Route path="/tickets/:id" element={<TicketDetails />} />
               </Routes>
            </div>

            {/* WIDGET TAWK MINIMAL (Seules les IDs sont conservées) */}
            <TawkMessengerReact
                propertyId="693abc1fbd2136197dcfdad6"
                widgetId="1jc6mtnao"
                // ⚠️ On a retiré : onLoad, onBeforeLoad, onStatusChange, etc. ⚠️
            />

          </TicketProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;