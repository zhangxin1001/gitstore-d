var _=Object.create;var u=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var H=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,W=Object.prototype.hasOwnProperty;var b=(i,t,r,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of H(t))!W.call(i,n)&&n!==r&&u(i,n,{get:()=>t[n],enumerable:!(e=D(t,n))||e.enumerable});return i};var o=(i,t,r)=>(r=i!=null?_(A(i)):{},b(t||!i||!i.__esModule?u(r,"default",{value:i,enumerable:!0}):r,i));var h=o(require("fs")),w=o(require("path")),$=o(require("https"));var m=o(require("fs")),p=o(require("path")),y=o(require("child_process"));function f(i){let t=p.default.dirname(i);if(t!==i){f(t);try{m.default.mkdirSync(i)}catch(r){if(r.code!=="EEXIST")throw r}}}function s(i){return new Promise((t,r)=>{y.default.exec(i,(e,n,a)=>{if(e){r(e);return}t({stdout:n,stderr:a})})})}async function g(i){try{let{stdout:t}=await s(`git ls-remote ${i.url}`);return t.split(`
`).filter(Boolean).map(r=>{let[e,n]=r.split("	");if(n==="HEAD")return{type:"HEAD",hash:e};let a=/refs\/(\w+)\/(.+)/.exec(n);return{type:a[1]==="heads"?"branch":a[1]==="refs"?"ref":a[1],name:a[2],hash:e}})}catch(t){throw t}}module.exports=function(t,r){return new l(t,r)};var l=class{constructor(t,r={}){this.src=t,this.force=r.force||!1,this.repo=k(t)}async clone(t){try{return this._checkDirIsEmpty(t),await this._cloneWithGit(this.repo,t)}catch(r){throw r}}async download(){try{return await this._cloneWithTar(this.repo)}catch(t){throw t}}async _checkDirIsEmpty(t){try{if(h.default.readdirSync(t).length>0)if(this.force)await s(`rm -rf ${t}`);else throw"\u76EE\u6807\u76EE\u5F55\u4E0D\u4E3A\u7A7A"}catch(r){if(r.code!=="ENOENT")throw r}}async _cloneWithGit(t,r){let e=t.ref==="HEAD"?"":`-b ${t.ref}`;return await s(`git clone ${e} --depth 1 ${t.url} ${r}`),await s(`rm -rf ${r+"/.git*"}`),200}async _cloneWithTar(t){let r=await this._getHash(t),e=`${t.type}/${r}.tar.gz`,n=t.type==="gitee"?`${t.url}/repository/archive/${r}.tar.gz`:`${t.url}/archive/${r}.tar.gz`;try{return h.default.statSync(e),240}catch{return f(w.default.dirname(e)),await d(n,e),200}}async _getHash(t){try{let r=await g(t);return t.ref==="HEAD"?r.find(e=>e.type==="HEAD").hash:this._selectRef(r,t.ref)}catch(r){throw r}}_selectRef(t,r){for(let e of t)if(e.name===r)return e.hash;if(r.length<8)return null;for(let e of t)if(e.hash.startsWith(r))return e.hash}};function k(i){let r=/^(?:(github|gitee):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/.exec(i),e=(r[1]||"github").replace(/\.(com|org)$/,""),n=r[2]||null,a=r[3],c=r[4].replace(".git",""),E=r[5]||"HEAD";n===null&&(n=`${e}.com`);let x=`https://${n}/${a}/${c}`;return{type:e,domain:n,user:a,name:c,ref:E,url:x}}function d(i,t){return new Promise((r,e)=>{let n=i;$.default.get(n,a=>{let c=a.statusCode;c>=400?e({code:c,message:a.statusMessage}):c>=300?d(a.headers.location,t).then(r,e):a.pipe(h.default.createWriteStream(t)).on("finish",()=>r()).on("error",e)}).on("error",e)})}
