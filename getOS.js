function getOS() {
	let userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (/ios|iphone|ipad|ipod/i.test(userAgent)) {
		return "ios";
	}

	if (/macintosh|mac os x/i.test(userAgent)) {
		return "mac";
	}

	if (/Windows/i.test(userAgent)) {
		return "windows";
	}

	if (/android/i.test(userAgent)) {
		return "android";
	}

	if (/linux/i.test(userAgent)) {
		return "linux";
	}

	return "Неизвестная ОС";
}

console.log("Операционная система: " + getOS());

export default getOS;
