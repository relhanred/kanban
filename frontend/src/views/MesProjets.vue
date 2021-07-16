<template>
  <div>
    <navbar></navbar>

    <h1 class="title">Mes Projets</h1>
    <b-button
      v-b-modal.modal-prevent-closing
      variant="outline-primary"
      id="addbutton"
      >Nouveau projet</b-button
    >

    <b-container fluid class="projectscontainer">
      <b-col id="searchinput">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Rechercher un projet"
            ></b-form-input>

            <!-- CHEEECKKKBOOOOOOOOOXXXXXXXX -->
            <b-form-checkbox
              switch
              size="lg"
              class="check"
              @change="hasChangePublic"
              :checked="isCheckedPublic"
              >Public</b-form-checkbox
            >
            <b-form-checkbox
              switch
              size="lg"
              class="check"
              @change="hasChangePrivee"
              :checked="isCheckedPrivee"
              >Privé</b-form-checkbox
            >

            <!-- <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append> -->
          </b-input-group>
        </b-form-group>
      </b-col>
      <!-- User Interface controls -->

      <!-- Main table element -->
      <b-table
        :items="myProjets"
        :fields="fields"
        :filter="filter"
        :filter-included-fields="filterOn"
        :current-page="currentPage"
        :per-page="perPage"
        empty-text="Vous n'avez pas encore de projets"
        @filtered="onFiltered"
        empty-filtered-text=""
        stacked="md"
        hover
        show-empty
        table-variant="light"
        striped
        head-variant="dark"
        style="cursor: pointer; margin-top: 20px"
      >
        <template #cell(nomProjet)="row">
          <div @click="showProject(row.item._id)">
            {{ strUcFirst(row.item.nomProjet) }}
          </div>
        </template>

        <template #cell(proprio)="row">
          <div @click="showProject(row.item._id)">
            {{ strUcFirst(row.item.proprio) }}
          </div>
        </template>

        <template #cell(actions)="row">
          <!-- <b-button size="sm" @click="row.toggleDetails" >
            {{ row.detailsShowing ? "Cacher" : "Afficher" }} Details
          </b-button> -->
          <div style="text-align: center">
            <b-button
              @click="showProject(row.item._id)"
              size="sm"
              variant="outline-primary"
            >
              Consulter
            </b-button>
          </div>
        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li>{{ row.item.public }}</li>
              <li v-for="key in row.item.users" :key="key">
                {{ key }}
              </li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <b-col sm="7" md="6" style="margin: auto; padding-bottom: 10px">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
        ></b-pagination>
      </b-col>
    </b-container>

    <!-- MODAL + NOUVEAUX -->

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Ajout d'un kanban"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Nom du projet"
          label-for="name-input"
          invalid-feedback="Le nom du projet est obligatoire"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            placeholder="Entrez le nom du projet"
            required
          ></b-form-input>
        </b-form-group>

        <b-list-group horizontal="md" style="margin-top: 20px">
          <b-list-group-item>
            <b-form-group label="Nombre de colonnes">
              <b-form-spinbutton
                id="sb"
                v-model="rowsSize"
                min="2"
                :max="maxRows"
              ></b-form-spinbutton>
            </b-form-group>
          </b-list-group-item>

          <b-list-group-item style="width: 100%">
            <!-- <b-form-group label="Noms des colonnes"> -->
            <b-form-input value="Stories" disabled></b-form-input>
            <div v-for="index in rowsSize - 2" :key="index">
              <b-form-input
                v-model="rowsName[index]"
                placeholder="Nom de la colonne"
                invalid-feedback="Le nom de la colonne est obligatoire"
                required
              ></b-form-input>
            </div>
            <b-form-input value="Terminées" disabled></b-form-input>
          </b-list-group-item>
        </b-list-group>

        <!-- </b-form-group> -->

        <b-form-group
          label="Statut du kanban"
          v-slot="{ ariaDescribedby }"
          style="margin-top: 20px"
        >
          <b-form-radio-group
            id="radio-group-1"
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>

        <label for="example-datepicker">Date limite (Optionnel)</label>
        <b-form-datepicker
          header="Date limite"
          id="example-datepicker"
          v-model="limitDate"
          class="mb-2"
        ></b-form-datepicker>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "MesProjets",
  components: {
    Navbar,
  },
  computed: {
    ...mapGetters(["getNom", "getProjets", "getMesProjet"]),
  },
  async mounted() {
    await axios
      .get("api/projet/user/" + this.getNom.toLowerCase())
      .then((response) => {
        this.currentDate = "";
        let resu = response;
        resu.data.forEach((element) => {
          if (element.date) {
            this.getFormatDate(element.date);
            element.date = this.currentDate;
          }
        });
        this.$store.commit("SET_MES_PROJETS", resu.data);
      })
      .catch();
    this.myProjets = this.getMesProjet;
    this.allProjet = this.myProjets;
    this.myProjets.forEach((element) => {
      if (element.public) {
        this.publicProjet.push(element);
      } else {
        this.priveeProjet.push(element);
      }
    });
    this.totalRows = this.myProjets.length;
    this.currentDate = ""
  },
  data() {
    return {
      myProjets: [],
      publicProjet: [],
      priveeProjet: [],
      allProjet: [],
      filter: null,
      filterOn: [],
      sortBy: "",
      isCheckedPublic: true,
      isCheckedPrivee: true,
      sortDesc: false,
      sortDirection: "asc",
      name: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15],
      selected: true,
      limitDate: null,
      currentDate: "",
      rowsSize: 2,
      maxRows: 10,
      rows: [],
      fields: [
        { key: "nomProjet", label: "Nom du projet", sortable: true },
        { key: "proprio", label: "Propriétaire", sortable: true },
        { key: "date", label: "Date", sortable: true },
        { key: "actions", label: "" },
      ],
      rowsName: [],
      options: [
        { text: "Public", value: true },
        { text: "Privée", value: false },
      ],
      nameState: "",
    };
  },
  methods: {
    async addProjet() {
      this.beforeAdd();
      await axios
        .post("api/projet/", {
          nomProjet: this.name,
          public: this.selected,
          proprio: this.getNom,
          rows: this.rows,
          date: this.limitDate,
        })
        .then((response) => {
          this.getFormatDate(response.data.date)
          this.myProjets.push({
            nomProjet: response.data.nomProjet,
            public: response.data.public,
            proprio: response.data.proprio,
            rows: response.data.rows,
            _id: response.data._id,
            date: this.currentDate,
          });
        })
        .catch();
        this.currentDate = ""
      this.$store.commit("SET_MES_PROJETS", this.myProjets);
    },
    getFormatDate(date) {
      if(date == null || undefined) {
        return
      }
      let data = new Date(date);
      let month;
      if (data.getMonth() + 1 < 10) {
        month = "" + data.getMonth() + 1;
      } else {
        month = data.getMonth() + 1;
      }

      let day = data.getDate();
      let year = data.getFullYear();
      this.currentDate = day + "/" + month + "/" + year;
    },
    hasChangePublic() {
      let save = this.isCheckedPublic;
      this.isCheckedPublic = !save;
      if (this.isCheckedPublic) {
        if (this.isCheckedPrivee) {
          this.myProjets = this.allProjet;
        } else {
          this.myProjets = this.publicProjet;
        }
      } else {
        if (this.isCheckedPrivee) {
          this.myProjets = this.priveeProjet;
        } else {
          this.myProjets = [];
        }
      }
    },
    hasChangePrivee() {
      let save = this.isCheckedPrivee;
      this.isCheckedPrivee = !save;
      if (this.isCheckedPrivee) {
        if (this.isCheckedPublic) {
          this.myProjets = this.allProjet;
        } else {
          this.myProjets = this.priveeProjet;
        }
      } else {
        if (this.isCheckedPublic) {
          this.myProjets = this.publicProjet;
        } else {
          this.myProjets = [];
        }
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    beforeAdd() {
      this.rowsName[0] = "Stories";
      this.rowsName.push("Terminées");
      for (let i = 0; i < this.rowsName.length; i++) {
        this.rows.push({
          id: i,
          name: this.rowsName[i],
          items: [],
        });
      }
      if(this.limitDate != null) {
        this.limitDate = new Date(this.limitDate)
      }
    },
    resetModal() {
      this.name = "";
      (this.nameState = null),
        (this.selected = true),
        (this.limitDate = null),
        (this.rowsSize = 2),
        (this.rows = []);
      this.rowsName = [];
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.addProjet();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    showProject(index) {
      // this.$store.commit("SET_CURRENT_PROJET", this.projets[index]);
      this.$router.push("/details/" + index);
    },
    strUcFirst(a) {
      return (a + "").charAt(0).toUpperCase() + a.substr(1);
    },
  },
};
</script>

<style>
.title {
  margin-top: 3%;
  margin-left: 3%;
  color: black;
  min-width: 200px;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

#addbutton {
  margin-left: 30px;
  margin-top: 1.5%;
  min-width: 200px;
  min-width: fit-content;
}

.projectscontainer {
  margin-top: 2%;
  min-width: 200px;
  margin-left: auto;
  margin-right: auto;
  max-width: 80%;
}

#searchinput {
  max-width: 400px;
  min-width: 200px;
  margin-top: 1.2%;
  padding-left: 0px;
}

.check {
  margin-left: 3%;
  padding-top: 5px;
}
</style>