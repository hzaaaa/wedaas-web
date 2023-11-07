<template>
	<!-- <AdvancedSearchBar /> -->
	<div class="common-layout-system">
		<div class="cards-wrapper">
			<el-scrollbar style="width: 100%; height: 100%">
				<el-card v-for="item in tableDataList" :key="item.id" class="relational-database-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<el-icon color="blue"><Calendar /></el-icon>
							<div>
								<span style="margin-left: 5px">{{ item.tableName }}</span>
								<span style="margin-left: 5px">{{ `表单数：${item.num}个` }}</span>
							</div>
						</div>
					</template>
					<div class="card-info">
						<span>{{ `connection：${item.dataBaseName}` }}</span>
					</div>
					<div class="card-info">
						<span>{{ `添加时间：${item.date}` }}</span>
					</div>
					<div class="card-info footer">
						<div>
							<el-icon><EditPen /></el-icon><span>修改</span>
						</div>

						<div>
							<el-icon><Delete /></el-icon><span>删除</span>
						</div>
					</div>
				</el-card>
			</el-scrollbar>
		</div>

		<div class="pagination-block">
			<el-pagination
				:total="pageParams.total"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				@current-change="handleCurrentPageChange"
				layout="slot,->, prev, pager, next, jumper"
				background
			>
				<span class="pagi-slot">{{ `找到 ${pageParams.total} 结果` }}</span>
			</el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getMySaveListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const viewType = ref("table");
const retrievalPopoverVisible = ref(false);
const input1 = ref("");

const value = ref("");

const options = [
	{
		value: "Option1",
		label: "Option1",
	},
	{
		value: "Option2",
		label: "Option2",
	},
	{
		value: "Option3",
		label: "Option3",
	},
	{
		value: "Option4",
		label: "Option4",
	},
	{
		value: "Option5",
		label: "Option5",
	},
];

const openTableDetailPage = () => {
	router.push({
		name: "tableDetail",
		// state: {
		// 	// params: { ...employeeRow.value },
		// },
		// query: {
		// 	id: row?.id,
		// },
	});
};

const queryFormRaw = {
	// name: "",
};

const beanInfo = {};

let {
	tableLoading,
	pageParams,
	tableDataList,
	handleCurrentPageChange,
	handleSizeChange,
	resetPageToOne,
	refreshData, //刷新按钮

	drawer,
	employeeRow,
	onAddDrawer,
	onEditDrawer,
	searchByQueryForm,
	subData,

	queryForm,
	doReset,
} = useListPageHook(
	// getCompanyListApi,
	getMySaveListApi, //temp test

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
.common-layout-system {
	padding: 0;
	.cards-wrapper {
		display: flex;

		// flex-direction: column;

		// overflow-y: auto;
		flex: 1;
		height: 0;
		:deep(.el-scrollbar) {
			// display: flex;
			// flex: 1;

			// height: 0;
			.el-scrollbar__wrap {
				.el-scrollbar__view {
					display: flex;
					flex-wrap: wrap;
				}
			}
		}
		.relational-database-card.el-card {
			display: flex;
			flex-direction: column;
			margin: 0 15px 15px 0;
			border-radius: 10px;
			width: 240px;
			:deep(.el-card__header) {
				border: none;
				.card-header {
					display: flex;
					align-items: center;
				}
			}
			:deep(.el-card__body) {
				display: flex;
				flex-direction: column;
				flex: 1;
				padding: 0;

				// height: auto;
				.card-info {
					display: flex;
					align-items: center;
					margin-bottom: 10px;
					padding-left: 20px;
					.info-desc {
						overflow: hidden; /* 超出部分隐藏 */
						flex: 1;
						text-overflow: ellipsis; /* 超出部分省略号表示 */
						white-space: nowrap; /* 强制单行显示 */
					}
				}
				.footer {
					justify-content: space-around;
					align-items: center;

					// align-self: ;
					margin-top: auto;
					margin-bottom: 0;
					padding-left: 0;
					border-top: 1px solid #ebeef5;
					height: 50px;
					background-color: #ccc;
				}
			}
		}
	}
}
</style>
