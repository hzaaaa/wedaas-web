<template>
	<div
		class="fold-panel-wrapper"
		:style="{
			width: isCollapse ? `16px` : `${props.width}px`,
			overflow: 'hidden',
		}"
	>
		<div
			style="display: flex; align-items: center; height: 24px"
			:style="{ justifyContent: isCollapse ? 'flex-end' : 'space-between' }"
		>
			<Transition>
				<div style="display: flex; align-items: center; flex-shrink: 0" v-show="!isCollapse">
					<el-icon><ArrowLeft /></el-icon><span>返回</span>
				</div>
			</Transition>

			<el-icon
				class="collapse-icon"
				@click="isCollapse = !isCollapse"
				:style="{
					// position: 'absolute',
					// transform: isCollapse ? `scaleX(${1 / scaleX})` : 'scaleX(1)',
					// transitionProperty: 'none',
					// transformOrigin: 'left',
					// marginLeft: 'auto',
					// transition: 'none',
				}"
			>
				<component :is="isCollapse ? 'expand' : 'fold'"></component>
			</el-icon>
		</div>
		<div
			class="fold-panel"
			:style="{
				// width: `${props.width}`,
				// width: 'fit-content',
				transform: isCollapse ? `scaleX(${scaleX})` : 'scaleX(1)',
				// zoom: isCollapse ? 0 : 1,
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			}"
		>
			<!-- width: isCollapse ? '16px' : `${props.width}px` -->

			<Transition>
				<div :style="{ width: `${props.width}px` }" class="slot-wrapper">
					<div class="mask" :style="{ opacity: isCollapse ? '1' : '0', zIndex: isCollapse ? '999' : '' }"></div>
					<slot></slot>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const isCollapse = ref(false);
interface FoldPanelProps {
	width?: number;
}

const props = withDefaults(defineProps<FoldPanelProps>(), {
	width: 224,
});

const scaleX = computed(() => {
	console.log(round(16 / props.width, 2));
	return round(16 / props.width, 1);
});

function round(number: number, precision: number) {
	return Math.round(Number(+number + "e" + precision)) / Math.pow(10, precision);
	//same as:
	//return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
}
</script>

<style lang="scss" scoped>
@import "./index";
</style>
