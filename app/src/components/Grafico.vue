<template>
	<GChart
	type="ColumnChart"
	:data="performance"
	:options="options"
	/>
</template>

<script>
	import { GChart } from 'vue-google-charts'

	export default {
		components: {
			GChart
		},
		computed: {
			performance() {
				return this.$store.getters.performance;
			},
			options() {
				return {
					width: 1000,
					height: 300,
					BarFormat: {width: 50},
					vAxis: {title: 'R$ Generado', format: 'currency'},
          hAxis: {title: 'Consultor'},
					title: "Desempeño de consultores",
          seriesType: 'bars',
          series: {1: {type: 'line'}},
			}
			}
		}
	}
</script>