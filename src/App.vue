<script setup lang="ts">
import LogicFlow from "./logicFlow/index.vue";
</script>

<template>
	<div class="flow">
		<LogicFlow />
	</div>
</template>

<style scoped>
.flow {
	height: calc(100vh - 50px);
	overflow: hidden;
}
</style>
