import { ElMessage } from "element-plus";
/**
 * @description **工具方法** 通用下载
 */
export const downloadByBlob = (filename: string, content: any) => {
	let a = document.createElement("a");
	//解决微软系产品 bom 头引起的中文乱码问题
	// a.href = URL.createObjectURL(new Blob(["\ufeff", content]));
	a.href = URL.createObjectURL(
		new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" })
	);
	// a.href = URL.createObjectURL(new Blob(["\ufeff", content], { type: "application/octet-stream;charset=utf-8" }));
	// a.href = window.URL.createObjectURL(new Blob([content], { type: "application/octet-stream;charset=UTF-8" }));
	// a.href = URL.createObjectURL(new Blob([content]));
	// encodeURIComponent
	filename = decodeURIComponent(filename);
	a.download = filename;
	a.click();
	a.remove();
	window.URL.revokeObjectURL(a.href);
};

export const copyTextToClipboard = (copyContent: string, copyName?: string) => {
	if (navigator.clipboard) {
		// 新api，安全限制较多，https 或 localhost 才可用
		navigator.clipboard.writeText(copyContent);
	} else {
		// 传统api，随时可能会废弃
		const tempInput = document.createElement("input");
		tempInput.setAttribute("value", copyContent);
		document.body.append(tempInput);
		tempInput.select();
		document.execCommand("copy");
		tempInput.remove();
	}
	copyName = copyName || ''
	ElMessage.success(`复制${copyName}成功`);
};

export const bigObj2smallObj = (bigO: any, smallO: any) => {
	let target = <any>{ ...smallO };
	for (let key in target) {
		if (bigO[key] !== null && bigO[key] !== undefined) {
			target[key] = bigO[key];
		}
	}
	return target;
};