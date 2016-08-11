A fis3 plugin to optimize the page loading speed by localstorage
# [fis3](https://github.com/fex-team/fis3)-postpackager-cacheresource [![NPM version][npm-image]](https://www.npmjs.com/package/fis3-postpackager-cacheresource)
 
## Description
### 1.This is a FIS3 plugin to optimize the page loading speed combined with [fis3-postpackager-loader](https://github.com/fex-team/fis3-postpackager-loader).

### 2.The key method to optimize the page loading speed:

`The page will check whether there are corresponding resources in localstorage. If it exits, the page will load the resources from localstorage, otherwise, the page will send requests to the server to get resources. When the at resources are loaded, the page will push the resources to localstorage.`
 
## Installation
 
 Run `npm install fis3-postpackager-cacheresource`
 
## Usage
 
```js
fis.match('::package', {
        postpackager: [fis.plugin('loader', {}),fis.plugin('replacescript', {})]
    });
```

## Example

### Pre processing

```html
<script type="text/javascript" src="/games/newbattle_2463497.js"></script>
<script src="/games/static/libs/pano-webgl.js"></script> 
```

### After processing

```html
<script ls_id="/games/newbattle_2463497.js">
	if (localStorage) {
		var scriptFromCache = localStorage.getItem("/games/newbattle_2463497.js");
		var scriptDom = document.querySelector("[ls_id='/games/newbattle_2463497.js']");
		if (scriptFromCache) {
			scriptDom.text = eval(scriptFromCache);
		}else {
			AjaxPage("/games/newbattle_2463497.js", "/games/newbattle_2463497.js")
		}
	} else {
		scriptDom.defer = true;
		scriptDom.setAttribute("src","/games/newbattle_2463497.js");
	}
</script>
<script ls_id="/games/static/libs/pano-webgl.js">
	if (localStorage) {
		var scriptFromCache = localStorage.getItem("/games/static/libs/pano-webgl.js");
		var scriptDom = document.querySelector("[ls_id='/games/static/libs/pano-webgl.js']");
		if (scriptFromCache) {
			scriptDom.text = eval(scriptFromCache);
		}else {
			AjaxPage("/games/static/libs/pano-webgl.js", "/games/static/libs/pano-webgl.js")
		}
	} else {
		scriptDom.defer = true;
		scriptDom.setAttribute("src","/games/static/libs/pano-webgl.js");
	}
</script>
```
#### The AjaxPage function

```js
 function GetHttpRequest(){
	if ( window.XMLHttpRequest )
		return new XMLHttpRequest();
	else if ( window.ActiveXObject )
		return new ActiveXObject("MsXml2.XmlHttp") ;
}
function AjaxPage(sId, url){
	var oXmlHttp = GetHttpRequest();
	oXmlHttp.onreadystatechange = function(){
	if ( oXmlHttp.readyState == 4 ){
		if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {
			IncludeJS( sId, url, oXmlHttp.responseText );
		}
	}};
	oXmlHttp.open("GET", url, false);
	oXmlHttp.send(null);
}
function IncludeJS(sId, fileUrl, source) {
	if (( source != null ) && ( !document.getElementById(sId) )) {
		var oHead = document.getElementsByTagName("HEAD").item(0);
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.id = sId;
		oScript.defer = true;
		oScript.text = source;
		localStorage.setItem(sId, source);
		oHead.appendChild(oScript);
	}
}
```		
 
# License
 MIT © 2016 huangwenming (1205597228@qq.com)
[npm-image]: https://badge.fury.io/js/fis3-preprocessor-px2rem.svg

