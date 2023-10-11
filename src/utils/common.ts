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
