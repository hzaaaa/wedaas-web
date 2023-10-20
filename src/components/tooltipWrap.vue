<template>
	<div v-overflow:[props.type]="true" style="width: 100%">
		<el-tooltip class="box-item" effect="dark" :content="props.content" placement="top-start">
			<div :class="props.type === 'x' ? 'mod-ellipsis' : ''">{{ props.content }}</div>
		</el-tooltip>
		<div class="hold-position is-none" :class="props.type === 'x' ? 'mod-ellipsis' : ''">{{ props.content }}</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
const props = defineProps({
	content: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "x",
	},
});
</script>

<style lang="scss" scoped>
.is-none {
	display: none !important;
}
.mod-ellipsis {
	// width: 100%;
}
</style>
