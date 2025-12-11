import React, { createContext, useContext, useState, useCallback } from 'react';
import TicketAPI from '../services/TicketAPI';

const TicketContext = createContext();

export const useTickets = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  // Initialiser toujours avec un tableau vide [] pour éviter les erreurs "not iterable"
  const [tickets, setTickets] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. FETCH (Récupération) ---
  const fetchTickets = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await TicketAPI.getAllTickets(params);
      
      // ⚠️ CORRECTION MAJEURE ICI ⚠️
      // Avec la pagination DRF, les tickets sont dans response.data.results
      // Sans pagination, ils sont directement dans response.data
      const data = response.data.results || response.data;

      // Sécurité : On s'assure que c'est bien un tableau avant de mettre à jour
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error("Format de données inattendu:", response.data);
        setTickets([]); // En cas de problème, on remet un tableau vide
      }
      
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors du chargement des tickets");
      setTickets([]); // On vide la liste en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. ADD (Ajout) ---
  const addTicket = async (ticketData) => {
    try {
      const response = await TicketAPI.createTicket(ticketData);
      // On ajoute le nouveau ticket au début de la liste existante
      setTickets(prev => {
        // Sécurité : si prev n'est pas un tableau (ex: bug), on initialise un nouveau tableau
        const currentList = Array.isArray(prev) ? prev : [];
        return [response.data, ...currentList];
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // --- 3. UPDATE (Modification complète) ---
  const updateTicket = async (id, updatedData) => {
    try {
      const response = await TicketAPI.updateTicket(id, updatedData);
      setTickets(prev => {
        const currentList = Array.isArray(prev) ? prev : [];
        return currentList.map(ticket => ticket.id === id ? response.data : ticket);
      });
    } catch (err) {
      throw err;
    }
  };

  // --- 4. UPDATE STATUS (Modification partielle Admin) ---
  const updateTicketStatus = async (id, status) => {
    try {
      const response = await TicketAPI.updateStatus(id, status);
      setTickets(prev => {
        const currentList = Array.isArray(prev) ? prev : [];
        return currentList.map(ticket => 
          ticket.id === id ? { ...ticket, status: response.data.status } : ticket
        );
      });
    } catch (err) {
      throw err;
    }
  };

  // --- 5. DELETE (Suppression) ---
  const deleteTicket = async (id) => {
    try {
      await TicketAPI.deleteTicket(id);
      setTickets(prev => {
        const currentList = Array.isArray(prev) ? prev : [];
        return currentList.filter(ticket => ticket.id !== id);
      });
    } catch (err) {
      throw err; // Laisse le composant gérer l'erreur (ex: Toast)
    }
  };

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      loading, 
      error, 
      fetchTickets, 
      addTicket, 
      updateTicket, 
      updateTicketStatus, // N'oubliez pas de l'exporter pour l'AdminPanel
      deleteTicket 
    }}>
      {children}
    </TicketContext.Provider>
  );
};