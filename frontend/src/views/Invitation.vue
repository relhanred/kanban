<template>
  <div>
    <navbar></navbar>
    <h1 id="title">Invitations</h1>
    <div v-if="!charging">
      <b-spinner label="Spinning"></b-spinner>
    </div>
    <div v-else>
      <b-table
        :items="invitations"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :empty-text="msg"
        stacked="md"
        show-empty
        small
      >
        <template #cell(nomProjet,index)="row">
          {{ row.nomProjet }}
        </template>

        <template #cell(proprio,index)="row">
          {{ row.proprio }}
        </template>

        <template #cell(actions)="row">
          <b-button
            @click="acceptInvitation(row.item._id)"
            size="sm"
            variant="light"
          >
            <b-icon icon="check-square" scale="2" variant="success"></b-icon>
          </b-button>
          <b-button
            @click="refuseInvitation(row.item._id)"
            href="/invitation"
            size="sm"
            variant="light"
          >
            <b-icon icon="x-circle" scale="2" variant="danger"></b-icon>
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Invitations",
  data() {
    return {
      invitations: [],
      currentPage: 1,
      msg: "",
      perPage: 15,
      charging: false,
      fields: [
        { key: "nomProjet", label: "Nom du projet" },
        { key: "proprio", label: "Propriétaire" },
        { key: "actions", label: "Actions" },
      ],
    };
  },
  async mounted() {
    await axios
      .get("api/invitation/user/" + this.getNom.toLowerCase())
      .then((response) => {
        if (!response.data.msg) {
          this.$store.commit("SET_INVITATIONS", response.data);
          this.invitations = this.getInvitations;
        } else {
          this.msg = response.data.msg;
        }
      })
      .catch();

    this.charging = true;
  },
  components: {
    Navbar,
  },
  computed: {
    ...mapGetters(["getNom", "getProjets", "getInvitations"]),
  },
  methods: {
    async refuseInvitation(id) {
      await axios
        .delete("/api/invitation/" + id)
        .then((response) => {
          for (let i in this.invitations) {
            if (this.invitations[i] == response.data) {
              let index = this.invitations.indexOf(i);
              if (index > -1) {
                this.invitations.splice(index, 1);
              }
            }
          }
          this.$forceUpdate();
        })
        .catch();
    },
    async acceptInvitation(id) {
      let guestsUpdate = [];
      let projet;
      let index;
      for (let i in this.invitations) {
        if (this.invitations[i]._id == id) {
          projet = this.invitations[i];
          index = this.invitations.indexOf(projet);
        }
      }
      guestsUpdate = projet.guests;
      if (!guestsUpdate.includes(this.getNom)) {
        guestsUpdate.push(this.getNom);
      }
      let idProjet = this.invitations[index].idProjet;
      let users;
      await axios
        .get("/api/projet/id/" + idProjet)
        .then((response) => {
          users = response.data.users;
        })
        .catch();

      guestsUpdate.forEach((element) => {
        if (!users.includes(element)) {
          users.push(element);
        }
      });

      await axios
        .put("/api/projet/" + idProjet, { users: users })
        .then(() => {})
        .catch();

      await axios
        .delete("/api/invitation/" + id)
        .then((response) => {
          for (let i in this.invitations) {
            if (this.invitations[i] == response.data) {
              let index = this.invitations.indexOf(i);
              if (index > -1) {
                this.invitations.splice(index, 1);
              }
            }
          }
          this.$forceUpdate();
        })
        .catch();
        this.$router.push("mes_projets");
    },
  },
};
</script>

<style>

#title {
  margin-top: 3%;
  margin-left: 3%;
  margin-bottom: 20px;
  color: black;
  min-width: 200px;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}
</style>

