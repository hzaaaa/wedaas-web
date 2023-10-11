/**
 * v-authDisabled
 * 按钮权限指令，无权限时置灰，改变样式
 * 使用：给 Dom 加上 v-permission 及需要的权限列表即可  并且的关系
 * <button v-permission="['library:project']">创建项目</button>
 */
import { AuthStore } from "@/stores/modules/auth";
import type { Directive, DirectiveBinding } from "vue";
interface HTMLElementPlus extends HTMLElement {
	disabled?: boolean;
}
const authDisabled: Directive = {
	mounted(el: HTMLElementPlus, binding: DirectiveBinding) {
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
				// el.setAttribute("aria-disabled", "true");
				el.classList.add("is-disabled");
				// el.style.pointerEvents = "none";
				// console.log(el.nodeName);
				// if(el.nodeName == "BUTTON") el.disabled = true;

				el.setAttribute("disabled", "true");
			}
		} else {
			throw new Error(`使用方式：v-authDisabled="['library:project']"`);
		}
	},
};

export default authDisabled;
