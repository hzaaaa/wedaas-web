/**
 * v-permission
 * 按钮权限指令，无权限时不显示按钮
 * 使用：给 Dom 加上 v-permission 及需要的权限列表即可  并且的关系
 * <button v-permission="['library:project']">创建项目</button>
 */
import { AuthStore } from "@/stores/modules/auth";
import type { Directive, DirectiveBinding } from "vue";

const permission: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { value } = binding;
		const authStore = AuthStore();
		const authButtonList = authStore.authButtonListGet;
		if (value && Array.isArray(value) && value.length) {
			const hasPermission = value.every((p) => {
				return authButtonList.includes(p);
			});
			console.log("hasPermission", hasPermission);
			// 权限不满足时的操作
			if (!hasPermission) {
				// ElMessage.error("暂无权限，请联系管理员添加");
				el.remove();
			}
		} else {
			throw new Error(`使用方式：v-permission="['library:project']"`);
		}
	},
};

export default permission;
