import React from 'react'
import ReactDomServer from 'react-dom/server';

const App = (data) => {
	return ReactDomServer.renderToStaticMarkup(
		<div>Hello {data.a}</div>
	)
};

export default App;
