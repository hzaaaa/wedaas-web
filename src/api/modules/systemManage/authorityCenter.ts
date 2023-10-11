import { SystemManage } from "@/api/interface/index";
import { AUTHPORT, PORTBiz } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 账号管理模块-内部帐号
 */

// * 内部帐号列表
export const getInnerAccountListApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountList) => {
	return http.get<SystemManage.AuthorityCenter.AccountManage.ResInnerAccountList[]>(AUTHPORT + `/auth-user`, params);
};

// * 内部帐号新建
export const addInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountAddition) => {
	return http.post<any>(AUTHPORT + `/auth-user`, params);
};

// * 内部帐号编辑
export const editInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqAccountEdition) => {
	return http.post<any>(AUTHPORT + `/auth-user/edit`, params);
};

// * 内部帐号重置密码
// export const resetPwdInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountPwdReset) => {
// 	return http.post<any>(AUTHPORT+ `/auth-user/pwd/reset`, params);
// }
export const resetPwdInnerAccountApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountPwdReset,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/auth-user/pwd/reset`, params, _config);
};

// * 内部帐号角色权限设置
// export const setInnerAccountRoleApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountRole) => {
// 	return http.post<any>(AUTHPORT + `/auth-user/role`,params);
// }
export const setInnerAccountRoleApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountRole,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/auth-user/role`, params, _config);
};

// * 内部帐号停启用
// export const enableInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountEnable) => {
// 	return http.post<any>(AUTHPORT + `/auth-user/enable`, params);
// }
export const enableInnerAccountApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountEnable,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/auth-user/enable`, params, _config);
};

/**
 * @name 账号管理模块-外部帐号
 */
// * 获取组织列表
export const getOrgListApi = () => {
	return http.get<any>(AUTHPORT + `/organization/list`);
};
// * 外部帐号列表
export const getExternalAccountListApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqExternalAccountList) => {
	return http.get<SystemManage.AuthorityCenter.AccountManage.ResExternalAccountList[]>(AUTHPORT + `/user`, params);
};

// * 外部帐号新建
export const addExternalAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqExternalAccountAddition) => {
	return http.post<any>(AUTHPORT + `/user`, params);
};

// * 外部帐号编辑
export const editExternalAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqAccountEdition) => {
	return http.post<any>(AUTHPORT + `/user/edit`, params);
};

// * 内部帐号重置密码
// export const resetPwdInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountPwdReset) => {
// 	return http.post<any>(AUTHPORT+ `/auth-user/pwd/reset`, params);
// }
export const resetPwdExternalAccountApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountPwdReset,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/user/pwd/reset`, params, _config);
};

// * 内部帐号角色权限设置
// export const setInnerAccountRoleApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountRole) => {
// 	return http.post<any>(AUTHPORT + `/auth-user/role`,params);
// }
export const setExternalAccountRoleApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountRole,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/user/role`, params, _config);
};

// * 内部帐号停启用
// export const enableInnerAccountApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqInnerAccountEnable) => {
// 	return http.post<any>(AUTHPORT + `/auth-user/enable`, params);
// }
export const enableExternalAccountApi = (
	params: SystemManage.AuthorityCenter.AccountManage.ReqAccountEnable,
	_config = { request: "postParams" }
) => {
	return http.post<any>(AUTHPORT + `/user/enable`, params, _config);
};

/**
 * @name 账号管理模块-数据权限
 */

// * 获取用户数据权限api
export const getUserDataPermissionApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqUserDataPermission) => {
	return http.get<SystemManage.AuthorityCenter.AccountManage.ResUserDataPermission[]>(PORTBiz + `/data-permission/user`, params);
};

// * 根据数据类型和类型来获取数据
export const getDataPermissionApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqDataPermission) => {
	return http.get<SystemManage.AuthorityCenter.AccountManage.ResDataPermission>(PORTBiz + `/data-permission`, params);
};

export const editUserDataPermissionApi = (params: SystemManage.AuthorityCenter.AccountManage.ReqUserDataPermissionEdition) => {
	return http.post<any>(PORTBiz + `/data-permission`, params);
};
/**
 * @name 组织管理模块
 */

// * 组织列表api
export const getOrganizationListApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrganizationList) => {
	return http.get<SystemManage.AuthorityCenter.OrganazationManage.ResOrganizationList[]>(AUTHPORT + `/organization`, params);
};

// * 所有绑定组织的合作方api
export const getOrganizationPartnerApi = () => {
	return http.get<any>(AUTHPORT + `/organization/partner/id`);
};
// * 新建组织
export const addOrganizationApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrganizationAddition) => {
	return http.post<any>(AUTHPORT + `/organization`, params);
};
// * 编辑组织
export const editOrganizationApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrganizationEdit) => {
	return http.post<any>(AUTHPORT + `/organization/edit`, params);
};

// * 有效期
export const editOrgExpirationDate = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrgExpirationDate) => {
	return http.post<any>(AUTHPORT + `/organization/expiration-date`, params);
};

// 获取组织IpList
export const getOrgIpListApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrgIpList) => {
	return http.get<SystemManage.AuthorityCenter.OrganazationManage.ResOrgIpList[]>(AUTHPORT + `/organization/ip`, params);
};

// 编辑IpList
export const editOrgIpListApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrgIpListEdition) => {
	return http.post<any>(AUTHPORT + `/organization/ip`, params);
};
// * 删除组织
export const deleteOrganizationApi = (params: SystemManage.AuthorityCenter.OrganazationManage.ReqOrganizationDeletion) => {
	return http.delete<any>(AUTHPORT + `/organization/` + params);
};

/**
 * @name 角色管理模块
 */

// 角色列表
export const getRoleListApi = (params: SystemManage.AuthorityCenter.RoleAuthority.ReqRoleList) => {
	return http.get<SystemManage.AuthorityCenter.RoleAuthority.ResRoleList[]>(AUTHPORT + `/role`, params);
};

// 角色权限树
export const getMenuTreeApi = () => {
	return http.post<SystemManage.AuthorityCenter.Menu.ResMenuTree[]>(AUTHPORT + `/menu/getMenuTree`);
};

// 角色下拉框
export const getRoleSelectorApi = () => {
	return http.get<SystemManage.AuthorityCenter.RoleAuthority.ResRoleSelector>(AUTHPORT + `/role/selector`);
};
// 新建角色
export const addRoleApi = (params: SystemManage.AuthorityCenter.RoleAuthority.ReqRoleAddition) => {
	return http.post<any>(AUTHPORT + `/role`, params);
};
// 编辑角色
export const editRoleApi = (params: SystemManage.AuthorityCenter.RoleAuthority.ReqRoleEdition) => {
	return http.post<any>(AUTHPORT + `/role/edit`, params);
};
// 角色详情
export const getRoleDetailApi = (params: SystemManage.AuthorityCenter.RoleAuthority.ReqRoleDetail) => {
	return http.get<SystemManage.AuthorityCenter.RoleAuthority.ResRoleDetail>(AUTHPORT + `/role/` + params);
};
// 获取角色菜单ID列表
export const getRoleMenuIdListApi = (params: SystemManage.AuthorityCenter.Menu.ReqMenuId) => {
	return http.get<any>(AUTHPORT + `/menu/id`, params);
};
