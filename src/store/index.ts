import { createStore } from "vuex";
import { Canceler } from "axios";
import router from "@/router";

const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    ADD_COUNT(state, language) {
      state.count += 1;
    },
  },
  actions: {},
  getters: {},
});

export function myStore() {
  return store;
}

export default store;
