<template>
  <div>
    <navbar></navbar>
    <div>
      <b-card-group deck class="formulaire">
        <b-card border-variant="Secondary" align="center">
          <h2>Connexion</h2>
          <b-row align-h="center" id="first">
            <b-col md="10">
              <b-form-group>
                <b-form-input
                  placeholder="Adresse email"
                  v-model="email"
                  type="email"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col md="10">
              <b-form-group>
                <b-form-input
                  placeholder="Mot de passe"
                  v-model="password"
                  type="password"
                  ref="password"
                  name="password"
                  required
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="center" id="button">
            <b-col md="10">
              <b-btn block variant="primary" size="lg" @click="login"
                >Connexion</b-btn
              >
            </b-col>
          </b-row>
          <div id="error">
            {{ errorMsg }}
          </div>
        </b-card>
      </b-card-group>
    </div>
    <div id="lieninscription">
      Vous n'êtes pas inscrit ?
      <router-link to="/inscription">Inscrivez-vous</router-link>
    </div>
  </div>
</template>


<script>
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "connexion",
  components: {
    Navbar,
  },
  data() {
    return {
      isConnected: false,
      email: "",
      password: "",
      nom: "",
      error: false,
      errorMsg: ""
    };
  },
  computed: {
    ...mapGetters(["getIsConnected"]),
  },
  methods: {
    connexion() {
      this.isConnected = true;
    },
    async login() {
      await axios
        .post("api/connexion/", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.commit("SET_CONNECTED", response.data.connected);
          this.$store.commit("SET_NOM", response.data.userName);
          this.$store.commit("SET_EMAIL", response.data.userEmail);
          this.$store.commit("SET_ID", response.data.userId);
          this.nom = response.data.userName;
        })
        .catch((error) => {
          this.error = true;
          this.errorMsg = error.response.data.error;
        });
      if (!this.error) {
        await axios
          .get("api/invitation/user/" + this.nom.toLowerCase())
          .then((response) => {
            this.$store.commit("SET_INVITATIONS", response.data);
            this.$router.push("/");
          })
          .catch();
      }
      this.error = false;
    },
  },
};
</script>
<style scoped lang="scss">
.formulaire {
  margin-top: 6%;
  width: 37%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 30%;
  min-width: 300px;
}

#first {
  padding-top: 5%;
}

#lieninscription {
  margin-top: 1.4%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#button {
  margin-top: 2%;
  margin-bottom: 3%;
}

#error {
  color: red;
}
</style>
