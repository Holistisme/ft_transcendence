function render(path: string): void {
	const app = document.getElementById('app');
	if (!app)
		return;

	switch (path) {
		case '/':
			app.innerHTML = '<h1>Bienvenue !</h1>';
			break;
		case '/game':
			app.innerHTML = '<h1>Jeu Pong</h1>';
			break;
		default:
			app.innerHTML = '<h1>404 - Page inconnue</h1>';
	}
}

export function initRouter(): void {
	document.body.addEventListener('click', (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.matches('[data-link]')) {
			e.preventDefault();
			const href = target.getAttribute('href');
			if (href) {
				history.pushState({}, '', href);
				render(href);
			}
		}
	});

	window.addEventListener('popstate', () => {
		render(window.location.pathname);
	});

	render(window.location.pathname);
}
