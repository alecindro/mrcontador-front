if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let a=Promise.resolve();return c[e]||(a=new Promise(async a=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=a}else importScripts(e),a()})),a.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},a=(a,c)=>{Promise.all(a.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(a)};self.define=(a,i,r)=>{c[a]||(c[a]=Promise.resolve().then(()=>{let c={};const b={uri:location.origin+a.slice(1)};return Promise.all(i.map(a=>{switch(a){case"exports":return c;case"module":return b;default:return e(a)}})).then(e=>{const a=r(...e);return c.default||(c.default=a),c})}))}}define("./service-worker.js",["./workbox-468c4d03"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./i18n/pt-br.json",revision:"259ec8c9a0144010e79d4a3299915b01"},{url:"app/0.62e655aabd162b0ca8c8.chunk.js",revision:"8de16fa2aac62c015ad309dfd8c0f37a"},{url:"app/1.62e655aabd162b0ca8c8.chunk.js",revision:"ec7047f00adc5eb87e4e246dd711e3b5"},{url:"app/10.62e655aabd162b0ca8c8.chunk.js",revision:"bd024164f5749552cf0a7260c85119c9"},{url:"app/11.62e655aabd162b0ca8c8.chunk.js",revision:"6826244cb3f453ea2c4491dc15dd7ad4"},{url:"app/12.62e655aabd162b0ca8c8.chunk.js",revision:"9c5ff4bc5b86ec1ba757d99cef4fdfbf"},{url:"app/13.62e655aabd162b0ca8c8.chunk.js",revision:"188f0f3e65fe000d26fde4ec96acfef6"},{url:"app/14.62e655aabd162b0ca8c8.chunk.js",revision:"bce728869b57ed37a16d231afa1e5a22"},{url:"app/15.62e655aabd162b0ca8c8.chunk.js",revision:"dd8df9f418a1dbccf5656c76a3f39f9c"},{url:"app/16.62e655aabd162b0ca8c8.chunk.js",revision:"71c861f6d727227d1d4c13254e571a6e"},{url:"app/17.62e655aabd162b0ca8c8.chunk.js",revision:"6316d791f4c585d00e995bbb2a1576b4"},{url:"app/18.62e655aabd162b0ca8c8.chunk.js",revision:"28aa328de0bfa9f257f03fd974444dc0"},{url:"app/2.62e655aabd162b0ca8c8.chunk.js",revision:"931c488a52bcfd842c5df124720f5624"},{url:"app/3.62e655aabd162b0ca8c8.chunk.js",revision:"f0fdda76ce18be04c88f7eab878184c7"},{url:"app/4.62e655aabd162b0ca8c8.chunk.js",revision:"d18356d0765324d70286161df4192e80"},{url:"app/5.62e655aabd162b0ca8c8.chunk.js",revision:"0dd90f1d9728e33549f4ee26f9722e1d"},{url:"app/6.62e655aabd162b0ca8c8.chunk.js",revision:"2944dd059b0c14a441fe165161ee0cdc"},{url:"app/7.62e655aabd162b0ca8c8.chunk.js",revision:"22b6c550d16f2c80903b5e8de50a2fdd"},{url:"app/8.62e655aabd162b0ca8c8.chunk.js",revision:"6b2b5876b83c41c3a0537bf4a4a44b89"},{url:"app/9.62e655aabd162b0ca8c8.chunk.js",revision:"1b4e13355951c779a73880f328c616e7"},{url:"app/global.62e655aabd162b0ca8c8.bundle.js",revision:"57ea4724584075c757eb56be3adedf17"},{url:"app/main.62e655aabd162b0ca8c8.bundle.js",revision:"df830cfb34ba3e075607301f6c99cc6d"},{url:"app/main.62e655aabd162b0ca8c8.bundle.js.LICENSE.txt",revision:"fa20f24f207393ba88a50283e0c40b02"},{url:"content/cfd81fbabebba3d187b7f0243b971186.png",revision:"b731e05e2700a00db88828a857ca2bd5"},{url:"content/css/app.css",revision:"625f008b2fa61c9a09eb293b07bbef48"},{url:"content/css/loading.css",revision:"9359720f97ceb5cd5b0d7d630351a1ca"},{url:"content/dd126cd23626f52c91230a708bd6df77.svg",revision:"caf1c2b432b5b77c5607b636395ab471"},{url:"content/global.8966a889a1c61814d7f7.css",revision:"c755a244a7551d0be286c57b7c0fa40c"},{url:"content/images/jhipster_family_member_0.svg",revision:"068483b5e9a98559fe8b9755f577c433"},{url:"content/images/jhipster_family_member_0_head-192.png",revision:"5efb859ec242d21aa9d68015d43b226b"},{url:"content/images/jhipster_family_member_0_head-256.png",revision:"167a9f973961596688ca56478d2ff20c"},{url:"content/images/jhipster_family_member_0_head-384.png",revision:"75a03b03f0e08c8d471596cd2f20e60c"},{url:"content/images/jhipster_family_member_0_head-512.png",revision:"d801f9fa29e7b82575f70b130df6a6b0"},{url:"content/images/jhipster_family_member_1.svg",revision:"fc0c44cf941135edf27837d81e717027"},{url:"content/images/jhipster_family_member_1_head-192.png",revision:"c10d53dc0b6031e1a6351a150ef80a6b"},{url:"content/images/jhipster_family_member_1_head-256.png",revision:"c5377635247e7d603ea7ac838bef4122"},{url:"content/images/jhipster_family_member_1_head-384.png",revision:"ab3eb7d4dea61a5e45bcfac7a43d20ec"},{url:"content/images/jhipster_family_member_1_head-512.png",revision:"0291224d484b87fa0b93674e473cddfa"},{url:"content/images/jhipster_family_member_2.svg",revision:"3f686fdec6c7c6c5501692551423bc09"},{url:"content/images/jhipster_family_member_2_head-192.png",revision:"b3330cf4076ff98b249530549e049707"},{url:"content/images/jhipster_family_member_2_head-256.png",revision:"3c92527eb3ec871a1993a0cbbf8f1763"},{url:"content/images/jhipster_family_member_2_head-384.png",revision:"1b9e2f7f7146b2fbc1983e7a94b96aed"},{url:"content/images/jhipster_family_member_2_head-512.png",revision:"39e77e5e5da08bd38905df2761484142"},{url:"content/images/jhipster_family_member_3.svg",revision:"caf1c2b432b5b77c5607b636395ab471"},{url:"content/images/jhipster_family_member_3_head-192.png",revision:"cea4fc6a91cfb017be28da2a79c14eaa"},{url:"content/images/jhipster_family_member_3_head-256.png",revision:"267e53ba9f67a30ba95a3ca37069077a"},{url:"content/images/jhipster_family_member_3_head-384.png",revision:"4890ce3f0f0510877ea12167f02e22c0"},{url:"content/images/jhipster_family_member_3_head-512.png",revision:"b93fc84c0e69ba5ae3f12fec0d776b7d"},{url:"content/images/logo-jhipster.png",revision:"b731e05e2700a00db88828a857ca2bd5"},{url:"content/main.ce47ca1498b16a34bda9.css",revision:"22d02b6f33ded00086f2e921151c3ed7"},{url:"content/scss/_bootstrap-variables.scss",revision:"69b98b55a5645e117f20146857f3197e"},{url:"content/scss/global.scss",revision:"d92ff4f145551c1aacb96bd688f8dffb"},{url:"content/scss/vendor.scss",revision:"6f48788786908e1d8d9968aa9b6161fc"},{url:"favicon.ico",revision:"cb4967e14f0b2bb8af563d393a6faea9"},{url:"index.html",revision:"2604d1a887feb51ce813c5662cf415af"},{url:"manifest.webapp",revision:"a3ada42254cdb21435d4387c43d81d87"},{url:"robots.txt",revision:"17faad8a02b5ebff702a46f485eef03c"}],{})}));
