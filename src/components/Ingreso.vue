<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="ingresos"
        class="elevation-1"
        :search="search"
        v-if="!verNuevo"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>ingresos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              v-if="!verNuevo"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" v-if="!verNuevo" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
            <!--Dialogo de Editar-->
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
            <span class="blue--text">Aceptado</span>
          </div>
          <div v-else>
            <span class="red--text">Anulado</span>
          </div>
        </template>
        <template v-slot:item.opciones="{ item }">
          <v-icon small class="mr-2" @click="verIngreso(item)">tab</v-icon>
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
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select :items="comprobantes" v-model="tipo_comprobante" label="Tipo Comprobante"></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="serie_comprobante" label="Serie comprobante"></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="num_comprobante" label="Numero comprobante"></v-text-field>
          </v-flex>
          <vflex xs12 sm8 md8 lg8 xl8>
            <v-autocomplete :items="personas" v-model="persona" label="Proveedor"></v-autocomplete>
          </vflex>
          <vflex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Impuesto"></v-text-field>
          </vflex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field v-model="codigo" label="codigo" @keyup.enter="buscarCodigo()"></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12>
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
              <v-icon>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 x12 v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="detalles"
                hide-actions
                class="elevation-1"
              >
                <template v-slot:item.borrar="{ item }">
                  <template>
                    <v-icon small @click="eliminarDetalle(detalles, item)" color="pink">delete</v-icon>
                  </template>
                </template>

                <template v-slot:item.cantidad="{ item }">
                  <template>
                    <v-text-field type="number" v-model="item.cantidad"></v-text-field>
                  </template>
                </template>

                <template v-slot:item.precio="{ item }">
                  <template>
                    <v-text-field type="number" v-model="item.precio"></v-text-field>
                  </template>
                </template>

                <template v-slot:item.subtotal="{ item }">
                  <template class="text-xs-center">$ {{item.cantidad * item.precio}}</template>
                </template>

                <template v-slot:no-data>
                  <h3>No hay artículos agregados al detalle</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Total Parcial:</strong>
                ${{totalParcial=(total-totalImpuesto).toFixed(2)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Impuesto:</strong>
                ${{totalImpuesto=((total*impuesto)/(1+impuesto)).toFixed(2)}}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total neto:</strong>
                ${{total=calcularTotal}}
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click="ocultarNuevo()">Cancelar</v-btn>
            <v-btn color="success" v-if="verDetalle=0" @click.native="guardar()">Guardar</v-btn>
          </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un articulo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      class="text-xs-center"
                      append-icon="search"
                      label="Búsqueda"
                      v-model="texto"
                      @keyup.enter="listarArticulos()"
                    ></v-text-field>
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template v-slot:item.seleccionar="{ item }">
                          <v-icon small class="mr-2" @click="agregarDetalle(item)" color="teal">add</v-icon>
                        </template>

                        <template v-slot:item.estado="{ item }">
                          <div v-if="item.estado">
                            <span class="blue--text">Activo</span>
                          </div>
                          <div v-else>
                            <span class="red--text">Inactivo</span>
                          </div>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
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
      ingresos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Usuario", value: "usuario.nombre", sortable: true },
        { text: "Proveedor", value: "persona.nombre", sortable: true },
        { text: "Tipo comprobante", value: "tipo_comprobante", sortable: true },
        { text: "Serie comprobante", value: "serie_comprobante", sortable: false },
        { text: "Numero comprobante", value: "num_comprobante", sortable: false },
        { text: "Fecha", value: "createdAt", sortable: false },
        { text: "Impuesto", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false }
      ],
      _id: "",
      persona: "",
      personas: [],
      tipo_comprobante: "",
      comprobantes: ["BOLETA", "FACTURA", "TICKET", "GUIA"],
      serie_comprobante: "",
      num_comprobante: "",
      impuesto: 0.18,
      codigo: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Articulo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Precio", value: "precio", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false }
      ],
      detalles: [],
      verNuevo: 0,
      errorArticulo: null,
      total: 0,
      totalParcial: 0,
      totalImpuesto: 0,
      articulos: [],
      texto: "",
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Categoria", value: "categoria.nombre", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Estado", value: "estado", sortable: false }
      ],
      verDetalle:0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    calcularTotal: function() {
      let resultado = 0.0;
      for (let i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado + this.detalles[i].cantidad * this.detalles[i].precio;
      }
      return resultado;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listar();
    this.selectPersona();
  },

  methods: {
    selectPersona() {
      let me = this;
      let personaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("persona/listProveedores", configuracion)
        .then(function(response) {
          personaArray = response.data;
          personaArray.map(function(x) {
            me.personas.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.persona) {
        this.validaMensaje.push("Seleccione un proveedor");
      }
      if (!this.tipo_comprobante) {
        this.validaMensaje.push("Seleccione un tipo de comprobante");
      }
      if (!this.num_comprobante) {
        this.validaMensaje.push("ingrese el número del comprobante");
      }
      if (!this.impuesto || this.impuesto < 0 || this.impuesto > 1) {
        this.validaMensaje.push("Ingrese un impuesto valido.");
      }
      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un articulo al detalle.");
      }
      if (this.validaMensaje.length > 0) {
        this.valida = 1;
      }
      return this.valida;
    },
    agregarDetalle(data) {
      this.errorArticulo = null;
      if (this.encuentra(data._id)) {
        this.errorArticulo = "El Articulo ya ha sido agregado";
      } else {
        this.detalles.push({
          _id: data._id,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precio_venta
        });
        this.codigo = "";
      }
    },
    encuentra(id) {
      let sw = false;
      for (let index = 0; index < this.detalles.length; index++) {
        if (this.detalles[index]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    listarArticulos() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("articulo/list?valor=" + this.texto, configuracion)
        .then(function(response) {
          me.articulos = response.data;
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("ingreso/query?_id="+id, configuracion)
        .then(function(response) {
          me.detalles = response.data.detalles;
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    verIngreso(item){
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.serie_comprobante = item.serie_comprobante;
      this.num_comprobante= item.num_comprobante;
      this.persona = item.persona._id;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle=1;
    },
    mostrarModalArticulos() {
      this.dialog = true;
      console.log(this.dialog);
    },
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("ingreso/list", configuracion)
        .then(function(response) {
          me.ingresos = response.data;
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    buscarCodigo() {
      let me = this;
      me.errorArticulo = null;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      //GET hace referencia al metodo http para hacer la petición a esa ruta
      axios
        .get("articulo/queryCodigo?codigo=" + this.codigo, configuracion)
        .then(function(response) {
          me.agregarDetalle(response.data);
        })
        .catch(function(e) {
          me.errorArticulo = "No existe el articulo";
        });
    },
    limpiar() {
      this._id = "";
      this.tipo_comprobante = "";
      this.serie_comprobante = "";
      this.num_comprobante = "";
      this.impuesto = 0;
      this.codigo = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.detalles = [];
      this.verNuevo = 0;
      this.valida = 0;
      this.validaMensaje = [];
      this.verDetalle=0;
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        //Si validar regres un 1 entonces algun dato esta mal
        return; //por ende, tenemos que detener la ejecución del gurdado
      }
      //Codigo para guardar
      console.log(this.$store);
      axios
        .post(
          "ingreso/add",
          {
            persona: this.persona,
            usuario: this.$store.state.usuario._id,
            tipo_comprobante: this.tipo_comprobante,
            serie_comprobante: this.serie_comprobante,
            num_comprobante: this.num_comprobante,
            impuesto: this.impuesto,
            total: this.total,
            detalles: this.detalles
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
    },
    activarDesactivar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.num_comprobante;
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
        .put("ingreso/activate", { _id: this.adId }, configuracion)
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
        .put("ingreso/deactivate", { _id: this.adId }, configuracion)
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