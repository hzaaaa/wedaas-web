import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { ElDrawer, ElMessage, ElMessageBox } from "element-plus";
import { uploadPartnerFileApi } from "@/api/biz/collaborators";
export default (fileList: any) => {
	return new Promise((resolve, reject) => {
		let params = new FormData();
		let size = 0;
		fileList.value.forEach((value: any) => {
			params.append("files", value.raw);
			size += value.size;
		});
		let isLt50M = size / 1024 / 1024 < 50;

		if (!isLt50M) {
			reject("新增文件总大小超过了50MB!");
			return;
		}

		if (fileList.value.length === 0) {
			resolve([]);
			return;
		}
		uploadPartnerFileApi(params)
			.then((res: any) => {
				resolve(res.data);
			})
			.catch((e: any) => {
				reject(e);
			});
	});
};
export const validateFile = (file: any, fileList: any) => {
	//过滤
	let isLtWord = file.name.length < 81;
	let isLt5M = file.size / 1024 / 1024 < 5;
	if (!isLtWord) {
		// debugger
		fileList.value = fileList.value.filter((item: any) => {
			return file.uid !== item.uid;
		});
		// debugger
		ElMessage.error("文件名长度不能大于80字!");
	}
	if (!isLt5M) {
		fileList.value = fileList.value.filter((item: any) => {
			return file.uid !== item.uid;
		});

		ElMessage.error("上传单个文件大小不能超过 5MB!");
	}
};
export const validateFileBySize = (file: any, fileList: any, size: any, nameLength: any) => {
	//过滤

	let isLtWord = file.name.length < nameLength + 1;
	// debugger
	let isLt5M = file.size / 1024 / 1024 < size;
	// debugger
	if (!isLtWord) {
		// debugger
		fileList.value = fileList.value.filter((item: any) => {
			return file.uid !== item.uid;
		});
		// debugger
		ElMessage.error(`文件名长度不能大于${nameLength}字!`);
	}
	if (!isLt5M) {
		fileList.value = fileList.value.filter((item: any) => {
			return file.uid !== item.uid;
		});

		ElMessage.error(`上传单个文件大小不能超过 ${size}MB!`);
	}
};
