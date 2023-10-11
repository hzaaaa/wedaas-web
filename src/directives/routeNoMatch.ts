/**
 permissionList  or 的关系
 */
import { isFunction } from "@/utils/is";
import type { Directive, DirectiveBinding } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AuthStore } from "@/stores/modules/auth";

interface ElType extends HTMLElement {
	__handleClick__: () => any;
}
const unmatch: Directive = {
	mounted(el: ElType, binding: DirectiveBinding) {
		// let timer: NodeJS.Timeout | null = null;
		el.__handleClick__ = function () {
			const authStore = AuthStore();
			const authButtonList = authStore.authButtonListGet;
			try {
				// let 	binding.value();
				let { cb: handler, permissionList } = binding.value;
				const hasPermission = permissionList.some((p: any) => {
					return authButtonList.includes(p);
				});
				// debugger
				if (hasPermission) {
					handler();
				} else {
					ElMessage.error("暂无权限，请联系管理员");
				}
			} catch (error) {
				console.error(error);
				ElMessage.error("暂无权限，请联系管理员");
			}
		};
		el.addEventListener("click", el.__handleClick__);
	},
	beforeUnmount(el: ElType) {
		el.removeEventListener("click", el.__handleClick__);
	},
};

export default unmatch;
