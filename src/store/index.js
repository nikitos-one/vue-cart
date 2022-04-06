import Vue from "vue";
import Vuex from "vuex";

import dataJSON from "./modules/dataJSON";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dataJSON
  }
})
