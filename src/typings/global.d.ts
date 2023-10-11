// * Menu
declare namespace Menu {
	interface MenuOptions {
		path: string;
		name: string;
		component?: string | (() => Promise<any>);
		redirect?: string;
		meta: MetaProps;
		children?: MenuOptions[];
	}
	interface MetaProps {
		icon: string;
		title: string;
		activeMenu?: string;
		// isLink?: string;
		isHide: number;
		isFull: boolean;
		isAffix: number;
		isKeepAlive: number;
	}
}

declare namespace OriginMenu {
	// interface OriginMenuOptions {
	// 	id: number;
	// 	name: string;
	// 	pid: number;
	// 	hidden: number;
	// 	path: string;
	// 	component: string;
	// 	icon: string;
	// 	router: string;
	// 	redirect: string;
	// 	childrenList?: OriginMenuOptions[];
	// }
	interface OriginMenuOptions {
		title: string;
		type: number;
		hidden: number;
		component?: string;
		permission?: string;
		router: string;
		icon?: string;
		redirect: string;
		childrenList?: OriginMenuOptions[];
		keep_alive: number;
		affix: number;
	}
}
// * Vite
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
	VITE_API_URL: string;
	VITE_PORT: number;
	VITE_OPEN: boolean;
	VITE_GLOB_APP_TITLE: string;
	VITE_DROP_CONSOLE: boolean;
	VITE_PROXY_URL: string;
	VITE_BUILD_GZIP: boolean;
	VITE_REPORT: boolean;
}
