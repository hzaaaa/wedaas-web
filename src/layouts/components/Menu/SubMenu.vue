<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children && subItem.children.length > 0" :index="subItem.path">
			<template #title>
				<!-- <el-icon size="12" v-if="subItem.meta.icon">
					<component :is="subItem.meta.icon"></component>
				</el-icon> -->

				<SvgIcon
					:name="iconArr(subItem.meta.icon)[0]"
					v-if="subItem.meta.icon"
					style=""
					:class="[iconArr(subItem.meta.icon).length > 1 ? iconArr(subItem.meta.icon)[1] : '']"
				></SvgIcon>
				<span :class="[subItem.meta.icon ? 'has-icon' : 'no-icon']">{{ subItem.meta.title }}</span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
			<el-icon size="12" v-if="subItem.meta.icon">
				<component :is="subItem.meta.icon"></component>
			</el-icon>
			<template #title>
				<span>{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

let props = defineProps<{ menuList: any }>();
// debugger
const router = useRouter();
const handleClickMenu = (subItem: any) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
	router.push(subItem.path);
};

const iconArr = (metaIcon: string): Array<string> => {
	const newIconArr = metaIcon.split(",");
	console.log(newIconArr);
	return newIconArr;
};
</script>
