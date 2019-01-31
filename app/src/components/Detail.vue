<template>
	<div>
		<keep-alive>
			<component :is="component">
			</component>
		</keep-alive>
	</div>
</template>

<script>
	import numeral from 'numeral';
	import consultor from './Consultor';
	import grafico from './Grafico';
	import pizza from './Pizza';
	export default {
		props: ['component'],
		components: { consultor, grafico, pizza},
	}
</script>

<style>

</style>