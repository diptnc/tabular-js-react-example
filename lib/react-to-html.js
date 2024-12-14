import ReactDOMServer from 'react-dom/server';

// custom function to convert react element to html for tabulator config

export function ReactToHtml  (reactElement) {
    const html = ReactDOMServer.renderToString(reactElement);
    return html;
}