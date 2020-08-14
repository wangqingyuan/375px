
module.exports = function(schema, option) {
  let defalutCss = `
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body,
button,
code,
dd,
dl,
fieldset,
form,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
input,
legend,
menu,
ol,
p,
pre,
textarea,
ul {
  margin: 0;
  padding: 0;
}

article,
aside,
details,
footer,
header,
iframe,
menu,
nav,
section {
  display: block;
}

button,
fieldset,
iframe,
img {
  border: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: 400;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

em,
i {
  font-style: normal;
}

li,
ol,
summary,
ul {
  list-style: none;
}

a,
a:active,
a:hover {
  text-decoration: none;
}

body,
button,
html {
  -webkit-text-size-adjust: none;
}

button,
input,
select,
textarea {
  -webkit-appearance: none;
}

a,
button,
input,
textarea {
  -webkit-tap-highlight-color: transparent;
}

mark {
  background-color: transparent;
}

em,
i {
  font-style: normal;
}

img {
  max-width: 100%;
  border: none;
  vertical-align: middle;
}

a:focus,
button,
button:focus,
i:focus,
img:focus,
input,
input:focus,
li:focus,
select,
select:focus,
span:focus,
summary,
textarea,
textarea:focus {
  outline: 0;
}

body {
  font-family: poppy-roboto, Helvetica, PingFang SC, Noto Sans SC, Source Han Sans CN, Source Han Sans CN, Arial, Hiragino Sans GB, sans-serif;
  line-height: normal;
  color: #666;
  background-color: #f8f8f8;
  -webkit-user-select: none;
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
}

* {
  margin: 0;
  padding: 0;
  outline: none;
  word-wrap: break-word;
  word-break: break-word;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;
}

*:not(input,
select,
textarea) {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

html {
  font-size: 100px;
}

html {
  height: 100%;
}

input,
textarea,
keygen,
select,
button {
  font-size: 12px;
  border: 0;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
  -webkit-text-fill-color: rgba(0, 0, 0, 0.2);
  opacity: 1;
  -webkit-opacity: 1;
}

input {
  word-break: break-all;
}

a {
  text-decoration: none;
}

body {
  margin-left: auto;
  margin-right: auto;
  height: auto;
}
/*--------------reset end--------------*/

`
  const {prettier} = option;

  // imports
  const imports = [];

  // inline style
  const style = {};

  // Global Public Functions
  const utils = [];

  // Classes 
  const classes = [];

  // events
  const events = [];

  // 1vw = width / 100
  const _w = option.responsive.width / 100;

  const _rem = option.responsive.width / 7.5;

  const prettierHtmlOpt = {
    parser: 'html'
  };
  const prettierJsOpt = {
    parser: 'babel'
  };
  const prettierCssOpt = {
    parser: 'css'
  };

  const isExpression = (value) => {
    return /^\{\{.*\}\}$/.test(value);
  }

  const toString = (value) => {
    if ({}.toString.call(value) === '[object Function]') {
      return value.toString();
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, (key, value) => {
        if (typeof value === 'function') {
          return value.toString();
        } else {
          return value;
        }
      })
    }

    return String(value);
  };

  // convert to responsive unit, such as vw
  const parseStyle = (styles) => {
    for (let style in styles) {
      for (let key in styles[style]) {
        switch (key) {
          case 'fontSize':
          case 'marginTop':
          case 'marginBottom':
          case 'paddingTop':
          case 'paddingBottom':
          case 'height':
          case 'top':
          case 'bottom':
          case 'width':
          case 'maxWidth':
          case 'left':
          case 'right':
          case 'paddingRight':
          case 'paddingLeft':
          case 'marginLeft':
          case 'marginRight':
          case 'lineHeight':
          case 'borderBottomRightRadius':
          case 'borderBottomLeftRadius':
          case 'borderTopRightRadius':
          case 'borderTopLeftRadius':
          case 'borderRadius':
            styles[style][key] = (parseInt(styles[style][key]) / _w).toFixed(2) + 'vw';
            break;
        }
      }
    }

    return styles;
  }
  // parse rem
  const parseStyleRem = (styles) => {
    for (let style in styles) {
      for (let key in styles[style]) {
        switch (key) {
          case 'fontSize':
          case 'marginTop':
          case 'marginBottom':
          case 'paddingTop':
          case 'paddingBottom':
          case 'height':
          case 'top':
          case 'bottom':
          case 'width':
          case 'maxWidth':
          case 'left':
          case 'right':
          case 'paddingRight':
          case 'paddingLeft':
          case 'marginLeft':
          case 'marginRight':
          case 'lineHeight':
          case 'borderBottomRightRadius':
          case 'borderBottomLeftRadius':
          case 'borderTopRightRadius':
          case 'borderTopLeftRadius':
          case 'borderRadius':
            styles[style][key] = (parseInt(styles[style][key]) * 2 / _rem).toFixed(2) + 'rem';
            break;
        }
      }
    }

    return styles;
  }
  // parse function, return params and content
  const parseFunction = (func) => {
    const funcString = func.toString();
    const params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
    const content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
    return {
      params,
      content
    };
  }

  // parse layer props(static values or expression)
  const parseProps = (value, isDirectValue) => {
    if (typeof value === 'string') {
      if (isExpression(value)) {
        if (isDirectValue) {
          return `\$\{${value.slice(2, -2)}\}`
        } else {
          return `"\$\{${value.slice(2, -2)}\}"`;
        }
      }

      if (isDirectValue) {
        return value;
      } else {
        return `"${value}"`;
      }
    }

    return value;
  }

  // parse async dataSource
  const parseDataSource = (data) => {
    const name = data.id;
    const {uri, method, params} = data.options;
    const action = data.type;
    let payload = {};

    switch (action) {
      case 'fetch':
        payload = {
          method: method
        };

        break;
      case 'jsonp':
        if (imports.indexOf(`<script src="https://cdn.bootcss.com/fetch-jsonp/1.1.3/fetch-jsonp.js"></script>`) === -1) {
          imports.push(`<script src="https://cdn.bootcss.com/fetch-jsonp/1.1.3/fetch-jsonp.js"></script>`);
        }
        break;
    }

    Object.keys(data.options).forEach((key) => {
      if (['uri', 'method', 'params'].indexOf(key) === -1) {
        payload[key] = toString(data.options[key]);
      }
    });

    // params parse should in string template
    if (params) {
      payload = `${toString(payload).slice(0, -1)} ,body: ${isExpression(params) ? parseProps(params) : toString(params)}}`;
    } else {
      payload = toString(payload);
    }

    let result = `{
      ${action === 'json' ? action : 'fetchJsonp'}(${parseProps(uri)}, ${toString(payload)})
        .then((response) => response.json())
    `;

    if (data.dataHandler) {
      const { params, content } = parseFunction(data.dataHandler);
      result += `.then((${params}) => {${content}})
        .catch((e) => {
          console.log('error', e);
        })
      `
    }

    result += '}';

    return `${name}() ${result}`;
  }

  // parse condition: whether render the layer
  const parseCondition = (condition, render) => {
    if (typeof condition === 'boolean') {
      return `${condition} ? ${render} : ''`;
    } else if (typeof condition === 'string') {
      return `${condition.slice(2, -2)} ? \`${render}\` : ''`;
    }
  }

  // parse loop render
  const parseLoop = (loop, loopArg, render) => {
    let data;
    let loopArgItem = (loopArg && loopArg[0]) || 'item';
    let loopArgIndex = (loopArg && loopArg[1]) || 'index';

    if (Array.isArray(loop)) {
      data = toString(loop);
    } else if (isExpression(loop)) {
      data = loop.slice(2, -2);
    }

    // add loop key
    const tagEnd = render.match(/^<.+?\s/)[0].length;
    render = `${render.slice(0, tagEnd)}${render.slice(tagEnd)}`;

    // remove `this` 
    const re = new RegExp(`this.${loopArgItem}`, 'g')
    render = render.replace(re, loopArgItem);

    return `${data}.map((${loopArgItem}, ${loopArgIndex}) => {
      return \`${render}\`;
    })`;
  }

  // generate render xml
  const generateRender = (schema) => {
    const type = schema.componentName.toLowerCase();
    const className = schema.props && schema.props.className;
    const classString = className ? ` class="${className}"` : '';
    let elementId = '';
    let elementIdString = ''; 

    if (className) {
      style[className] = schema.props.style;
    }

    let xml;
    let props = '';

    Object.keys(schema.props).forEach((key) => {
      if (['className', 'style', 'text', 'src'].indexOf(key) === -1) {
        if (/^on/.test(key) && typeof schema.props[key] === 'function') {
          const {params, content} = parseFunction(schema.props[key]);
          elementId = `${schema.componentName.toLowerCase()}_${parseInt(Math.random() * 1000)}`;
          elementIdString = ` data-id="${elementId}"`;
          events.push(`
            document.querySelectorAll('[data-id="${elementId}"]').forEach(function(element) {
              element.addEventListener('${key.slice(2).toLowerCase()}', function(${params}) {
                ${content}
              });
            });
          `);
        } else {
          props += ` ${key}=${parseProps(schema.props[key])}`;
        }
      }
    })

    switch(type) {
      case 'text':
        const innerText = parseProps(schema.props.text, true);
        xml = `<span${elementIdString}${classString}${props}>${innerText}</span>`;
        break;
      case 'image':
        const source = parseProps(schema.props.src);
        xml = `<img${elementIdString}${classString}${props} src=${source} />`;
        break;
      case 'div':
      case 'page':
      case 'block':
      case 'component':
       
        if (schema.children && schema.children.length) {
          xml = `<div${elementIdString}${classString}${props}>${transformHTML(schema.children)}</div>`;
        } else {
          xml = `<div${elementIdString}${classString}${props}></div>`;
        }
        break;
    }

    if (schema.loop) {
      xml = parseLoop(schema.loop, schema.loopArgs, xml)
    }
    if (schema.condition) {
      xml = parseCondition(schema.condition, xml);
    }
    if (schema.loop || schema.condition) {
      xml = `\$\{${xml}\}`;
    }
    return xml;
  }

  // parse schema
  const transformHTML = (schema) => {
    let result = '';

    if (Array.isArray(schema)) {
      schema.forEach((layer) => {
        result += transformHTML(layer);
      });
    } else {
      const type = schema.componentName.toLowerCase();
      if (['page'].indexOf(type) !== -1) {
        const render = [];
        let classData = []


        render.push(generateRender(schema))

        classData = classData
          .concat([prettier.format(render.join(''), {
            parser: 'html',
            rangeStart: 0
          })]);
      
        classes.push(classData.join('\n'));
      } else {


        if (schema.state || schema.methods ||  schema.dataSource ||schema.lifeCycles ) {
          return
        }


        result += generateRender(schema);
       
      }
    }
    return result;
    };

  // flexDirection -> flex-direction
  const parseCamelToLine = (string) => {
    return string.split(/(?=[A-Z])/).join('-').toLowerCase();
  }

  // style obj -> css
  const generateCSS = (style) => {
    let css = '';

    for (let layer in style) {
      css += `.${layer} {`;
      for (let key in style[layer]) {
        css += `${parseCamelToLine(key)}: ${style[layer][key]};\n`
      }
      css += '}';
    }

    return css;
  };

  if (option.utils) {
    Object.keys(option.utils).forEach((name) => {
      utils.push(`const ${name} = ${option.utils[name]}`);
    });
  }

  // start parse schema
  transformHTML(schema);

  return {
    panelDisplay: [
      {
        panelName: `index.html`,
        panelValue: prettier.format(`
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <title>Document</title>
            <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black">
            <meta name="format-detection" content="telephone=no">
            <meta name="full-screen" content="yes">
            <meta name="browsermode" content="application">
            <meta name="x5-fullscreen" content="true">
            <meta name="x5-page-mode" content="app">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="./style.responsive.rem.css" />
            ${imports.join('\n')}
            <script>
            !function(e,h){function b(){var u=d.getBoundingClientRect().width;u/a>750&&(u=750*a);var v=u/7.5;d.style.fontSize=v+"px",f.rem=e.rem=v}var n,t=e.document,d=t.documentElement,l=t.querySelector('meta[name="viewport"]'),o=t.querySelector('meta[name="flexible"]'),a=0,s=0,f=h.flexible||(h.flexible={}),ua=navigator.userAgent.toUpperCase();if(l){console.warn("将根据已有的meta标签来设置缩放比例");var g=l.getAttribute("content").match(/initial\-scale=([\d\.]+)/);g&&(s=parseFloat(g[1]),a=parseInt(1/s))}else{if(o){var k=o.getAttribute("content");if(k){var p=k.match(/initial\-dpr=([\d\.]+)/),c=k.match(/maximum\-dpr=([\d\.]+)/);p&&(a=parseFloat(p[1]),s=parseFloat((1/a).toFixed(2))),c&&(a=parseFloat(c[1]),s=parseFloat((1/a).toFixed(2)))}}}if(!a&&!s){var r=e.navigator.userAgent,j=(!!r.match(/android/gi),!!r.match(/iphone/gi)),q=j&&!!r.match(/OS 9_3/),m=e.devicePixelRatio;a=j&&!q?m>=3&&(!a||a>=3)?3:m>=2&&(!a||a>=2)?2:1:1,s=1/a}if(d.setAttribute("data-dpr",a),!l){if(l=t.createElement("meta"),l.setAttribute("name","viewport"),l.setAttribute("content","initial-scale="+s+", maximum-scale="+s+", minimum-scale="+s+", user-scalable=no"),d.firstElementChild){d.firstElementChild.appendChild(l)}else{var i=t.createElement("div");i.appendChild(l),t.write(i.innerHTML)}}if(ua.indexOf("ANDROID")>-1){d.setAttribute("class","isandroid")}e.addEventListener("resize",function(){clearTimeout(n),n=setTimeout(b,300)},!1),e.addEventListener("pageshow",function(u){u.persisted&&(clearTimeout(n),n=setTimeout(b,300))},!1),"complete"===t.readyState?t.body.style.fontSize=12*a+"px":t.addEventListener("DOMContentLoaded",function(){t.body.style.fontSize=12*a+"px"},!1),b(),f.dpr=e.dpr=a,f.refreshRem=b,f.rem2px=function(v){var u=parseFloat(v)*this.rem;return"string"==typeof v&&v.match(/rem$/)&&(u+="px"),u},f.px2rem=function(v){var u=parseFloat(v)/this.rem;return"string"==typeof v&&v.match(/px$/)&&(u+="rem"),u}}(window,(window.lib||(window.lib={})));
          </script>
          </head>
          <body>
          ${classes.join('\n')}
          </body>
          <script src="./index.js"></script>
          <script>
            ${events.join('\n')}
            </script>
          </html>
        `, prettierHtmlOpt),
        panelType: 'html'
      },
      {
        panelName: `index.js`,
        panelValue: '',
        panelType: 'js'
      },
      {
        panelName: `style.css`,
        panelValue: prettier.format(`${defalutCss}\n${generateCSS(style)}`, prettierCssOpt),
        panelType: 'css'
      },
      {
        panelName: `style.responsive.css`,
        panelValue: prettier.format(`${defalutCss}\n${generateCSS(parseStyle(JSON.parse(JSON.stringify(style))))}`, prettierCssOpt),
        panelType: 'css'
      },
      {
        panelName: `style.responsive.rem.css`,
        panelValue: prettier.format(`${defalutCss}\n${generateCSS(parseStyleRem(style))}`, prettierCssOpt),
        panelType: 'css'
      }
    ],
    noTemplate: true
  };
}
