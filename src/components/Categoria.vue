<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table :headers="headers" :items="categorias" class="elevation-1" :search="search">
            <template v-slot:top>
                <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
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
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.estado="{ item }">
                <div v-if="item">
                  <span class="blue--text">
                    Activo
                  </span>
                </div>
                <div v-else>
                  <span class="red--text">
                    Inactivo
                  </span>
                </div>
            </template>
            <template v-slot:item.opciones="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)" color="teal">edit</v-icon>
                <v-icon small @click="deleteItem(item)" color="pink">delete</v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="listar">Reset</v-btn>
            </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      dialog: false,
      search: '',
      categorias: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false},
        { text: "Nombre", value: "nombre", sortable: true},
        { text: "Descripción", value: "descripcion", sortable: false},
        { text: "Estado", value: "estado", sortable: false},     
         
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      }
    };
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Item' : 'Editar Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.listar()
  },

  methods: {
      listar(){
              let me = this;
              //GET hace referencia al metodo http para hacer la petición a esa ruta
              axios.get('categoria/list').then(function (response) {
              me.categorias = response.data;
          }).catch(function(e){
              console.log(e);
          });
      },
    initialize () {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        }
      ]
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && 
      this.desserts.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
};
</script>