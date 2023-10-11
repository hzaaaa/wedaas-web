export interface GlobalState {
	token: string;
	// manualLogout: boolean;
}

export interface AuthState {
	// routeName: string;
	authOriginMenuList: OriginMenu.OriginMenuOptions[];
	authMenuList: Menu.MenuOptions[];
	showAuthMenuList: Menu.MenuOptions[];
	activeTopMenuPath: string;
}

export interface UserState {
	id: number | null;
	token: string;
	userInfo: any;
	roleInfo: Object | null;
	deptInfo: string | null;
	companyInfo: string | null;
	companyId: number | null;
	username: string;
	// 用户操作
	behavior: string;
}
