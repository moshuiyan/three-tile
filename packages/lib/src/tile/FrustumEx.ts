// http://github.com/mrdoob/three.js/issues/27756

import { Frustum, Matrix3, Matrix4, Plane, Vector3, WebGLCoordinateSystem } from "three";

const _mat3 = new Matrix3();

// Solve a system of equations to find the point where the three planes intersect
function findIntersectionPoint(plane1: Plane, plane2: Plane, plane3: Plane, target: Vector3) {
	// Create the matrix A using the normals of the planes as rows
	const A = _mat3.set(
		plane1.normal.x,
		plane1.normal.y,
		plane1.normal.z,
		plane2.normal.x,
		plane2.normal.y,
		plane2.normal.z,
		plane3.normal.x,
		plane3.normal.y,
		plane3.normal.z
	);

	// Create the vector B using the constants of the planes
	target.set(-plane1.constant, -plane2.constant, -plane3.constant);

	// Solve for X by applying the inverse matrix to B
	target.applyMatrix3(A.invert());

	return target;
}

export class FrustumEx extends Frustum {
	points: Vector3[];
	constructor() {
		super();
		this.points = Array(8)
			.fill(0)
			.map(() => new Vector3());
	}

	setFromProjectionMatrix(m: Matrix4, coordinateSystem = WebGLCoordinateSystem) {
		super.setFromProjectionMatrix(m, coordinateSystem);
		this.calculateFrustumPoints();
		return this;
	}

	calculateFrustumPoints() {
		const { planes, points } = this;
		const planeIntersections = [
			[planes[0], planes[3], planes[4]], // Near top left
			[planes[1], planes[3], planes[4]], // Near top right
			[planes[0], planes[2], planes[4]], // Near bottom left
			[planes[1], planes[2], planes[4]], // Near bottom right
			[planes[0], planes[3], planes[5]], // Far top left
			[planes[1], planes[3], planes[5]], // Far top right
			[planes[0], planes[2], planes[5]], // Far bottom left
			[planes[1], planes[2], planes[5]], // Far bottom right
		];

		planeIntersections.forEach((planes, index) => {
			findIntersectionPoint(planes[0], planes[1], planes[2], points[index]);
		});
	}
}
