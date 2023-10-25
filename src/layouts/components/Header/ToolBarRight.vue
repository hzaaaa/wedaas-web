<template>
	<div class="tool-bar-ri">
		<SystemConfig />
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import Avatar from "./components/Avatar.vue";
import SystemConfig from "./components/SystemConfig.vue";
</script>

<style lang="scss" scoped>
.tool-bar-ri {
	display: flex;
	align-items: center;
}
</style>
