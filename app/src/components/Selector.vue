<template>
	<b-form-select :multiple="multi" v-model="selected" :options="data">
  </b-form-select>
<!-- 	<select class="form-control" :multiple="multi" name="consultor" v-model="selected">
	<option v-for="(co_usuario, i) in data" :value="co_usuario" v-text="co_usuario">
	</option>
</select> -->
</template>

<script>
	export default {
		props: ['multi', 'data'],
		data () {
			return {
				selected: [],
			}
		},
	}
</script>

<style scoped>
	font-size: 12px;
</style>