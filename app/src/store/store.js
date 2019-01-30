import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from '../config';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		fromMonth: null,
		fromYear: null,
		toMonth: null,
		toYear: null,
		processedData: null,
		consultors: [],
		selected: [],
	},
	getters: {
		selected: state => {
			return state.selected;
		},
		months: state => {
      return [
        {value: "01", text: "Jan"},
        {value: "02", text: "Feb"},
        {value: "03", text: "Mar"},
        {value: "04", text: "Apr"},
        {value: "05", text: "May"},
        {value: "06", text: "Jun"},
        {value: "07", text: "Jul"},
        {value: "08", text: "Aug"},
        {value: "09", text: "Sep"},
        {value: "10", text: "Oct"},
        {value: "11", text: "Nov"},
        {value: "12", text: "Dec"},
      ];
    },
    years: state => {
      return [2003, 2004, 2005, 2006, 2007];
    },
    datesFilled: state => {
			if (state.fromYear == null || state.fromMonth == null || state.toYear == null || state.toMonth == null) {
    		return false;
    	}
    	return true;
    },
    relatorioValidation: (state, getters) => {
    	if (!getters.datesFilled){
    		return false;
    	}
    	if (state.toYear >= state.fromYear) {
    		if (state.toYear == state.fromYear) {
    			if (state.toMonth >= state.fromMonth) {
    				return true;
    			}
				} else {
  				return true;
				}
    	}
  		return false;
    }
	},
	mutations: {
		updateConsultors: (state, data) => {
			state.consultors = data;
		},
		selectConsultor: (state, consultors) => {
			consultors.forEach(el => {
				var res = state.consultors.filter(e => {
					return e.value == el;
				})[0];
				state.selected.push(res);
				state.consultors = state.consultors.filter(e => {
					return e.value != el;
				})
			});
		},
		unselectConsultor: (state, consultors) => {
			consultors.forEach(el => {
				var res = state.selected.filter(e => {
					return e.value == el;
				})[0];
				console.log(res);
				state.consultors.push(res);
				state.selected = state.selected.filter(e => {
					return e.value != el;
				})
			});
		},
		updateProcessedData: (state, data) => {
			state.processedData = data;
		},
		updateDateSelect: (state, data) => {
			state[data.field] = data.value;
		}
	},
	actions: {
		processData: (context) => {
			const state = context.state;
			axios.post(`${config.apiDir}/relatorio`,
				{
					selected: state.selected.map(elem => elem.value),
					fromDate: `${state.fromYear}-${state.fromMonth}-01`,
					toDate: `${state.toYear}-${state.toMonth}-01`,
				}
			)
      .then((response) => {
        // console.log(response.data);
        context.commit('updateProcessedData', response.data);
      });
		},
	}
});