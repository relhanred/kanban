import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    auth : null,
    id : null,
    nom : '',
    email : '',
    projetNom : '',
    users : [],
    projets: [],
    currProjet: {},
    mesProjet: [],
    invitations: [],
    },
  getters:  {
    getIsConnected: state =>  state.auth,
    getNom: state =>  state.nom,
    getId: state =>  state.id,
    getEmail: state =>  state.email,
    getProjetNom: state =>  state.projetNom,
    getUsers: state =>  state.users,  
    getProjets: state =>  state.projets, 
    getCurrProjet: state =>  state.currProjet, 
    getMesProjet: state =>  state.mesProjet, 
    getInvitations: state =>  state.invitations, 
  },
  mutations: {
    SET_CONNECTED(state, payload) {
     state.auth = payload;
    },
    SET_ID(state, payload) {
      state.id = payload;
    },
    SET_EMAIL(state, payload) {
     state.email = payload;
    },
    SET_NOM(state, payload) {
      state.nom = payload;
    },
    SET_PROJET_NOM(state, payload) {
     state.projetNom = payload;
    },
    SET_USERS(state, payload) {
     state.users = payload;
    },
    SET_PROJETS(state, payload) {
      state.projets = payload;
    },
    SET_CURRENT_PROJET(state,payload)  {
      state.currProjet = payload;
    },
    SET_MES_PROJETS(state,payload)  {
      state.mesProjet = payload;
    },
    SET_INVITATIONS(state,payload)  {
      state.invitations = payload;
    },

  },
  actions: {
  },
  modules: {
  }
})
