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
		
		// debugger
		// 
		if(binding.arg==='y'){
			// debugger
			if(el.children[0].scrollHeight <= el.children[0].clientHeight){
				//无溢出
				el.children[0].classList.add("is-none");
				el.children[1].classList.remove("is-none");
				
			}else{
				//溢出
				
			}
		}else if(binding.arg==='x'){
			
			if(el.children[0].scrollWidth <= el.children[0].clientWidth){
				//无溢出
				// debugger
				el.children[0].classList.add("is-none");
				el.children[1].classList.remove("is-none");
				
			}else{
				 
			}
		}
	},
	beforeUnmount(el: ElType) {
		// el.removeEventListener("click", el.__handleClick__);
	},
};

export default unmatch;
