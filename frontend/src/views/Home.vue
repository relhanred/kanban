<template>
  <div>
    <navbar></navbar>

    <h1 class="titre">Projets publics</h1>

    <div style="margin-left: auto; margin-right: auto;" class="overflow-auto">

      <b-card-group class="listprojet">
        <div v-for="projet in projets" :key="projet._id" style="margin:auto;">
          <b-card
            :title="projet.nomProjet"
            :img-src="require(`@/assets/color-${Math.floor( 1 + Math.random() * Math.floor(6))}.png`)"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 15rem; margin: 10px; cursor: pointer;"
            @click="showInfo(projet._id)" class="mr-2"
          >
            <b-card-text>
              Créateur :
              {{ strUcFirst(projet.proprio) }}
            </b-card-text>
          </b-card>
        </div>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import "@/components/Navbar.vue";
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Navbar,
  },
  async created() {
    await axios
      .get("api/projet/public/true")
      .then((response) =>
        response.data.forEach((x) => {
          this.projets.push({
            nomProjet: x.nomProjet,
            proprio: x.proprio,
            public: x.public,
            _id: x._id,
            rows: x.rows,
          });
        })
      )
      .catch();
    await axios
      .get("api/projet/")
      .then((response) => this.$store.commit("SET_PROJETS", response.data))
      .catch();
  },
  data() {
    return {
      id: 10,
      currProjet: {},
      projets: [],
      fields: [
        { key: "nomProjet", label: "Nom du projet" },
        { key: "proprio", label: "Propriétaire" },
        { key: "accès", label: "Accès" },
      ],
      test: [],
      isConnected: false,
    };
  },
  computed: {
    ...mapGetters(["getProjets", "getNom"]),
  },
  methods: {
    showInfo(index) {
      // this.$store.commit("SET_CURRENT_PROJET", this.projets[index]);
      this.$router.push("/" + index);
    },
    strUcFirst(a) {
      return (a + "").charAt(0).toUpperCase() + a.substr(1);
    },
  },
};
</script>

<style>

.titre {
  margin: 3%;
  color: black;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

.listprojet {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
}
</style>