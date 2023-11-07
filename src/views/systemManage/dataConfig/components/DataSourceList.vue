<template>
	<div class="data-source-wrapper">
		<div class="data-source-catalog">
			<div class="catalog-title">数据源类型</div>
			<el-button link icon="Coin" :class="[activeCatalogBtn == 'all' ? 'is-active' : '']" @click="changeCatalogSelected('all')"
				>All</el-button
			>
			<el-button
				link
				icon="Coin"
				:class="[activeCatalogBtn == 'relation' ? 'is-active' : '']"
				@click="changeCatalogSelected('relation')"
				>关系型数据库</el-button
			>
			<el-button
				link
				icon="WindPower"
				:class="[activeCatalogBtn == 'hadoop' ? 'is-active' : '']"
				@click="changeCatalogSelected('hadoop')"
				>Hadoop连接</el-button
			>
		</div>
		<div class="data-source-list-wrapper">
			<el-input v-model="value" placeholder="请输入数据库名" prefix-icon="search"></el-input>
			<div class="data-source-cards-wrapper">
				<el-scrollbar style="width: 100%; height: 100%">
					<el-card
						v-for="(item, index) in showedDataSourceList"
						:key="index"
						class="data-source-card"
						shadow="hover"
						@click="selectDataSourceType(index)"
						:class="[item.active ? 'is-active' : '']"
					>
						<div class="card-body">
							<SvgIcon :name="item.icon" size="48px"></SvgIcon><span>{{ item.name }}</span>
						</div>
					</el-card>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import mitter from "@/utils/eventBus";

const value = ref("");

const activeCatalogBtn = ref("all");

const hadoopDatabaseChosen = ref(false);
const dataSourceList = ref<any>([
	{ id: 1, icon: "icon-Oracle", name: "Oracle", type: "relation" },
	{ id: 2, icon: "icon-PostgreSQL", name: "PostgreSQL", type: "relation" },
	{ id: 3, icon: "icon-MYSQL8", name: "MYSQL", type: "relation" },
	{ id: 4, icon: "icon-a-Sqlserver", name: "SQL Server", type: "relation" },
	{ id: 5, icon: "icon-Oracle", name: "Oracle for Hadoop", type: "relation", schema: true },
	{ id: 6, icon: "icon-PostgreSQL", name: "PostgreSQL for Hadoop", type: "relation", schema: true },
	{ id: 7, icon: "icon-MYSQL8", name: "MYSQL for Hadoop", type: "relation" },
	{ id: 8, icon: "icon-huawei", name: "MRS for Hadoop", type: "relation", auth: true },
	{ id: 9, icon: "icon-a-SAPHANA", name: "SAP HANA", type: "relation" },
	{ id: 10, icon: "icon-impala", name: "impala", type: "hadoop", auth: true, meta: true },
	{ id: 11, icon: "icon-HiveSQL", name: "hive", type: "hadoop", auth: true, meta: true },
	{ id: 12, icon: "icon-huawei", name: "mrs", type: "hadoop", auth: true, meta: true },
]);

const showedDataSourceList = computed(() => {
	let newShowedDataSourceList =
		activeCatalogBtn.value != "all" ? filterShowedDataSourceList(activeCatalogBtn.value) : dataSourceList.value;

	if (value.value.length > 0) {
		newShowedDataSourceList = newShowedDataSourceList.filter((item: any) => item.name.includes(value.value));
	}
	return newShowedDataSourceList;
});

const filterShowedDataSourceList = (type: string) => {
	return dataSourceList.value.filter((item: any) => item.type == type);
};

const selectDataSourceType = (index: number) => {
	dataSourceList.value.forEach((item: any) => {
		if (Object.prototype.hasOwnProperty.call(item, "active")) {
			delete item["active"];
		}
	});
	if (dataSourceList.value[index]["type"] == "hadoop") {
		hadoopDatabaseChosen.value = true;
	} else {
		hadoopDatabaseChosen.value = false;
	}
	dataSourceList.value[index]["active"] = true;
	mitter.emit("basicInfo-form-database-icon", dataSourceList.value[index]["icon"]);
	mitter.emit("basicInfo-form-schema", dataSourceList.value[index]["schema"]);
	mitter.emit("basicInfo-form-auth", dataSourceList.value[index]["auth"]);
	mitter.emit("basicInfo-form-meta", dataSourceList.value[index]["meta"]);
	// console.log(dataSourceSelectedList.value);
};

const changeCatalogSelected = (catalog: string) => {
	activeCatalogBtn.value = catalog;
};

defineExpose({
	hadoopDatabaseChosen,
});
</script>

<style lang="scss" scoped>
.data-source-wrapper {
	display: flex;
	width: 100%;
	height: 100%;
	.data-source-catalog {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.el-button {
			margin-left: 0;
			&.is-active {
				color: #ff8259;
			}
		}
	}
	.data-source-list-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: auto;
		.data-source-cards-wrapper {
			display: flex;

			// flex-direction: column;
			flex: 1;
			height: 0;
			:deep(.el-scrollbar) {
				.el-scrollbar__wrap {
					.el-scrollbar__view {
						display: flex;
						flex-wrap: wrap;
						.el-card.data-source-card {
							margin: 4px;
							width: 151px;
							height: 121px;
							.el-card__body {
								padding: 0;
								width: 100%;
								height: 100%;
								.card-body {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									width: 100%;
									height: 100%;
									span {
										margin-top: 4px;
										font-weight: 400;
										font-size: 12px;
									}
								}
							}
							&.is-active {
								background-color: rgb(255 130 89 / 10%);
								span {
									color: #ff8259;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
