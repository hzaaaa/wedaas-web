<template>
	<el-main>
		<!-- :key 解决不同路由指向同一组件 切换路由时不刷新的问题 -->
		<router-view :key="route.fullPath"> </router-view>
	</el-main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style lang="scss" scoped>
@import "./index";
</style>
