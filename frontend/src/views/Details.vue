<template>
  <div>
    <navbar></navbar>
    <div v-if="!charging">
      <b-spinner label="Spinning"></b-spinner>
    </div>
    <div v-else>
      <h1 id="title">{{ strUcFirst(nomProjet) }}</h1>

      <span id="headerproject">
        Collaborateurs :
        <span
          v-for="user in users"
          :key="user"
          style="font-size: 0.9em; margin-left: 10px"
        >
          {{ strUcFirst(user) }}
        </span></span
      >

      <div v-if="isProprio">
        <b-button
          v-b-toggle.my-collapse
          variant="outline-dark"
          style="margin-left: 10px"
          >Inviter</b-button
        >
        <b-collapse id="my-collapse" style="margin-left: 10px">
          <vue-bootstrap-typeahead
            class="col-xs-3"
            v-model="query"
            :data="data"
            @hit="select"
            placeholder="Entrez le nom de l'utilisateur"
            prepend="Utilisateur :"
            style="width: 360px; margin-top: 20px"
          />

          <div
            v-for="user in invitation"
            :key="user"
            style="margin-left: 30px; margin-top: 10px; margin-bottom: 10px"
          >
            <b-avatar class="mr-2" size="sm"></b-avatar>{{ user }}
          </div>
          <b-button @click="sendInvitation" variant="dark">Valider</b-button>

          <div v-if="invitationSucces" class="invitationSucces">
            {{ succes }}
          </div>
        </b-collapse>
      </div>

      <div id="bigcontainer" style="">
        <div class="drag-container" v-drag-and-drop:options="options">
          <ul class="drag-list">
            <li
              class="drag-column"
              v-for="(group, index) in groups"
              :key="group.id"
            >
              <span class="drag-column-header">
                <h2>{{ group.name }}</h2>
              </span>
              <vue-draggable-group
                v-model="group.items"
                :groups="groups"
                :data-id="group.id"
                @change="onGroupsChange"
              >
                <ul class="drag-inner-list" :data-id="group.id">
                  <li
                    class="drag-item"
                    v-for="item in group.items"
                    :key="item.id"
                    :data-id="item.id"
                  >
                    <p class="drag-item-text">{{ item.name }}</p>
                    <p class="drag-item-text" id="usertask">
                      <b-avatar class="mr-2" size="25"></b-avatar
                      >{{ strUcFirst(item.users[0]) }}
                    </p>
                  </li>
                </ul>
              </vue-draggable-group>

              <div v-if="taskValue[index]" class="input-group">
                <b-input
                  placeholder="Ajouter une tache"
                  v-model="taskValue[index].value"
                ></b-input>
                <b-button @click="add(index)" variant="dark"
                  ><b-icon-plus></b-icon-plus
                ></b-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { VueDraggableDirective } from "vue-draggable";
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import { mapGetters } from "vuex";

import axios from "axios";
export default {
  name: "Details",
  directives: {
    dragAndDrop: VueDraggableDirective,
  },
  components: {
    Navbar,
    VueBootstrapTypeahead,
  },
  async mounted() {
    await axios
      .get("/api/projet/id/" + this.$route.params.id)
      .then((response) =>
        this.$store.commit("SET_CURRENT_PROJET", response.data)
      )
      .catch();
    this.completeProjet = this.getCurrProjet;
    this.groups = this.getCurrProjet.rows;
    this.nomProjet = this.getCurrProjet.nomProjet;
    this.users = this.getCurrProjet.users;
    this.id = this.getCurrProjet._id;
    if (!this.users.includes(this.getNom.toLowerCase())) {
      this.users.push(this.getNom.toLowerCase());
    }
    this.proprio = this.getCurrProjet.proprio;
    this.groups.forEach(() => {
      this.taskValue.push({ value: "" });
    });

    this.succes = "";
    this.invitationSucces = false;
    await axios
      .get("/api/inscription/")
      .then(
        (response) =>
          response.data.forEach((e) => {
            if (!(e.nom.toLowerCase() == this.getNom.toLowerCase())) {
              this.data.push(e.nom);
            }
          }),
        (this.charging = true)
      )
      .catch();
    if (this.getNom.toLowerCase() == this.proprio.toLowerCase()) {
      this.isProprio = true;
    }
  },
  data() {
    return {
      usersOftask: [],
      data: [],
      datatTask: [],
      addUserTask: "",
      usersTask: [],
      id: "",
      query: "",
      completeProjet: {},
      taskValue: [],
      invitation: [],
      max: 9999999,
      added: false,
      keepFirst: false,
      openOnFocus: false,
      name: "",
      nomProjet: "",
      proprio: "",
      succes: "",
      invitationSucces: false,
      selected: null,
      clearable: false,
      users: [],
      groups: [],
      charging: false,
      isProprio: false,
      nameState: null,
      options: {
        dropzoneSelector: ".drag-inner-list",
        draggableSelector: ".drag-item",
        onDragstart: this.onDragstart,
        onGroupsChange: this.onGroupsChange,
      },
    };
  },
  //APPELER REDHA INVITATION RESTRICTION
  computed: {
    ...mapGetters(["getProjetNom", "getCurrProjet", "getNom"]),
    filteredDataObj() {
      return this.data.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(this.name.toLowerCase()) >= 0
        );
      });
    },
  },
  methods: {
    buttonAffect(e) {
      console.log(e)
      console.log(!e.includes(this.getNom.toLowerCase()))
      // if (
      //   this.getNom.toLowerCase() == this.proprio.toLowerCase() ||
      //   !e.includes(this.getNom.toLowerCase())
      // ) {
      //   return true;
      // }
      // return false;
    },

    buttonAffectClick(e) {
      this.groups.forEach(element => {
        element.items.forEach(task => {
          if(e.id == task.id) {
            let tab = task.users
            this.users.forEach(user => {
              if(!tab.includes(user)){
                this.usersOftask.push(user)
              }
            })            
          }
        })
      })
    },
    select(user) {
      if (!this.invitation.includes(user) && user != null) {
        this.invitation.push(user);
        this.query = "";
      }
    },
    selectTask(user) {
      console.log(user);
      // if (!this.usersOftask.includes(user) && user != null) {
      //   this.invitation.push(user);
      //   this.addUserTask = "";
      // }
    },
    onDragstart(e) {
      let index = 0;
      this.groups.forEach((group) => {
        group.items.forEach((item) => {
          if (item.id == e.items[0].dataset.id) {
            item.users.forEach((user) => {
              if (
                user.includes(this.getNom.toLowerCase()) ||
                this.proprio == this.getNom.toLowerCase()
              ) {
                index += 1;
              }
            });
          }
        });
      });
      if (index == 0) {
        e.stop();
      }
    },
    resetModal() {
      this.usersTask = [];
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      console.log("c'est bon");
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
    checkFormValidity() {
      // const valid = this.$refs.form.checkValidity();
      // this.nameState = valid;
      console.log("c'est biv");
      return true;
    },
    async onGroupsChange(e) {
      await axios
        .put("/api/projet/" + this.id, { rows: e })
        .then(() => {})
        .catch();
    },
    async add(index) {
      if (this.taskValue[index].value == "") return;
      let arr = [];
      arr.push(this.getNom.toLowerCase());
      this.completeProjet.rows[index].items.push({
        id: Math.floor(Math.random() * Math.floor(this.max)),
        name: this.taskValue[index].value,
        users: arr,
      });
      await axios
        .put("/api/projet/" + this.getCurrProjet._id, this.completeProjet)
        .then(() => {})
        .catch(() => {});
      this.groups = this.completeProjet.rows;
      this.taskValue[index].value = "";
    },
    async sendInvitation() {
      await axios
        .post("/api/invitation/", {
          idProjet: this.getCurrProjet._id,
          nomProjet: this.nomProjet,
          proprio: this.proprio,
          guests: this.invitation,
        })
        .then(() => {
          this.invitation = [];
          this.query = "";
          this.succes = "Les utilisateurs ont été invités avec succès !";
          this.invitationSucces = true;
        })
        .catch(() => {});
    },
    strUcFirst(a) {
      return (a + "").charAt(0).toUpperCase() + a.substr(1);
    },
  },
};
</script>

<style lang="scss">
$ease-out: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
$to-do: #f4ce46;
$in-progress: #2a92bf;
$approved: #00b961;

#title {
  margin-top: 3%;
  margin-left: 3%;
  color: black;
  min-width: 200px;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

#usertask {
  font-size: 0.9em;
  text-align: right;
  padding-right: 15px;
}

#headerproject {
  font-size: 0.9em;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10px;
}

* {
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.drag-container {
  margin-top: 20px;
  padding-left: 5%;
  padding-right: 5%;
  min-width: fit-content;
}

.drag-list {
  display: flex;
  align-items: flex-start;
  max-height: 40px;

  @media (max-width: 690px) {
    display: block;
  }
}

.invitationSucces {
  color: $approved;
}

.drag-column {
  flex: 1;
  margin: 0 10px;
  position: relative;
  background: rgba(rgb(194, 194, 194), 0.2);
  overflow: hidden;
  max-width: 300px;
  min-width: 300px;

  border: 0.1px solid rgba(rgb(218, 218, 218), 0.2);

  border-radius: 15px;
  @media (max-width: 690px) {
  }

  h2 {
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    font-weight: 600;
  }

  &-to-do {
    .drag-column-header,
    .drag-options {
      background: $to-do;
    }
  }

  &-in-progress {
    .drag-column-header,
    .drag-options {
      background: $in-progress;
    }
  }

  &-approved {
    .drag-column-header,
    .drag-options {
      background: $approved;
    }
  }
}

.drag-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  user-select: none;
}

.drag-inner-list {
  height: fit-content;
  min-height: 50px;
  overflow: auto;
}

.drag-item {
  margin: 10px;
  height: fit-content;
  max-height: 80%;
  background: rgb(255, 255, 255);
  border: 0.1px solid rgba(rgb(201, 201, 201), 0.4);
  transition: $ease-out;
  border-radius: 8px;
  cursor: grab;

  /* items grabbed state */
  &[aria-grabbed="true"] {
    background: #e0dfdf;
    color: #fff;
    cursor: grabbing;
  }

  .drag-item-text {
    font-size: 1rem;
    color: black;
    padding-left: 1rem;
    padding-top: 1rem;
  }
}

.drag-header-more {
  cursor: pointer;
}

@keyframes nodeInserted {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.8;
  }
}

.item-dropzone-area {
  height: 6rem;
  background: rgb(223, 223, 223);
  opacity: 0.8;
  animation-duration: 0.5s;
  animation-name: nodeInserted;
  margin-left: 0.6rem;
  margin-right: 0.6rem;
}
</style>
