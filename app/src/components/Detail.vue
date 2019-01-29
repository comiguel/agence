<template>
	<div>
		<consultor v-if="component==='consultor'"></consultor>
	</div>
</template>

<script>
	import consultor from './Consultor';
	export default {
		props: ['component'],
		components: { consultor },
		data() {
			return {
				
			}
		}
	}
</script>

<style>
	
</style>