/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './components/Sidebar.js';
import { HomePage } from './components/HomePage.js';
import { SearchPage } from './components/SearchPage.js';
import { ExplorePage } from './components/ExplorePage.js';

import './style.css';

/**
 * Componente principal de la aplicación CineHub
 * Gestiona la navegación entre las diferentes vistas
 */
function App() {
	const [currentView, setCurrentView] = useState('home');

	const renderView = () => {
		switch (currentView) {
			case 'home':
				return React.createElement(HomePage);
			case 'search':
				return React.createElement(SearchPage);
			case 'explore':
				return React.createElement(ExplorePage);
			default:
				return React.createElement(HomePage);
		}
	};

	return React.createElement(
		'div',
		{ className: 'app-container' },
		React.createElement(Sidebar, {
			currentView: currentView,
			onNavigate: setCurrentView
		}),
		React.createElement(
			'div',
			{ className: 'main-content' },
			renderView()
		)
	);
}

/**
 * Custom Element para integrar CineHub en Liferay
 */
class CustomElement extends HTMLElement {
	connectedCallback() {
		// Renderizar la aplicación completa
		ReactDOM.render(React.createElement(App), this);
	}

	disconnectedCallback() {
		ReactDOM.unmountComponentAtNode(this);
	}
}

const ELEMENT_NAME = 'liferay-sample-custom-element-4';

if (customElements.get(ELEMENT_NAME)) {
	// eslint-disable-next-line no-console
	console.log(
		'Skipping registration for <liferay-sample-custom-element-4> (already registered)'
	);
}
else {
	customElements.define(ELEMENT_NAME, CustomElement);
}
