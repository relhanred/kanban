<template>
  <div>
    <navbar></navbar>
    <div>
      <h1 id="title">Profil</h1>
      <div id="infocontainer">
      <p>Nom d'utilisateur : {{getNom}}</p>
      <p>Email : {{getEmail}}</p>
      </div>

    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import {mapGetters} from 'vuex'
export default {
  name:"profil",
  components: {
    Navbar
  },
  computed : {
    ...mapGetters(['getNom', 'getId', 'getEmail'])
  }
}
</script>

<style>

#title {
  margin-top: 3%;
  margin-left: 3%;
  color: black;
  min-width: 200px;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
}

#infocontainer {
  margin-top: 30px;
  margin-left: 20px;
}

</style>