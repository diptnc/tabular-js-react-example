import ReactDOMServer from 'react-dom/server';
export function ReactToHtml  (reactElement) {
    const html = ReactDOMServer.renderToString(reactElement);
    return html;
}