<template>
  <div>
    <navbar></navbar>
    <div>
      <b-card-group deck id="formulaire">
        <b-card border-variant="Secondary" align="center">
        <h2>Inscription</h2>
          <b-row align-h="center" id="first">
            <b-col md="10">
              <b-form-group
              text-variant=Secondary
              label-align-sm="left"
              label-size="sm">
                <b-form-input
                  class="form-control"
                  v-model="nom"
                  :state="nomState"
                  placeholder="Nom d'utilisateur"
                  required
                >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col md="10">
              <b-form-group
              text-variant=Secondary
              label-align-sm="left"
              label-size="sm">
                <b-form-input
                  id="input-email"
                  class="form-control"
                  type="email"
                  v-model="email"
                  :state="emailState"
                  aria-describedby="input-email"
                  placeholder="Adresse Email"
                  required
                >
                </b-form-input>
                <b-form-invalid-feedback id="input-email">
                  Entrez une adresse e-mail valide !
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row align-h="center">
            <b-col md="10">
              <b-form-group
              text-variant=Secondary
              label-align-sm="left"
              label-size="sm">
                <b-form-input
                  aria-describedby="input-passwordFirst"
                  :state="passwordFirstState"
                  class="form-control"
                  type="password"
                  v-model="password"
                  placeholder="Mot de passe"
                  required
                >
                </b-form-input>
                <b-form-invalid-feedback id="input-passwordFirst">
                  Le mot de passe doit être composé d'au moins 6 caractères !
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row align-h="center">
            <b-col md="10">
              <b-form-group
              text-variant=Secondary
              label-align-sm="left"
              label-size="sm">
                <b-form-input
                  aria-describedby="input-password"
                  class="form-control"
                  :state="passwordState"
                  type="password"
                  v-model="passwordBis"
                  placeholder="Retapez votre mot de passe"
                  required
                >
                </b-form-input>
                <b-form-invalid-feedback id="input-password">
                  Les mots de passe ne correspondent pas !
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row align-h="center">
            <b-col md="10">
              <b-form-group>
                <b-button
                  block
                  variant="primary"
                  @click="addItem"
                  :disabled="buttonValid"
                  size = "lg"
                  id="buttonregister"
                  >S'inscrire</b-button
                >
              </b-form-group>
            </b-col>
          </b-row>
          <div id="error">
            {{ error }}
          </div>
        </b-card>
      </b-card-group>
    </div>
    <!-- <div v-for="(item, i) in getUsers" :key="item._id">
      <p>
        <span>{{ i + 1 }}</span>
        {{ item }}
      </p>
    </div> -->
    <div id="lienconnexion">Déjà inscrit ? <router-link to="/connexion">Connectez-vous</router-link></div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "inscription",
  components: {
    Navbar,
  },
  data() {
    return {
      isConnected: true,
      isNom: null,
      isEmail: null,
      isPassword: null,
      isPasswordBis: null,
      nom: "",
      email: "",
      password: "",
      passwordBis: "",
      error: "",
    };
  },
  computed: {
    ...mapGetters(["getUsers"]),
    nomState() {
      if (this.nom == "") {
        return null;
      }
      return true;
    },
    passwordState() {
      if (this.passwordBis == "") {
        return null;
      }
      if (this.passwordBis != this.password) {
        return false;
      } else {
        return true;
      }
    },
    emailState() {
      if (this.email == "") {
        return null;
      }
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      return reg.test(this.email);
    },
    passwordFirstState() {
      if (this.password == "") {
        return null;
      }
      return this.password.length >= 6 ? true : false;
    },
    buttonValid() {
      return (
        !this.emailState ||
        !this.passwordState ||
        !this.passwordFirstState ||
        !this.nomState
      );
    },
  },
  methods: {
    async addItem() {
      this.error = "";
      await axios
        .post("api/inscription/", {
          nom: this.nom,
          email: this.email,
          password: this.password,
          passwordBis: this.passwordBis,
        })
        .then(() => {
          // this.users.push(response.data);
          this.$router.push("/connexion");
        })
        .catch((error) => {
          this.error = error.response.data.error;
        });
    },
  },
};
</script>

<style>


#formulaire {
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

#buttonregister {
  margin-top: 3%;
}

#lienconnexion {
  margin-top : 1.4%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#error {
  color: red;
}
</style>