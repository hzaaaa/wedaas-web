/**
 * @description 处理后端返回的菜单
 * @param {Array} originMenuList 原始菜单列表
 * @return array
 */
export function getAuthMenuList(menuList: OriginMenu.OriginMenuOptions[]) {
	let newMenuList: OriginMenu.OriginMenuOptions[] = JSON.parse(JSON.stringify(menuList));
	// console.log(newMenuList);
	return newMenuList.reduce((pre: Menu.MenuOptions[], current: OriginMenu.OriginMenuOptions) => {
		// console.log(current);
		let routerLikeList = <Menu.MenuOptions[]>[...pre];
		// let newItem = <Menu.MenuOptions> {};
		let newItem = <Menu.MenuOptions[]>[];

		if (current.redirect && current.type != 6) {
			let metaVal = <Menu.MetaProps>{
				icon: current.icon,
				title: current.title,
				isHide: current.hidden,
				isAffix: current.affix,
				isKeepAlive: current.keep_alive,
			};
			// ** 处理生成子路由的父路由并添加到额外字段
			if (current.type > 2) {
				let routerSliceArr = current.redirect.split("/").slice(1, 3);

				metaVal.activeMenu = "/" + routerSliceArr.join("/");
			}
			// if (current.icon) {
			//   let routeType = current.icon.split(":");
			//   console.log(routeType);
			//   if (routeType[0] == "reuse" && routeType[1] == "page") {
			//     metaVal.reusable = 1;
			//   } else {
			//     metaVal.reusable = 0;
			//   }
			// }
			if (current.type === 1) {
				newItem = [
					{
						path: `/${current.router}`,
						name: current.router,
						component: current.component ? current.component : "",
						redirect: getRedirect(current.childrenList),
						meta: metaVal,
					},
				];
				// newItem.path = `/${current.router}`;
				// newItem.redirect = current.redirect;
				// newItem.name = current.router;
			} else if (current.type !== 1) {
				//
				newItem = [
					{
						path: current.redirect,
						name: current.router,
						component: current.component,
						meta: metaVal,
						redirect: current.component ? "" : getRedirect(current.childrenList),
					},
				];
				// newItem.path = current.redirect;
				// newItem.component = current.component;
				// newItem.name = current.router;
			}
			// newItem.meta = {
			//   icon: current.icon,
			//   title: current.title,
			//   isHide: current.hidden,
			//   isAffix: current.affix,
			//   isKeepAlive: current.keep_alive,
			// };
			if (current.childrenList?.length) {
				//
				newItem[0].children = getAuthMenuList(current.childrenList);
			}
		}
		// console.log(newItem);
		if (!current.redirect && current.childrenList?.length && current.type === 0) {
			//
			routerLikeList.push(...getAuthMenuList(current.childrenList));
		}
		if (newItem.length) routerLikeList.push(...newItem);
		// console.log(routerLikeList);
		return routerLikeList;
	}, []);
}

const getRedirect = (menuList: OriginMenu.OriginMenuOptions[] = []): string => {
	let redirect = "";
	if (menuList.length) {
		if (menuList[0].redirect) {
			redirect = menuList[0].redirect;
		} else if (menuList[0].childrenList?.length) {
			//
			redirect = getRedirect(menuList[0].childrenList);
		}
	}
	console.log("redirect", redirect);
	return redirect;
};

/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatArr(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.filter((item) => {
		item.children?.length && (item.children = getShowMenuList(item.children));
		return !item.meta?.isHide;
	});
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function isType(val: any) {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], result: { [key: string]: any } = {}, parent = []) => {
	for (const item of menuList) {
		result[item.path] = [...parent, item];
		if (item.children) getAllBreadcrumbList(item.children, result, result[item.path]);
	}
	return result;
};

/**
 * @description 递归找出二级导航列表
 * @param {Array} menuList 所有菜单列表
 * @param {String}  activeTopMenuPath 父路由路径
 * @returns Array
 */

export const getSubMenuList = (menuList: Menu.MenuOptions[], activeTopMenuPath: string) => {
	const subMenuList = menuList.find((item) => item.path == activeTopMenuPath)?.children ?? [];
	return subMenuList;
};

/**
 * @description 图片转base64格式
 * @param {Object} file 文件
 * @returns String
 */

export const ImgToBase64 = (file: any, callBack: Function) => {
	let imgBase64 = "";
	const reader = new FileReader();
	console.log(file);
	if (file) {
		reader.readAsDataURL(file);
	}
	reader.onload = (e) => {
		const code = e.target?.result;
		console.log(code);
		if (code) {
			imgBase64 = code as string;
			callBack(imgBase64);
		}
	};
	// return imgBase64;
};
