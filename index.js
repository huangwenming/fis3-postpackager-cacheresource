/**
 * Created by baidu on 16/8/9.
 */
function replacePackager(ret, pack, settings, opt) {
    // 读取ret下的源文件
    // var files = ret.src;
    // console.log(files['/pages/newbattle/index.html']);
    // 读取pack映射关系树
    // console.log(pack);
    // 读取打包后的文件
    // console.log(ret.pkg['/pages/newbattle/index.html']);
    // console.log(ret.pkg['/pages/newbattle/index.html'].getContent());
    var files = ret.pkg;
    Object.keys(files).forEach(function(subpath) {
        var file = files[subpath];
        compile(file);
    });
    function compile(file) {
        // 暂时处理html文件
        if (file.release === false || !file.isHtmlLike) {
            return;
        }
        // 修改script文件的引用
        var content = file.getContent();
        // console.log(content);
        var scriptReg = /<script( type=\"text\/javascript\")? src=\"(.*?)\"><\/script>(<!--ignore-->)?(<!--no-cache-->)?(?!-->)/g;
        // console.log(content.match(scriptReg));
        // console.log(scriptReg.exec(content));
        var insertCount = 0;
        var syncLoadScript = 'function GetHttpRequest(){if ( window.XMLHttpRequest )return new XMLHttpRequest();'
            + 'else if ( window.ActiveXObject )return new ActiveXObject("MsXml2.XmlHttp") ;}'
            + 'function AjaxPage(sId, url){var oXmlHttp = GetHttpRequest();'
            + 'oXmlHttp.onreadystatechange = function(){if ( oXmlHttp.readyState == 4 ){'
            + 'if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) {'
            + 'IncludeJS( sId, url, oXmlHttp.responseText );}}};oXmlHttp.open("GET", url, false);'
            + 'oXmlHttp.send(null);}function IncludeJS(sId, fileUrl, source) {'
            + 'if (( source != null ) && ( !document.getElementById(sId) )) {'
            + 'var oHead = document.getElementsByTagName("HEAD").item(0);'
            + 'var oScript = document.createElement("script"); oScript.type = "text/javascript";'
            + 'oScript.id = sId; oScript.defer = true; oScript.text = source; localStorage.setItem(sId, source);'
            + 'oHead.appendChild(oScript);}}';
        content = content.replace(scriptReg, function (script) {
            var result = '';
            if (script) {
                // 如果判断出<!--no-cache-->，则不处理
                if (script.indexOf('no-cache') > -1) {
                    return script;
                }
                var src = /src=(\"(.*?)\")/g.exec(script)[1];
                var lsId = src;
                var quotLsId = lsId.replace(/\"/g, '\'');
                var result = '<script ls_id=' + lsId + '>';
                // 插入同步加载js文件的脚本
                if (insertCount === 0) {
                    result += syncLoadScript;
                    insertCount++;
                }
                result += 'if (localStorage) {'
                    + 'var scriptFromCache = localStorage.getItem(' + lsId + ');'
                    + 'var scriptDom = document.querySelector("[ls_id=' + quotLsId + ']");'
                    + 'if (scriptFromCache) {scriptDom.text = eval(scriptFromCache);}else {'
                    + 'AjaxPage(' + lsId + ', ' + lsId + ')}} else {'
                    + 'scriptDom.defer = true;scriptDom.setAttribute("src",' + lsId + ');}'
                    + '</script>';
            }
            return result;
        });
        file.setContent(content);
}
}
module.exports = replacePackager;