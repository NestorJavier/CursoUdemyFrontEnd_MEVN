<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="logueado"
    >
      <v-list dense><!--Menu-->
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-item :to="{name:'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>  
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group><!--Para agregar submenus-->
            <v-list-item slot="activator"><!--Al hacer click va a agregar subitems-->
              <v-list-item-content>
                <v-list-item-title>
                  Almacén
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'categoria'}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Categorías
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'articulo'}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Articulos
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>            
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero">
          <v-list-group><!--Para agregar submenus-->
            <v-list-item slot="activator"><!--Al hacer click va a agregar subitems-->
              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Ingresos
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Proveedores
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>            
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esVendedor">
          <v-list-group><!--Para agregar submenus-->
            <v-list-item slot="activator"><!--Al hacer click va a agregar subitems-->
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Ventas
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'cliente'}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Clientes
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>            
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group><!--Para agregar submenus-->
            <v-list-item slot="activator"><!--Al hacer click va a agregar subitems-->
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:'usuario'}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Usuarios
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>          
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-group><!--Para agregar submenus-->
            <v-list-item slot="activator"><!--Al hacer click va a agregar subitems-->
              <v-list-item-content>
                <v-list-item-title>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name:''}"><!--:to="{name:''} es para que acceda a una ruta-->
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
              <v-list-item-title>
                Consulta ventas
              </v-list-item-title>
              </v-list-item-content>
            </v-list-item>            
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-3"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="salir()" icon v-if="logueado">
        <v-icon>logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{name:'login'}" icon v-else>
        <v-icon>apps</v-icon> Login
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-slide-y-transition mode="out-in">
          <router-view/><!--Carga componentes teniendo en cuenta una ruta-->
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat item color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Udemy &copy;2019
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return{
      drawer: true,
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Administrador";
    },
    esAlmacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Almacenero";
    },
    esVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == "Vendedor";
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
};
</script>