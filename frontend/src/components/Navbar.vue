<template>
  <b-navbar toggleable="sm" type="light" variant="light">
    <b-navbar-nav id="nav-collapse" is-nav>
      <b-navbar-brand>
        <router-link to="/"
          ><img src="../assets/logokanbanfull.png" style="max-width: 200px"
        /></router-link>
      </b-navbar-brand>
    </b-navbar-nav>

    <b-navbar-toggle
      target="nav-collapse"
      style="margin-left: 4%"
    ></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/mes_projets" v-if="getIsConnected"
          >Mes projets</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-form v-if="!getIsConnected">
        <b-button size="sm" class="mr-sm-2" to="/Inscription"
          >Inscription</b-button
        >
        <b-button size="sm" class="my-2 my-sm-0" to="/Connexion"
          >Connexion</b-button
        >
      </b-nav-form>

      <b-nav-item-dropdown right v-else>
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <b-avatar class="mr-3"></b-avatar>
          <em
            >{{ strUcFirst(getNom) }}
            <b-badge variant="danger" v-if="isInvitation">{{
              invitationNumber
            }}</b-badge>
          </em>
        </template>
        <b-dropdown-item to="/Profil" type="dark">Profil</b-dropdown-item>
        <b-dropdown-item to="/invitation" type="dark"
          >Invitations
          <b-badge variant="danger" v-if="isInvitation">{{
            invitationNumber
          }}</b-badge></b-dropdown-item
        >
        <b-dropdown-item href="/connexion" @click="logout"
          >Deconnexion</b-dropdown-item
        >
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "navbar",
  async mounted() {
    if (this.getIsConnected) {
      await axios
        .get("/api/invitation/user/" + this.getNom.toLowerCase())
        .then((response) => {
          if(!response.data.msg) {
            this.$store.commit("SET_INVITATIONS", response.data);
            this.invitationNumber = response.data.length;
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  },
  data() {
    return {
      invitationNumber: 0,
    };
  },
  computed: {
    ...mapGetters(["getIsConnected", "getNom", "getInvitations"]),
    isInvitation() {
      return this.invitationNumber > 0;
    },
  },
  methods: {
    logout() {
      sessionStorage.clear();
    },
    strUcFirst(a) {
      return (a + "").charAt(0).toUpperCase() + a.substr(1);
    },
  },
};
</script>

<style>
</style>