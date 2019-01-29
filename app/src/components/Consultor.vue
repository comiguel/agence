<template>
	<div>
		<table-consultor v-for="(el, k) in items" :consultor="k" :items="el"></table-consultor>
	</div>
</template>

<script>
	import tableConsultor from './Table';
	export default {
		components: { tableConsultor },
		data() {
			return {

			}
		},
		computed: {
			items() {
				return this.$store.state.processedData;
			}
		}
	}
</script>

<style>
	
</style>