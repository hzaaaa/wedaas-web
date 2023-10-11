/**
 * v-permissionPage
 * 按钮权限指令，无权限时不显示按钮
 * 使用：给 Dom 加上 v-permissionPage 及需要的权限列表即可  并且的关系
 * <button v-permissionPage="[{permission:['library:project'],currentPage:true}]">创建项目</button>
 */
import { AuthStore } from "@/stores/modules/auth";
import type { Directive, DirectiveBinding } from "vue";

const permissionPage: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { value: bigArr } = binding;
		const authStore = AuthStore();
		const authButtonList = authStore.authButtonListGet;
		if (bigArr && Array.isArray(bigArr) && bigArr.length) {
			let obj = bigArr.find((item: any) => {
				return item.currentPage === true;
			});
			if (obj) {
				let value = obj.permission;
				if (value && Array.isArray(value) && value.length) {
					const hasPermission = value.some((p) => {
						return authButtonList.includes(p);
					});
					console.log("hasPermission", hasPermission);
					// 权限不满足时的操作
					if (!hasPermission) {
						// ElMessage.error("暂无权限，请联系管理员添加");
						el.remove();
					}
				} else {
					throw new Error(`使用方式：v-permissionPage="[{permission:['library:project'],currentPage:true}]"`);
				}
			} else {
				throw new Error(`使用方式：v-permissionPage="[{permission:['library:project'],currentPage:true}]"`);
			}
		} else {
			throw new Error(`使用方式：v-permissionPage="[{permission:['library:project'],currentPage:true}]"`);
		}
	},
};

export default permissionPage;
