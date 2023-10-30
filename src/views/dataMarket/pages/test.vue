<template>
	<el-upload
		v-model:file-list="fileList"
		class="upload-demo"
		action="http://localhost:3000/cats/upload"
		multiple
		:on-preview="handlePreview"
		:on-remove="handleRemove"
		:before-remove="beforeRemove"
		:limit="3"
		:on-exceed="handleExceed"
	>
		<el-button type="primary">Click to upload</el-button>
		<template #tip>
			<div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
		</template>
	</el-upload>
	<a href="http://localhost:3000/cats/file">download</a>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

import type { UploadProps, UploadUserFile } from "element-plus";

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
	console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
	console.log(uploadFile);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
	ElMessage.warning(
		`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`
	);
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
	return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
		() => true,
		() => false
	);
};

// axios
// 	.get("http://localhost:3000/cats/image", {
// 		headers: {
// 			Range: "bytes=0-400000",
// 		},
// 	})
// 	.then((res: any) => {
// 		console.log(res.data);
// 	})
// 	.catch((err: any) => {
// 		console.log(err);
// 	});
// axios
// 	.get("http://localhost:3000/cats/image", {
// 		headers: {
// 			Range: "bytes=1000001-",
// 		},
// 	})
// 	.then((res: any) => {
// 		console.log(res.data);
// 	})
// 	.catch((err: any) => {
// 		console.log(err);
// 	});
axios
	.get("http://localhost:3000/cats/text", {
		headers: {
			Range: "bytes=0-4",
		},
	})
	.then((res: any) => {
		console.log(res.data);
	})
	.catch((err: any) => {
		console.log(err);
	});

const p1 = new Promise((resolve, reject) => {
	axios
		.get("http://localhost:3000/cats/image", {
			headers: {
				Range: "bytes=0-300000",
			},
			responseType: "arraybuffer",
		})
		.then((res) => {
			resolve(res.data);
		})
		.catch((err) => {
			reject(err);
		});
});

const p2 = new Promise((resolve, reject) => {
	axios
		.get("http://localhost:3000/cats/image", {
			headers: {
				Range: "bytes=300001-",
			},
			responseType: "arraybuffer",
		})
		.then((res) => {
			resolve(res.data);
		})
		.catch((err) => {
			reject(err);
		});
});

Promise.all([p1, p2]).then((res) => {
	const [buffer1, buffer2] = <any>res;

	const arr = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

	const arr1 = new Uint8Array(buffer1);
	arr.set(arr1, 0);

	const arr2 = new Uint8Array(buffer2);
	arr.set(arr2, arr1.byteLength);

	console.log(arr.buffer);

	const blob = new Blob([arr.buffer]);
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = "image.png";
	document.body.appendChild(link);
	link.click();
	// link.addEventListener("click", () => {
	link.remove();
	// });
});
</script>
