import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js'
import Home from '../views/Home.vue';
import Categoria from '../components/Categoria.vue';
import Articulo from '../components/Articulo.vue';
import Usuario from '../components/Usuario.vue';
import Cliente from '../components/Cliente.vue';
import Login from '../components/Login.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      administrador: true,
      almacenero: true,
      vendedor: true
    }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: Categoria,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      administrador: true,
      almacenero: true,
    }
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: Cliente,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      administrador: true,
      vendedor: true,
    }
  },
  {
    path: '/articulo',
    name: 'articulo',
    component: Articulo,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      administrador: true,
      almacenero: true,
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      administrador: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{//El objeto meta nos indica a que rutas puede acceder que usuario
      libre: true,
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next();
  }else if(store.state.usuario && store.state.usuario.rol == "Administrador"){
    if(to.matched.some(record => record.meta.administrador)){
      next();
    }
  }else if(store.state.usuario && store.state.usuario.rol == "Vendedor"){
    if(to.matched.some(record => record.meta.vendedor)){
      next();
    }
  }else if(store.state.usuario && store.state.usuario.rol == "Almacenero"){
    if(to.matched.some(record => record.meta.almacenero)){
      next();
    }
  }else{
    next({name: "login"});
  }
});

export default router;