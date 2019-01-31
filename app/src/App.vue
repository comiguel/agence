<template>
  <b-container>
    <navbar></navbar>
    <b-row class="justify-content-center my-5">
      <b-col md="9">
        <b-row class="justify-content-center">
          <b-col md="2"><p class="text-center">Periodo</p></b-col>
          <b-col md="10">
            de
            <b-form-select class="select" @change="updateDateSelect('fromMonth', $event)" :options="months"></b-form-select>
            <b-form-select class="select" @change="updateDateSelect('fromYear', $event)" :options="years"></b-form-select>
            a
            <b-form-select class="select" @change="updateDateSelect('toMonth', $event)" :options="months"></b-form-select>
            <b-form-select class="select" @change="updateDateSelect('toYear', $event)" :options="years"></b-form-select>
          </b-col>
          <b-row class="justify-content-center mt-1">
            <b-alert :show="datesError" variant="danger">Por favor verifique la consistencia del rango de fechas</b-alert>
          </b-row>
        </b-row>
        <b-row class="mt-5">
          <b-col md="2"><p class="text-center">Consultores</p></b-col>
          <b-col md="4">
            <selector multi="multiple" :data="consultors" ref="total"></selector>
          </b-col>
          <b-col md="2">
            <b-button @click="unselectConsultor"><<</b-button>
            <b-button @click="selectConsultor">>></b-button>
          </b-col>
          <b-col md="4">
            <selector multi="multiple" :data="selected" ref="selected"></selector>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="3">
        <b-row class="justify-content-center my-2">
          <b-button :disabled="!btnState" @click="generateRelatorio" variant="info">Relatório</b-button>
        </b-row>
        <b-row class="justify-content-center my-2">
          <b-button :disabled="!btnState" @click="generateGrafico" variant="success">Gráfico</b-button>
        </b-row>
        <b-row class="justify-content-center my-2">
          <b-button :disabled="!btnState" @click="generatePizza" variant="primary">Pizza</b-button>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="justify-content-center my-5">
      <detail :component="component"></detail>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';
  import config from './config';
  import navbar from './components/Navbar';
  import selector from './components/Selector';
  import detail from './components/Detail';
  export default {
    name: 'app',
    components: {navbar, selector, detail},
    data() {
      return {
        component: '',
      }
    },
    mounted() {
      axios.get(`${config.apiDir}/consultor`)
      .then((response) => {
        this.$store.commit('updateConsultors', response.data.results.map(function(elem, index) {
          return { value: elem.co_usuario, text: elem.no_usuario };
        }));
      });
    },
    methods: {
      selectConsultor() {
        this.$store.commit('selectConsultor', this.$refs.total.selected);
        this.$refs.total.selected = [];
      },
      unselectConsultor() {
        this.$store.commit('unselectConsultor', this.$refs.selected.selected);
        this.$refs.selected.selected = [];
      },
      updateDateSelect(field, value) {
        this.$store.commit('updateDateSelect', {field, value});
      },
      generateRelatorio() {
        this.$store.dispatch('processData');
        this.component = 'consultor';
      },
      generateGrafico() {
        this.$store.dispatch('processData');
        this.component = 'grafico';
      },
      generatePizza() {
        this.$store.dispatch('processData');
        this.component = 'pizza';
      }
    },
    computed: {
      consultors() {
        return this.$store.state.consultors;
      },
      selected() {
        return this.$store.state.selected;
      },
      months() {
        return this.$store.getters.months;
      },
      years() {
        return this.$store.getters.years;
      },
      processedData() {
        return this.$store.state.processedData === null;
      },
      datesError() {
        if (!this.$store.getters.relatorioValidation && this.$store.getters.datesFilled){
          return true;
        }
        return false;
      },
      btnState() {
        if (this.$store.getters.relatorioValidation && this.$store.state.selected.length > 0){
          return true;
        }
        return false;
      }
    }
  }
</script>

<style scoped>
 /*lang="scss"*/
  /*@import '../node_modules/bootstrap/scss/bootstrap.scss';*/
  .select {
    max-width: 100px;
  }
</style>
