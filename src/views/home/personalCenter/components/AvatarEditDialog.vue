<template>
	<el-dialog
		v-model="dialogVisible"
		title="编辑头像"
		@close="closedDialog"
		class="avatar-edit-dialog"
		width="640px"
		style="height: 530px"
	>
		<div class="avatar-upload">
			<el-upload
				drag
				v-loading="avatarImgLoading"
				element-loading-text="头像上传中..."
				element-loading-background="rgba(0, 0, 0, 0.8)"
				action="#"
				:http-request="(params: any) => uploadImg(params)"
				ref="avatarImgUpload"
				id="avatar-img-uploader"
				:show-file-list="false"
				:file-list="avatarImgFileList"
				:accept="elUploadAvatarProps.accept"
				:multiple="elUploadAvatarProps.multiple"
				:before-upload="(rawFile: UploadRawFile) => handleBeforeImgUpload(rawFile)"
				:on-exceed="handleImgUploadExceed"
				:on-success="(res: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {handleImgUploadSuccess(avatarUploadRes,uploadFile,uploadFiles)}"
				class="avator-uploader"
			>
				<template v-if="avatarImg">
					<img :src="avatarImg" class="avatar-img" @click.stop />
					<!-- <div class="upload-handle" @click.stop> -->
					<!-- <div class="handle-icon" @click="editImg('idcard-front-uploader')" v-if="!self_disabled">
                    <el-icon><Edit /></el-icon>
                    <span>编辑</span>

                  </div> -->
					<!-- <div class="handle-icon" @click="imgViewVisible = true">
                    <el-icon><ZoomIn /></el-icon>
                    <span>查看</span>
                  </div> -->
					<!-- <div class="handle-icon" @click="reuploadAvatar('avatar-img-uploader')">
							<el-icon><DocumentAdd /></el-icon>
							<span>重新识别</span>
						</div> -->
					<!-- </div> -->
				</template>
				<template v-else>
					<el-icon class="upload-icon"><CirclePlus /></el-icon>
					<div class="el-upload__text"><span>点击上传</span><span>支持jpg、png格式的图片，大小不超过5M</span></div></template
				>
			</el-upload>

			<div class="avator-preview">
				<el-avatar :size="174" :src="avatarImg ? avatarImg : defaultAvatarImg" fit="scale-down"></el-avatar>
				<span>头像预览</span>
			</div>
		</div>
		<el-button type="warning" @click="reuploadAvatar('avatar-img-uploader')" link>重新上传</el-button>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="editAvatar">确定</el-button>
			<!-- <el-button type="primary" @click="check">check</el-button> -->
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { UploadFile, UploadRawFile, UploadUserFile, genFileId } from "element-plus";
import type { UploadInstance, UploadFiles } from "element-plus";
import { ImgToBase64 } from "@/utils/util";
import defaultAvatarImg from "@/assets/images/basicInfo/default_avatar.png";
import { useUserStore } from "@/stores/user";
import { postAvatarUploadApi, postAvatarEditionApi } from "@/api/modules/user/userCenter";

const userStore = useUserStore();
const dialogVisible = ref(false);
interface DialogProps {
	title?: string;
	id?: number;
	imgUrl?: string;
	api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({});

const acceptParams = (params: DialogProps) => {
	dialogProps.value = params;
	dialogVisible.value = true;
};

interface avatarUploadProps {
	limit: number;
	accept: string;
	disabled: boolean;
	multiple: boolean;
	fileType: string;
}

const elUploadAvatarProps = <avatarUploadProps>{
	limit: 1,
	accept: "image/png,image/jpg",
	disabled: false,
	fileType: "img",
	multiple: false,
};

const avatarImgUpload = ref<UploadInstance>();
const avatarImgFileList = ref<UploadFile[]>([]);
const avatarImg = ref("");
const avatarImgLoading = ref(false);
const imgWhiteList = ["jpg", "png"];
const avatarUploadSuccessUrl = ref("");
const avatarUploadRes = ref();

// 头像上传前钩子
const handleBeforeImgUpload = (file: UploadRawFile) => {
	console.log(file);
	const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
	const isNotImg = imgWhiteList.indexOf(fileSuffix) === -1;
	if (isNotImg) {
		// ElNotification({
		// 	title: "温馨提示",
		// 	message: "上传文件只能是 .jpg .png 格式!",
		// 	type: "warning",
		// });
		ElMessage.warning("上传文件只能是 .jpg .png 格式!");
	}
	const is5M = file.size && file.size / 1024 / 1024 <= 5;
	console.log(is5M);
	if (!is5M) {
		setTimeout(() => {
			// ElNotification({
			// 	title: "温馨提示",
			// 	message: "上传图片大小不能超过5M!",
			// 	type: "warning",
			// });
			ElMessage.warning("上传图片大小不能超过5M!");
		}, 0);
	}
	if (!isNotImg && is5M) {
		ImgToBase64(file, (res: any) => {
			console.log(res);
			avatarImg.value = res;
		});
		avatarImgLoading.value = true;
	}
};

// 上传img
const uploadImg = async (params: any) => {
	try {
		const formData = new FormData();

		formData.append("file", params.file);
		console.log(params);
		const res = await postAvatarUploadApi(formData);
		avatarUploadRes.value = res;
	} catch (err) {
		console.log(err);
		// ElNotification({
		//   title: "上传失败",
		//   message: "OCR上传失败！",
		//   type: "error",
		// });
	} finally {
		avatarImgLoading.value = false;
	}
};

const handleImgUploadSuccess = (res: any, file: UploadFile, uploadFiles: UploadFiles) => {
	console.log("success>>>>", file);
	console.log("success>>>>", uploadFiles);
	console.log("success>>>>", res);
	if (!res || res.code != "200") {
		console.log("上传失败》〉》〉》");

		avatarImgUpload.value!.clearFiles();

		deleteImg();
		// ElNotification({
		//   title: "识别失败",
		//   message: "OCR识别失败！",
		//   type: "error",
		// });
		// ElNotification({
		// 	title: "上传失败",
		// 	message: "头像上传失败！",
		// 	type: "error",
		// });
		ElMessage.error("头像上传失败！");
		avatarImgLoading.value = false;
		return;
	}
	avatarUploadSuccessUrl.value = res.data;
	avatarImgFileList.value.push(file);

	// ElNotification({
	// 	title: "操作成功",
	// 	message: "头像上传成功！",
	// 	type: "success",
	// });
	ElMessage.success("头像上传成功！");
	avatarImgLoading.value = false;
};

// 超出限制调用钩子
const handleImgUploadExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
	console.log("exceed>>>>", files);
	console.log("exceed>>>>", uploadFiles);

	// deleteImg(uploadType);
	avatarImgUpload.value!.clearFiles();
	const file = files[0] as UploadRawFile;
	file.uid = genFileId();
	avatarImgUpload.value!.handleStart(file);
	avatarImgUpload.value!.submit();
};

// upload重新上传
const reuploadAvatar = (uploader: string) => {
	const dom = document.querySelector(`#${uploader} .el-upload__input`);
	dom && dom.dispatchEvent(new MouseEvent("click"));
};

// upload删除图片
const deleteImg = () => {
	avatarImgFileList.value.pop();
	avatarImg.value = "";
	avatarUploadSuccessUrl.value = "";
};

// 修改img
const editAvatar = async () => {
	if (avatarUploadSuccessUrl.value.length) {
		try {
			await postAvatarEditionApi({ url: avatarUploadSuccessUrl.value });
			ElMessage.success("头像修改成功！");
			userStore.userInfo.sysUser.avatarUrl = avatarImg.value;
			dialogVisible.value = false;
		} catch (err) {
			console.log(err);
		}
	}
};
// 重置密码
// const resetPassword = async () => {
// 	try {
// 		// await
// 		ElNotification({
// 			title: "操作成功",
// 			message: "重置密码成功!",
// 			type: "success",
// 		});
// 		dialogVisible.value = true;
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
const closedDialog = () => {
	avatarImgUpload.value!.clearFiles();
	avatarUploadSuccessUrl.value = "";
	avatarImg.value = "";
};

const check = () => {
	console.log(avatarImg.value);
};
defineExpose({
	acceptParams,
});
</script>

<style lang="scss">
.el-dialog.avatar-edit-dialog {
	border-radius: 10px;
	box-shadow: 0 8px 20px 1px rgb(177 197 197 / 8%);
	.el-dialog__header {
		margin-right: 0;
		padding: 30px 28px 0;
		.el-dialog__title {
			font-family: PingFangSC-Regular-, PingFangSC-Regular;
			font-weight: normal;
			font-size: 24px;
			color: #303133;
		}
		.el-dialog__headerbtn {
			top: 16px;
		}
	}
	.el-dialog__body {
		padding: 30px 27px 0;
		.avatar-upload {
			display: flex;
			.el-upload {
				width: 350px;
				height: 300px;
				color: var(--el-color-primary);
				&:hover {
					color: var(--el-color-primary);
				}
				.el-upload-dragger {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					padding: 0;
					border: none;
					width: 100%;
					height: 100%;
					background-color: #f6f6f6;
					.el-upload__text {
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-top: 17px;
						font-family: PingFangSC-Regular-, PingFangSC-Regular;
						font-weight: normal;
						font-size: 14px;
						color: #a8abb2;
					}
					.avatar-img {
						width: 100%;
						height: 100%;
					}
					.el-icon.upload-icon {
						font-size: 24px;
					}
				}
			}
			.avator-preview {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-left: 64px;
				.el-avatar {
					background: #f6f6f6;
				}
				span {
					margin-top: 25px;
					font-size: 14px;
					color: #a8abb2;
				}
			}
		}
		.el-button {
			margin-top: 18px;
		}
	}
	.el-dialog__footer {
		position: absolute;
		right: 27px;
		bottom: 29px;
		padding: 0;
		.el-button {
			width: 70px;
			height: 32px;
		}
	}
}
</style>
