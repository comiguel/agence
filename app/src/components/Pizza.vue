<template>
	<GChart
	type="PieChart"
	:data="percents"
	:options="options"
	/>
</template>

<script>
	// import { Bar, mixins } from 'vue-chartjs';
	import { GChart } from 'vue-google-charts'

	export default {
		components: {
			GChart
		},
		computed: {
			percents() {
				return this.$store.getters.percents;
			},
			options() {
				return {
					width: 1000,
					height: 300,
					// is3D: true,
					title: "Porcentajes de desempeño",
					subtitle: "Sales, Expenses, and Profit: 2014-2017"
			}
			}
		}
	}
</script>