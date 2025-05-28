/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ITileGeometryLoader, ITileMaterialLoader, LoaderFactory } from "./loader";
import pkg from "../package.json?raw";
const { version, author } = JSON.parse(pkg);
export { version, author };

// core
export * from "./tile";
// material
export * from "./material";
// geometry
export * from "./geometry";
// loader
export * from "./loader";
// source
export * from "./source";
// map
export * from "./map";

// import { _debug } from "./map";

// export function throwError(msg: string) {
// 	if (_debug) {
// 		throw new Error(msg);
// 	}
// }

export function waitFor(condition: boolean, delay = 100) {
	return new Promise<void>(resolve => {
		const interval = setInterval(() => {
			if (condition) {
				clearInterval(interval);
				resolve();
			}
		}, delay);
	});
}

export function registerImgLoader(loader: ITileMaterialLoader) {
	LoaderFactory.registerMaterialLoader(loader);
	return loader;
}

export function registerDEMLoader(loader: ITileGeometryLoader) {
	LoaderFactory.registerGeometryLoader(loader);
	return loader;
}

export function getImgLoader<T>(dateType: string) {
	return LoaderFactory.getMaterialLoader(dateType) as T;
}

export function getDEMLoader<T>(dateType: string) {
	return LoaderFactory.getGeometryLoader(dateType) as T;
}

export function getTileLoaders() {
	return LoaderFactory.getLoaders();
}
