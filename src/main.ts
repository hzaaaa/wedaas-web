import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";
// import "@/styles/reset.scss";
// import "@/styles/common.scss";
// import "@/styles/element.scss";
import "@/styles/index.scss";
import router from "@/routers/index";
import pinia from "@/stores/index";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import locale from "element-plus/dist/locale/zh-cn.mjs";
import directives from "@/directives/index";

import "@/assets/iconfont/iconfont.js";
import { objComponent } from '@/components/index'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
for (const [key, component] of Object.entries(objComponent)) {
	app.component(key, component);
}
app.use(directives);
// console.log('directives',directives)
app.use(router);
app.use(ElementPlus, { locale });
app.use(pinia);

app.mount("#app");
