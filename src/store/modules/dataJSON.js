import axios from "axios";

const state = {
    data: {},
    names: {}
};
const getters = {};
const actions = {
    getData(context) {
        axios.get("/json/data.json")
            .then( response => {
                context.commit('setData', response.data.Value.Goods);
            })
    },
    getNames(context) {
        axios.get("/json/names.json")
            .then( response => {
                context.commit('setNames', response.data);
            })
    },
};
const mutations = {
    setData( state, payload ) {
        state.data = payload;
    },

    setNames( state, payload ) {
        state.names = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
