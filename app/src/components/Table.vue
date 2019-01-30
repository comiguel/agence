<template>
	<div>
		<table class="table table-bordered table-hover table-striped">
			<caption class="caption-top">{{consultor}}</caption>
			<thead>
				<tr>
					<th class="text-center" v-for="f in fields">{{f.label}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(value, k) in items.data" :key="k">
					<td>{{k}}</td>
					<td :class="{'text-danger': elem < 0}" v-for="elem in value">R$ {{format(elem, {notation: 'fixed', precision: 2})}}</td>
				</tr>
				<tr class="table-secondary">
					<td><strong>SALDO</strong></td>
					<td :class="{'text-danger': elem < 0, 'text-success': verifyPositive(elem, i) }" v-for="(elem, i) in items.global">R$ {{format(elem, {notation: 'fixed', precision: 2})}}</td>
				</tr>
			</tbody>
		</table>
		<!-- <b-table striped bordered hover :fields="fields" :items="arrayItems" caption-top>
			<template slot="table-caption">{{consultor}}</template>
		</b-table> -->
	</div>
</template>

<script>
	import numeral from 'numeral';
	export default {
		props: {
			items: {type: Object},
			consultor:{type: String},
		},
		data() {
			return {
				fields: [
					{
						key: 'label_date',
						label: 'Período',
					},
					{
						key: 'receita',
						label: 'Receita Líquida',
					},
					{
						key: 'custo_fixo',
						label: 'Custo Fixo',
					},
					{
						key: 'comissao',
						label: 'Comissão',
					},
					{
						key: 'lucro',
						label: 'Lucro',
					},
				],
			}
		},
		methods: {
			format(val, obj) {
				// return math.format(val, {notation: 'fixed', precision: 2})
				return numeral(val).format('R$0,0.00');
			},
			verifyPositive(val, i) {
				if (val > 0 && i == 'lucro') return true;
				return false;
			}
		},
		computed: {
			arrayItems() {
				console.log(this.items);
				var result = [];
				for(const el in this.items) {
					result.push(this.items[el]);
				}
				return result;
			}
		}
	}
</script>

<style scoped>
	caption.caption-top {
		caption-side: top;
	}
</style>