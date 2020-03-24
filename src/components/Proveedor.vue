<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="personas" class="elevation-1" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Proveedores</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <!--Dialogo de Editar-->
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="num_documento" label="Numero Documento"></v-text-field>
                      </v-col>
                     
                      <v-col cols="12" sm="6" md="6">
                        <v-flex>
                            <v-select v-model="tipo_documento"
                                :items="documentos" label="Tipo Documentos">
                            </v-select>
                        </v-flex>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="email" label="Email"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" v-show="valida === 1">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!--Dialogo de Activar Desactivar-->
            <v-dialog v-model="adModal" max-width="500px">
              <v-card>
                <v-card-title class="headline" v-if="adAccion==1">Activar Item</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Desactivar Item</v-card-title>

                <v-card-text>
                  Estás a punto de
                  <span v-if="adAccion==1">activar</span>
                  <span v-if="adAccion==2">desactivar</span>
                  el item {{adNombre}}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat="flat" text @click="close">Cancelar</v-btn>
                  <v-btn
                    v-if="adAccion==1"
                    color="orange darken-4"
                    flat="flat"
                    text
                    @click="activar()"
                  >Activar</v-btn>
                  <v-btn
                    v-if="adAccion==2"
                    color="orange darken-4"
                    flat="flat"
                    text
                    @click="desactivar()"
                  >Desactivar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.estado="{ item }">
          <div v-if="item.estado">
            <span class="blue--text">Activo</span>
          </div>
          <div v-else>
            <span class="red--text">Inactivo</span>
          </div>
        </template>
        <template v-slot:item.opciones="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" color="teal">edit</v-icon>
          <template v-if="item.estado">
            <v-icon small @click="activarDesactivar(2, item)" color="pink">block</v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activarDesactivar(1, item)" color="pink">check</v-icon>
          </template>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      personas: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Tipo persona", value: "tipo_persona", sortable: true },
        { text: "Tipo Documento", value: "tipo_documento", sortable: true },
        { text: "Numero Documento", value: "num_documento", sortable: false },
        { text: "Dirección", value: "direccion", sortable: false },
        { text: "Telefono", value: "telefono", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      tipo_persona:"Proveedor",
      tipo_documento:'',
      documentos:['DNI', 'RUC', 'PASAPORTE', 'CEDULA'],
      num_documento:'',
      telefono:'',
      direccion:'',
      email:'',
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar Registro";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listar();
  },

  methods: {
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la persona debe tener de 1 a 50 caracteres."
        );
      }
      if (this.num_documento.length > 20) {
        this.validaMensaje.push(
          "El documento debe tener un maximo de 20 caracteres."
        );
      }
      if (this.direccion.length > 70) {
        this.validaMensaje.push(
          "La dirección debe tener un maximo de 70 caracteres."
        );
      }
      if (this.telefono.length > 20) {
        this.validaMensaje.push(  
          "La dirección debe tener un maximo de 70 caracteres."
        );
      }
      if (this.email.length > 50) {
        this.validaMensaje.push(
          "El email del usuario debe tener de 1 a 50 caracteres."
        );
      }
      if (this.validaMensaje.length > 0) {
        this.valida = 1;
      }
      return this.valida;
    },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("persona/listProveedores", configuracion)
        .then(function(response) {
          me.personas = response.data;
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    limpiar() {
      this._id = "";
      this.nombre = "";
      this.num_documento = "";
      this.direccion = "";
      this.telefono = "";
      this.email = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        //Si validar regres un 1 entonces algun dato esta mal
        return; //por ende, tenemos que detener la ejecución del gurdado
      }
      if (this.editedIndex > -1) {
        //Codigo para editar
        axios
          .put(
            "persona/update",
            {
              '_id': this._id,
              'tipo_persona': this.tipo_persona,
              'nombre': this.nombre, 
              'tipo_documento': this.tipo_documento,
              'num_documento': this.num_documento,
              'telefono': this.telefono,
              'direccion': this.direccion,
              'email': this.email,
            },
            configuracion
          )
          .then(function(response) {
            //Si la petición de arriba es exitosa, (then)entonces vamos a recibir una respuesta (response)
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            //Si la petición es fallida esperaremos un error que va a regresar el servidor
            console.log(error);
          });
      } else {
        //Codigo para guardar
        axios
          .post(
            "persona/add",
            {
                'tipo_persona': this.tipo_persona, 
                'nombre': this.nombre, 
                'tipo_documento': this.tipo_documento,
                'num_documento': this.num_documento,
                'telefono': this.telefono,
                'direccion': this.direccion,
                'email': this.email,
            },
            configuracion
          )
          .then(function(response) {
            //Si la petición de arriba es exitosa, (then)entonces vamos a recibir una respuesta (response)
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            //Si la petición es fallida esperaremos un error que va a regresar el servidor
            console.log(error);
          });
      }
    },
    editItem(item) {
      this._id = item._id;
      this.rol = item.rol;
      this.nombre = item.nombre;
      this.tipo_documento = item.tipo_documento;
      this.num_documento = item.num_documento;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.password = item.password;
      this.dialog = true;
      this.editedIndex = 1;
    },
    activarDesactivar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = accion;
      } else if (accion == 2) {
        this.adAccion = accion;
      } else {
        this.adModal = 0;
      }
    },
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios
        .put("persona/activate", { _id: this.adId }, configuracion)
        .then(function(response) {
          //Si la petición de arriba es exitosa, (then)entonces vamos a recibir una respuesta (response)
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          //Si la petición es fallida esperaremos un error que va a regresar el servidor
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      axios
        .put("persona/deactivate", { _id: this.adId },configuracion)
        .then(function(response) {
          //Si la petición de arriba es exitosa, (then)entonces vamos a recibir una respuesta (response)
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          //Si la petición es fallida esperaremos un error que va a regresar el servidor
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.adModal = 0;
    }
  }
};
</script>