<template>
	<div>
		<el-card header="已选">
			<el-tag v-for="(tag, index) in databaseSelectedList" :key="index" closable @close="handleSelectedRemove(tag)">
				<div class="selected-database-content">
					<el-icon><Coin /></el-icon>
					<div class="content-text">
						<span>{{ tag.name }}</span>
						<span>{{ tag.tableNum }}</span>
					</div>
				</div>
			</el-tag>
		</el-card>
		<el-card class="seletable-card">
			<template #header>
				<div class="card-header">
					<span>未选</span><el-checkbox label="" v-model="checked"></el-checkbox>
					<el-input v-model="value" prefix-icon="search" placeholder=""></el-input>
				</div>
			</template>
			<el-tag v-for="(tag, index) in databaseSelectList" :key="index" class="select-tag">
				<div class="select-database-content">
					<el-icon :size="36"><Coin /></el-icon>
					<div class="content-text">
						<span>{{ tag.name }}</span>
					</div>
				</div>
				<div class="triangle"></div>
				<el-icon class="selected-icon" color="orange"><Select /></el-icon>
			</el-tag>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const checked = ref(false);

const value = ref();

const databaseSelectedList = ref<any>([{ name: "maxwell" }, { name: "hive" }]);

const databaseSelectList = ref<any>([
	{ name: "maxwell" },
	{ name: "hive" },
	{ name: "kafka" },
	{ name: "gmail" },
	{ name: "azkaban" },
	{ name: "dataxweb" },
	{ name: "datax_test" },
]);

const handleSelectedRemove = (tag: any) => {
	const index = databaseSelectedList.value.indexOf(tag);
	databaseSelectedList.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.el-card.seletable-card {
	.el-tag.select-tag {
		position: relative;
		justify-content: flex-start;
		margin: 0 8px 8px 0;
		width: 180px;
		height: 50px;
		background-color: #fff;
		.select-database-content {
			display: flex;
			align-items: center;
			.el-icon {
				width: 36px;
				height: 36px;
			}
			.content-text {
				span {
					font-size: 16px;
				}
			}
		}
		.triangle {
			position: absolute;
			right: 0;
			bottom: 0;
			border-width: 10px;
			border-style: solid;
			border-color: transparent #bfe #bfe transparent;
			width: 0;
			height: 0;
		}
		.el-icon.selected-icon {
			position: absolute;
			right: -2px;
			bottom: 0;
		}
	}
}
</style>
