import { createRouter, createWebHistory } from 	"vue-router";

function loadRoutes() { // get array of router objects from modules
	const context = require.context('@/modules', true, /router.js$/i)
	return context.keys()
		.map(context)         // import module
		.map((m) => m.default)  // get `default` export from each resolved module
}

const baseRoutes = [];

const router = createRouter({
	history: createWebHistory(),
	mode: 'history',
	routes: baseRoutes.concat(loadRoutes()),
	scrollBehavior: (to) => {
		if (to.hash) {
			const headerHeight = document.querySelector('.header').getBoundingClientRect().height;
			const el = document.querySelector(to.hash);
			el.classList.add("shine");

			return {
				el: to.hash,
				top: headerHeight
			}
		} else {
			return { top: 0 };
		}

	}
});


export default router;
