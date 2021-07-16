<template>
  <div>
    <navbar></navbar>
    <div v-if="!charging">
      <b-spinner label="Spinning"></b-spinner>
    </div>
    <h1 id="title">{{ nomProjet }}</h1>
    <div class="drag-container" v-drag-and-drop:options="options">
      <ul class="drag-list">
        <li class="drag-column" v-for="group in groups" :key="group.id">
          <span class="drag-column-header">
            <h2>{{ group.name }}</h2>
          </span>
          <vue-draggable-group
            v-model="group.items"
            :groups="groups"
            :data-id="group.id"
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { VueDraggableDirective } from "vue-draggable";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "projetDetails",
  directives: {
    dragAndDrop: VueDraggableDirective,
  },
  components: {
    Navbar,
  },
  async mounted() {
    await axios
      .get("api/projet/id/" + this.$route.params.id)
      .then((response) =>
        this.$store.commit("SET_CURRENT_PROJET", response.data)
      )
      .catch();
    this.groups = this.getCurrProjet.rows;
    this.nomProjet = this.getCurrProjet.nomProjet;
    this.charging = true;
  },
  data() {
    return {
      nomProjet: "",
      users: [],
      groups: [],
      charging: false,
      options: {
        dropzoneSelector: ".drag-inner-list",
        draggableSelector: ".drag-item",
        onDragstart: this.onDragstart,
      },
    };
  },
  computed: {
    ...mapGetters(["getProjetNom", "getCurrProjet"]),
  },
  methods: {
        select(user) {
      if (!this.invitation.includes(user) && user != null) {
        this.invitation.push(user);
        this.query = "";
      }
    },
    onDragstart(e) {
        e.stop();
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






