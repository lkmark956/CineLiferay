/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './components/Sidebar/Sidebar.jsx';
import { HomePage } from './components/HomePage/HomePage.jsx';
import { SearchPage } from './components/SearchPage/SearchPage.jsx';
import { ExplorePage } from './components/ExplorePage/ExplorePage.jsx';
import { FavoritesPage } from './components/FavoritesPage/FavoritesPage.jsx';
import { MyMoviesPage } from './components/MyMoviesPage/MyMoviesPage.jsx';
import { TopReviewsPage } from './components/TopReviewsPage/TopReviewsPage.jsx';

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
				return <HomePage />;
			case 'search':
				return <SearchPage />;
			case 'explore':
				return <ExplorePage />;
			case 'favorites':
				return <FavoritesPage />;
			case 'my-movies':
				return <MyMoviesPage />;
			case 'top-reviews':
				return <TopReviewsPage />;
			default:
				return <HomePage />;
		}
	};

	return (
		<div className="app-container">
			<Sidebar
				currentView={currentView}
				onNavigate={setCurrentView}
			/>
			<div className="main-content">
				{renderView()}
			</div>
		</div>
	);
}

/**
 * Custom Element para integrar CineHub en Liferay
 */
class CustomElement extends HTMLElement {
	connectedCallback() {
		// Renderizar la aplicación completa
		ReactDOM.render(<App />, this);
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
