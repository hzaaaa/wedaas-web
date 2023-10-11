import { App } from "vue";

import throttle from "./throttle";
import permission from "./permission";
import permissionPage from "./permissionPage";
import unmatch from "./routeNoMatch";
import authDisabled from "./authDisabled";

const directivesList: any = {
	// check,
	permission,
	permissionPage,
	// debounce,
	throttle,
	unmatch,
	authDisabled,
};

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach((key) => {
			// 注册所有自定义指令
			app.directive(key, directivesList[key]);
		});
	},
};

export default directives;
