<template>
	<b-navbar toggleable="md" type="dark" variant="primary">
		<b-navbar-toggle target="collapsable"></b-navbar-toggle>
		<b-navbar-brand href="#">
      <img src="../assets/agence.png" alt="Agence">
    </b-navbar-brand>
		<b-collapse is-nav id="collapsable">
			<b-navbar-nav>
				<b-nav-item href="#">Agence</b-nav-item>
				<b-nav-item href="#">Projetos</b-nav-item>
				<b-nav-item href="#">Administrativo</b-nav-item>
				<b-nav-item active href="#">Consultor</b-nav-item>
				<b-nav-item href="#">Comercial</b-nav-item>
				<b-nav-item href="#">Financiero</b-nav-item>
			</b-navbar-nav>

			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<b-nav-item-dropdown right>
					<!-- Using button-content slot -->
					<template slot="button-content">
						<em>Usuário</em>
					</template>
					<b-dropdown-item href="#">Usuário</b-dropdown-item>
					<b-dropdown-item href="#">Salir</b-dropdown-item>
				</b-nav-item-dropdown>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
	export default {
		name: 'navbar',
	}
</script>