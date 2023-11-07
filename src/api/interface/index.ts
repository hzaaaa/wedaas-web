// * 请求响应参数（不包含data）
export interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
	data: T;
}
// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
		type: number;
		captchaId: string;
		code: string;
	}

	export interface ResLogin {
		token: string;
		[key: string]: any;
	}
	// * 检测用户ip

	export interface ResOrgIpCheck {
		username: string;
	}
}

export namespace Captcha {
	export interface ResCaptcha {
		captchaId: string;
		img: string;
	}
}

export namespace TableMock {
	export interface ResBasicTableData {
		pageNum: number;
		pageSize: number;
		total: number;
		list: ResBasicTableList[];
	}
	export interface ResBasicTableList {
		time: string;
		name: string;
		address: string;
		word1: string;
		word2: string;
	}
}

// export namespace User {
// 	export interface ReqAvatarEdition {
// 		url: string;
// 	}

// 	export interface ReqPwdEditon {
// 		oldPwd: string;
// 		newPwd: string;
// 	}
// }

// * 系统管理
export namespace SystemManage {
	// * 权限中心
	export namespace AuthorityCenter {
		// * 账号管理
		export namespace AccountManage {
			// * 内部帐号列表
			export interface ReqInnerAccountList {
				pageNum: number;
				pageSize: number;
			}

			export interface ResInnerAccountList {
				id: number;
				username: string;
				nickName: string;
				phone: string;
				email: string;
				roleId: string;
				roleName: string;
				remark: string;
				enabled: number;
			}

			// * 新建内部帐号
			export interface ReqInnerAccountAddition {
				username: string;
				nickName: string;
				phone: string;
				email: string;
				roleId: number;
				password: string;
				enabled: string;
				remark: string;
			}

			// * 内外部帐号编辑
			export interface ReqAccountEdition {
				id: number;
				username: string;
				nickName: string;
				phone: string;
				email: string;
				remark: string;
			}

			// * 内外部帐号重置密码
			export interface ReqAccountPwdReset {
				userId: number;
			}

			// * 内外部帐号-角色权限编辑

			export interface ReqAccountRole {
				userId: number;
				roleId: number;
			}

			// * 内外部帐号停用/启用
			export interface ReqAccountEnable {
				userId: number;
				enabled: number;
			}

			// ** 外部帐号
			// 获取组织列表

			// 外部帐号列表
			export interface ReqExternalAccountList {
				organizationId: number;
				pageNum: number;
				pageSize: number;
			}

			export interface ResExternalAccountList {
				id: number;
				username: string;
				nickName: string;
				phone: string;
				email: string;
				roleId: string;
				roleName: string;
				remark: string;
				enabled: number;
			}
			// 新建外部帐号
			export interface ReqExternalAccountAddition {
				organizationId: number;
				username: string;
				nickName: string;
				phone: string;
				email: string;
				roleId: number;
				password: string;
				enabled: string;
				remark: string;
			}

			// 获取用户数据权限
			export interface ReqUserDataPermission {
				userId?: number;
			}

			export interface ResUserDataPermission {
				dataType: number;
				list: List[];
			}

			interface List {
				type: number;
				dataList: DataList[];
			}

			interface DataList {
				dataId: number;
				dataName: string;
			}

			// 根据数据类型和类型来获取数据

			export interface ReqDataPermission {
				dataType: number;
				type: number;
			}

			export interface ResDataPermission {
				dataId: number;
				dataName: string;
			}

			// 编辑用户数据权限
			export interface ReqUserDataPermissionEdition {
				userId: number;
				list: UserDataPermissionEditionList[];
			}

			interface UserDataPermissionEditionList {
				dataType: number;
				dataIdList: Array<number>;
			}
		}
		// * 组织管理
		export namespace OrganazationManage {
			export interface ReqOrganizationList {
				name: string;
				pageNum: number;
				pageSize: number;
			}
			export interface ResOrganizationList {
				id: number;
				name: string;
				partnerId: number;
				partnerName: string;
				description: string;
				expirationTime: string;
				ipList: string;
				createBy: string;
				updateDate: string;
			}

			// * 新建组织
			export interface ReqOrganizationAddition {
				name: string;
				partnerId: number;
				partnerName: string;
				// accessId: string;
				description: string;
				expirationStart: string;
				expirationEnd: string;
				ipList: ipListProps[];
			}

			interface ipListProps {
				ip: string;
				remark: string;
			}

			// * 编辑组织
			export interface ReqOrganizationEdit {
				organizationId: number;
				name: string;
				partnerId: number;
				description: string;
			}

			// * 有效期
			export interface ReqOrgExpirationDate {
				organizationId: number;
				expirationStart: string;
				expirationEnd: string;
			}
			// ipList
			export interface ReqOrgIpList {
				organizationId: number;
			}
			export interface ResOrgIpList {
				ip: string;
				remark: string;
			}

			// ip编辑
			export interface ReqOrgIpListEdition {
				organizationId: number;
				list: ipListProps[];
			}

			// 删除组织
			export interface ReqOrganizationDeletion {
				organizationId: number;
			}
		}

		// 角色权限
		export namespace RoleAuthority {
			// 角色列表
			export interface ReqRoleList {
				name: string;
				pageNum: number;
				pageSize: number;
			}
			export interface ResRoleList {
				id: number;
				name: string;
				description: string;
				createBy: string;
				updateTime: string;
			}
			// 角色下拉框
			export interface ReqRoleSelector {
				roleName?: string;
			}

			export interface ResRoleSelector {
				id: number;
				name: string;
			}

			// 新建角色
			export interface ReqRoleAddition {
				name: string;
				description?: string;
				menuIdList: Array<number>;
			}

			// 编辑角色
			export interface ReqRoleEdition {
				id: number;
				name: string;
				description?: string;
				menuIdList: Array<number>;
			}

			// 角色详情
			export interface ReqRoleDetail {
				roleId: number;
			}

			export interface ResRoleDetail {
				name: string;
				description: string;
				createBy: string;
				updateTime: string;
				menuList: Array<number>;
			}
		}

		// 菜单
		export namespace Menu {
			// 当前角色权限树

			export interface ResMenuTree {
				name: string;
				id: number;
				hidden: number;
				permission: string;
				type: number;
				redirect: string;
				childrenList?: ResMenuTree[];
			}

			// 获取角色的菜单id
			export interface ReqMenuId {
				roleId?: number;
			}
		}
	}
}

// * API管理模块
//
export namespace APIManage {
	// * 输出API
	export namespace ExportAPI {
		// * 输出API-测试API
		export namespace TestAPI {
			// * API列表
			export interface ReqExportTestAPIList {
				apiName: string;
				partnerIds: string;
				enable: number;
				sorts: Array<String>;
				currentPage: string;
				pageSize: number;
			}

			export interface ResExportTestAPIList {
				apiName: string;
				createTime: string;
				createUser: string;
				description: string;
				enable: number;
				id: number;
				partnerId: number;
				partnerName: string;
				type: number;
				updateTime: string;
				updateUser: string;
			}

			// * 新增API
			export interface ReqExportTestAPIAddition {
				apiOutputConfAddForm: APIOutputConAddForm[];
				frequencyConfForm?: FrequencyConfForm[];
				priceConfForm?: PriceConfForm[];
			}

			interface APIOutputConAddForm {
				id?: number;
				partnerId: number;
				accessId: string;
				sourceCode: string;
				description?: string;
				standardization: number;
				securityStrategy?: string;
				checkSign?: number;
				requestDecrypt?: number;
				responseEncrypt?: number;
				responseDataFilter?: string;
			}

			interface FrequencyConfForm {
				totalAmount?: number;
				ip?: string;
				qps?: number;
				qpm?: number;
				qpd?: number;
			}

			interface PriceConfForm {
				chargeType?: string;
				priceMode?: string;
				priceType?: string;
				price?: string;
			}

			// 编辑API
			export interface ReqExportTestAPIEdition {
				apiOutputConfAddForm: APIOutputConAddForm[];
				frequencyConfForm?: FrequencyConfForm[];
				priceConfForm?: PriceConfForm[];
			}

			// API详情
			export interface ReqExportTestAPIInfo {
				id: number;
			}

			export interface ResExportTestAPIInfo {
				apiOutputConfInfoVo: ApiOutputConfInfoVo;
				frequencyConfInfoVo: FrequencyConfInfoVo;
				priceConfInfoVo: PriceConfInfoVo;
			}

			interface ApiOutputConfInfoVo {
				id: number;
				partnerId: number;
				accessId: string;
				partnerName: string;
				sourceCode: string;
				name: string;
				description: string;
				standardization: number;
				securityStrategy: string;
				checkSign: number;
				requestDecrypt: number;
				responseEncrypt: number;
				responseDataFilter: string;
				type: number;
				securityStrategyName: number;
			}

			interface FrequencyConfInfoVo {
				id: number;
				totalAmount: number;
				qps: number;
				qpm: number;
				qpd: number;
			}

			interface PriceConfInfoVo {
				chargeType: string;
				priceMode: string;
				priceType: string;
				price: string;
			}

			// 启用停用API
			export interface ReqExportTestAPIStatusUpdate {
				id: number;
				enable: number;
			}
			// 删除API
			export interface ReqExportTestAPIDeletion {
				id: number;
			}
			// 版本记录列表
			export interface ReqExportTestVersionRecordList {
				outputId: number;
				sorts?: Array<string>;
				currentPage?: number;
				pageSize?: number;
			}

			export interface ResExportTestVersionRecordList {
				outputId: number;
				apiType: number;
				finishTime: string;
				id: number;
				params: string;
				userName: string;
				currentVersion: boolean;
			}

			// 版本记录详情
			export interface ReqExportTestVersionRecordInfo {
				id: number;
			}
			export interface ResExportTestVersionRecordInfo {
				outputId: number;
				apiType: number;
				finishTime: string;
				id: number;
				params: string;
				userName: string;
			}

			// 日志
			export interface ReqExportTestLogList {
				sourceCode: string;
				accessId: string;
				startTime: string;
				endTime: string;
				currentPage: number;
				pageSize: number;
			}

			export interface ResExportTestLogList {
				partnerName: string;
				accessId: string;
				sourceCode: string;
				isSuccess: number;
				costTime: string;
				createTime: string;
			}
		}

		// * 输出API-正式API
		export namespace OfficialAPI {
			// * API列表
			export interface ReqExportOfficialAPIList {
				apiName: string;
				partnerIds: string;
				enable: number;
				sorts: Array<String>;
				currentPage: string;
				pageSize: number;
			}

			export interface ResExportOfficialAPIList {
				apiName: string;
				createTime: string;
				createUser: string;
				description: string;
				enable: number;
				id: number;
				partnerId: number;
				partnerName: string;
				type: number;
				updateTime: string;
				updateUser: string;
			}

			// * 新增API
			export interface ReqExportOfficialAPIAddition {
				apiOutputConfAddForm: APIOutputConAddForm[];
				frequencyConfForm?: FrequencyConfForm[];
				priceConfForm?: PriceConfForm[];
			}

			interface APIOutputConAddForm {
				id?: number;
				partnerId: number;
				accessId: string;
				sourceCode: string;
				description?: string;
				standardization: number;
				securityStrategy?: string;
				checkSign?: number;
				requestDecrypt?: number;
				responseEncrypt?: number;
				responseDataFilter?: string;
			}

			interface FrequencyConfForm {
				totalAmount?: number;
				ip?: string;
				qps?: number;
				qpm?: number;
				qpd?: number;
			}

			interface PriceConfForm {
				chargeType?: string;
				priceMode?: string;
				priceType?: string;
				price?: string;
			}

			// 编辑API
			export interface ReqExportOfficialAPIEdition {
				apiOutputConfAddForm: APIOutputConAddForm[];
				frequencyConfForm?: FrequencyConfForm[];
				priceConfForm?: PriceConfForm[];
			}

			// API详情
			export interface ReqExportOfficialAPIInfo {
				id: number;
			}

			export interface ResExportOfficialAPIInfo {
				apiOutputConfInfoVo: ApiOutputConfInfoVo;
				frequencyConfInfoVo: FrequencyConfInfoVo;
				priceConfInfoVo: PriceConfInfoVo;
			}

			interface ApiOutputConfInfoVo {
				id: number;
				partnerId: number;
				accessId: string;
				partnerName: string;
				sourceCode: string;
				name: string;
				description: string;
				standardization: number;
				securityStrategy: string;
				checkSign: number;
				requestDecrypt: number;
				responseEncrypt: number;
				responseDataFilter: string;
				type: number;
				securityStrategyName: number;
			}

			interface FrequencyConfInfoVo {
				id: number;
				totalAmount: number;
				qps: number;
				qpm: number;
				qpd: number;
			}

			interface PriceConfInfoVo {
				chargeType: string;
				priceMode: string;
				priceType: string;
				price: string;
			}

			// 启用停用API
			export interface ReqExportOfficialAPIStatusUpdate {
				id: number;
				enable: number;
			}
			// 删除API
			export interface ReqExportOfficialAPIDeletion {
				id: number;
			}
			// 版本记录列表
			export interface ReqExportOfficialVersionRecordList {
				outputId: number;
				sorts?: Array<string>;
				currentPage?: number;
				pageSize?: number;
			}

			export interface ResExportOfficialVersionRecordList {
				outputId: number;
				apiType: number;
				finishTime: string;
				id: number;
				params: string;
				userName: string;
				currentVersion: boolean;
			}

			// 版本记录详情
			export interface ReqExportOfficialVersionRecordInfo {
				id: number;
			}
			export interface ResExportOfficialVersionRecordInfo {
				outputId: number;
				apiType: number;
				finishTime: string;
				id: number;
				params: string;
				userName: string;
			}

			// 日志
			export interface ReqExportOfficialLogList {
				sourceCode: string;
				accessId: string;
				startTime: string;
				endTime: string;
				currentPage: number;
				pageSize: number;
			}

			export interface ResExportOfficialLogList {
				partnerName: string;
				accessId: string;
				sourceCode: string;
				isSuccess: number;
				costTime: string;
				createTime: string;
			}

			// 费用列表
			export interface ReqChargeList {
				sourceCode: string;
				accessId: string;
				startTime: string;
				endTime: string;
				currentPage: number;
				pageSize: number;
			}

			export interface ResChargeList {
				sourceCode: string;
				accessId: string;
				total: number;
				success: number;
				cost: string;
				apiInputChargeVo: ApiInputChargeVo[];
			}

			interface ApiInputChargeVo {
				total: number;
				success: number;
				unitPrice: number;
				dt: string;
			}
			// 费用列表文件输出
			export interface ReqChargeListExport {
				sourceCode: string;
				accessId: string;
				startTime: string;
				endTime: string;
			}
		}
		// 安全策略
		export interface ResSecurityStrategyList {
			id: number;
			strategyName: string;
			strategyType: string;
		}
		// 计费字典列表
		export interface ReqChargingDictList {
			type: string;
		}

		export interface ResChargingDictList {
			baseCode: string;
			baseValue: string;
		}

		// 单价设置（下拉框）
		export interface ResChargingPriceTypeList {
			id: number;
			priceName: string;
			priceType: string;
		}
	}
}

// 数据资产管理
export namespace DataAssetsManage {
	export namespace AccessData {
		// export interface ReqAccessTestDataEnbaleList {
		// 	apiType: number | null;
		// }

		export interface ResAccessTestDataEnbaleList {
			id: number;
			name: string;
			status: number;
			type: number;
		}

		export interface ResAccessOfficialDataEnbaleList {
			id: number;
			name: string;
			status: number;
			type: number;
		}
	}
}

//#region
// * 数据服务平台
export namespace AdvancedSearch {
	export namespace SearchFilter {
		// 数据源选择框列表
		export interface ResDataSourceNameList {
			dsName: string;
			metastoreId: string;
			metastoreType: number;
			type: string;
		}

		// 数据库选择框列表
		export interface ReqDatabaseList {
			dsName: string;
			metastoreType: number;
		}

		export interface ResDatabaseList {
			a: string;
			b: string;
			c: string;
			d: string;
			e: string;
		}

		// 数据目录列表
		export interface ResCatalogList {
			a: number;
			b: string;
		}

		// 数据标签列表
		export interface ResLabelList {
			a: number;
			b: string;
		}
	}

	// 列表
	export interface ReqAdvancedSearchList {
		catalog_root_id: number;
		database_id: string;
		term: string;
		tags_id: string;
	}

	export interface ResAdvancedSearchList {
		data_list: Array<AdvancedSearchListDataList>;
		total_count: number;
	}

	interface AdvancedSearchListDataList {
		tn: string;
		sc: string;
		td: string;
		ds: string;
		ct: string;
		bf: number;
		ti: string;
	}
}

export namespace TableInfo {
	// 列表详情
	export interface ReqTableInfo {
		tableId: string;
	}

	// 属性编辑
	export interface ReqTableInfoUpdate {
		tableDesp: string;
		businessDefine: string;
		comment: string;
		itOwner: string;
		tag: string;
		tableId: string;
		businessDepartment: string;
		labelList: Array<any>;
	}

	// 标签添加

	export interface ReqLabelAddition {
		label: string;
		table_list: string;
	}
}

export namespace User {
	// 获取用户信息
	export interface ReqUserInfo {
		id: number;
	}
	// 关注列表
	export interface ReqUserFavorInfoList {
		id: number;
	}

	export interface ResUserFavorInfoList {
		tableId: string;
		tableName: string;
	}

	// 添加关注

	export interface ReqFavoriteAddition {
		tableid: string;
		tablename: string;
		userid: string;
		username: string;
	}

	// 取消关注
	export interface ReqFavoriteDeletion {
		tableId: string;
		userId: string;
	}
}
//#endregion
