import React, { createContext, useState, useEffect, useContext } from 'react';
import { Spinner } from 'react-bootstrap'; // Import pour le chargement
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'app, on regarde si un user est déjà stocké (persistance)
  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // --- FONCTION LOGIN ---
  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password);
      setUser(data);
      return data; // ✅ CORRECTION IMPORTANTE : On retourne les données (pour vérifier le rôle dans Login.js)
    } catch (error) {
      console.error("Erreur login", error);
      throw error;
    }
  };

  // --- FONCTION SIGNUP ---
  const signup = async (username, email, password) => {
      // On retourne la promesse pour gérer le succès/échec dans le composant
      return AuthService.register(username, email, password);
  };

  // --- FONCTION LOGOUT ---
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // --- ÉCRAN DE CHARGEMENT INITIAL ---
  if (loading) {
     // Affiche un spinner centré au lieu du texte brut pendant que l'app vérifie le token
     return (
       <div className="d-flex justify-content-center align-items-center vh-100">
         <Spinner animation="border" variant="primary" role="status">
           <span className="visually-hidden">Chargement...</span>
         </Spinner>
       </div>
     );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);