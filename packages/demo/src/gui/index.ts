import { Vector2 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

import { createCameraGui } from "./camera";
import { createEnvironmentGui } from "./environment";
import { createLoaderGui } from "./loader";
import { createMapOptionsGui } from "./mapOptions";
import { createSourceGui } from "./source";
export { showDebug } from "./debug";

export function initGui(viewer: plugin.GLViewer, map: tt.TileMap) {
	const gui = new GUI();
	// 数据源
	createSourceGui(gui, viewer, map);
	// 地图控制
	createMapOptionsGui(gui, viewer, map);
	// 加载器
	createLoaderGui(gui, viewer, map);
	// 环境控制
	createEnvironmentGui(gui, viewer, map);
	// 摄像机控制
	createCameraGui(gui, viewer, map);
}

// 状态栏显示地图数据下载状态
export function showLoading(map: tt.TileMap) {
	const loading = document.querySelector<HTMLDivElement>("#loading");
	if (loading) {
		map.addEventListener("loading-start", evt => {
			loading.innerHTML = "Started: " + evt.itemsLoaded + " of " + evt.itemsTotal + " files.";
		});
		map.addEventListener("loading-progress", evt => {
			loading.innerHTML = "Loading: " + evt.itemsLoaded + " of " + evt.itemsTotal + " files.";
		});
		map.addEventListener("loading-complete", () => {
			loading.innerHTML = "Loading complete!";
			loading.style.color = "";
		});
		map.addEventListener("loading-error", evt => {
			loading.innerHTML = "There was an error loading " + evt.url;
			loading.style.color = "red";
			console.info("Downloading error:", evt.url);
		});
		// map.addEventListener("parsing-end", () => {
		// 	loading.innerHTML = "Parsing end!";
		// });

		// map.addEventListener("tile-dispose", tile => {
		// 	console.log("tile-dispose", tile);
		// });
	}
}

// 添加地图版权信息
export function showAttribution(map: tt.TileMap) {
	const show = () => {
		const dom = document.querySelector("#attribution");
		if (dom) {
			dom.innerHTML = "© " + plugin.getAttributions(map).join(" | © ");
		}
	};
	map.addEventListener("source-changed", () => show());
	show();
}

// 添加性能监视器
export function addStats(viewer: plugin.GLViewer) {
	const stats = new Stats();
	stats.dom.style.left = "";
	stats.dom.style.top = "";
	stats.dom.style.right = "0";
	stats.dom.style.bottom = "30px";
	stats.dom.style.zIndex = "10000";
	stats.showPanel(0);

	document.body.appendChild(stats.dom);
	viewer.addEventListener("update", () => stats.update());
}

// 状态栏显示地理位置信息
export function showLocation(viewer: plugin.GLViewer, map: tt.TileMap): void {
	viewer.container?.addEventListener("pointermove", evt => {
		const lonlat = plugin.getLocalFromMouse(evt, map, viewer.camera);
		if (lonlat) {
			const dom = document.querySelector("#location")!;
			if (dom) {
				dom.innerHTML = `${lonlat.x.toFixed(6)}°E, 
                    ${lonlat.y.toFixed(6)}°N, ${lonlat.z.toFixed(0)} m`;
			}
		}
	});
}

// 显示鼠标点击处瓦片
export function showClickedTile(viewer: plugin.GLViewer, map: tt.TileMap) {
	viewer.container?.addEventListener("click", evt => {
		const pointer = new Vector2();
		pointer.x = (evt.offsetX / viewer.width) * 2 - 1;
		pointer.y = -(evt.offsetY / viewer.height) * 2 + 1;
		// 取得鼠标点击处的经纬度高度
		const info = map.getLocalInfoFromScreen(viewer.camera, pointer);
		if (info) {
			console.log(info);
		}
	});
}
