/**
 *@description: Mercator projection
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Projection } from "./BaseProjection";
import { IProjection } from "./IProjection";

const EarthRad = 6378137; //Earth's radius(m)

/**
 * Mercator projection
 */
export class ProjMCT extends Projection implements IProjection {
	public readonly ID = "3857"; // projeciton ID
	public mapWidth = 2 * Math.PI * EarthRad; //E-W scacle Earth's circumference(m)
	public mapHeight = this.mapWidth; //S-N scacle Earth's circumference(m)
	public mapDepth = 1; //Height scale

	/**
	 * Latitude and longitude to projected coordinates
	 * @param lon longitude
	 * @param lat Latitude
	 * @returns projected coordinates
	 */
	public project(lon: number, lat: number) {
		const lonRad = (lon - this.lon0) * (Math.PI / 180); // 考虑中心经度偏移
		const latRad = lat * (Math.PI / 180);
		const x = EarthRad * lonRad;
		const y = EarthRad * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
		return { x, y };
	}

	/**
	 * Projected coordinates to latitude and longitude
	 * @param x projection x
	 * @param y projection y
	 * @returns latitude and longitude
	 */

	public unProject(x: number, y: number) {
		let lon = (x / EarthRad) * (180 / Math.PI) + this.lon0; // 考虑中心经度偏移
		if (lon > 180) lon -= 360;
		const latRad = 2 * Math.atan(Math.exp(y / EarthRad)) - Math.PI / 2;
		const lat = latRad * (180 / Math.PI);

		return { lat, lon };
	}
}
