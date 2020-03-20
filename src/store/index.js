import Vue from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';
import router from '../router/index';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {//State no puede ser modificado directamente, este estado es de solo lectura
    token: null,
    usuario: null,
  },
  mutations: {//la logica para cambiar el estado se declara aqui
    setToken(state, token){
      state.token=token;

    },
    setUsuario(state, usuario){
      state.usuario = usuario;
    }
  },
  actions: {//Las acciones pueden contener acciones asincronas arbitrarias
    guardarToken({commit}/*Permite realizar una mutación o acceder al state*/, token){
      //almacenar el token en el local storage
      commit("setToken", token);
      console.log(token);
      commit("setUsuario", decode(token));
      localStorage.setItem("token", token);
    },
    autoLogin({commit}){
      //Si ya tengo un token valido en el local storage ya no me va a pedir que vuelva a acceder al sistema
      let token = localStorage.getItem("token");
      if(token){
        commit("setToken", token);
        commit("setUsuario", decode(token));
      }
      router.push({name: 'home'});
    },
    salir({commit}){
      //Eliminar token del localstorage
      commit("setToken", null);
      commit("setUsuario", null);
      localStorage.removeItem("token");
      router.push({name: 'login'});
    }
  },
  modules: {
  }
})
