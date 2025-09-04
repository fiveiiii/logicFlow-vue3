<script setup lang="ts">
import LogicFlow from "./logicFlow/index.vue";
</script>

<template>
	<div class="flow">
		<LogicFlow />
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.flow {
	height: calc(100vh - 50px);
	overflow: hidden;
}
</style>
