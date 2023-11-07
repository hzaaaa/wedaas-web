<template>
	<div class="basic-info-wrapper">
		<el-form :model="props.submitForm">
			<el-form-item label="群组">
				<el-input v-model="props.submitForm.name" placeholder=""></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="props.submitForm.desc" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<slot name="operate-btn"></slot>
	</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

let props = defineProps(["submitForm"]);

// const submitForm = reactive({
// 	name: "",
// 	desc: "",
// });
</script>

<style lang="scss" scoped></style>
