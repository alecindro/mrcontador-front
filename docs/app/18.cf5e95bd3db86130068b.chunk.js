(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{120:function(t,c,e){e.r(c),e.d(c,"MetricsModule",(function(){return k}));var i=e(0),s=e(3),n=e(33),r=e(66),a=e(20),o=e(13);class d{constructor(t){this.http=t}getMetrics(){return this.http.get(a.b+"management/jhimetrics")}threadDump(){return this.http.get(a.b+"management/threaddump")}}d.ɵfac=function(t){return new(t||d)(i.tc(o.b))},d.ɵprov=i.cc({token:d,factory:d.ɵfac,providedIn:"root"});var u=e(5),m=e(27),g=e(2);function h(t,c){if(1&t&&(i.lc(0,"div",12),i.Yc(1,"\n        "),i.lc(2,"jhi-jvm-memory",13),i.Yc(3,"\n        "),i.kc(),i.Yc(4,"\n\n        "),i.lc(5,"jhi-jvm-threads",14),i.Yc(6,"\n        "),i.kc(),i.Yc(7,"\n\n        "),i.lc(8,"jhi-metrics-system",15),i.Yc(9,"\n        "),i.kc(),i.Yc(10,"\n    "),i.kc()),2&t){const t=i.zc();i.Tb(2),i.Gc("updating",t.updatingMetrics)("jvmMemoryMetrics",t.metrics.jvm),i.Tb(3),i.Gc("threadData",t.threads),i.Tb(3),i.Gc("updating",t.updatingMetrics)("systemMetrics",t.metrics.processMetrics)}}function p(t,c){if(1&t&&(i.lc(0,"div"),i.Yc(1,"\n        "),i.lc(2,"h3",16),i.Yc(3,"Garbage collector statistics"),i.kc(),i.Yc(4,"\n\n        "),i.lc(5,"jhi-metrics-garbagecollector",17),i.Yc(6,"\n        "),i.kc(),i.Yc(7,"\n    "),i.kc()),2&t){const t=i.zc();i.Tb(5),i.Gc("updating",t.updatingMetrics)("garbageCollectorMetrics",t.metrics.garbageCollector)}}function l(t,c){1&t&&(i.lc(0,"div",18),i.Yc(1,"Updating..."),i.kc())}function f(t,c){if(1&t&&(i.lc(0,"jhi-metrics-request",19),i.Yc(1,"\n    "),i.kc()),2&t){const t=i.zc();i.Gc("updating",t.updatingMetrics)("requestMetrics",t.metrics["http.server.requests"])}}function M(t,c){if(1&t&&(i.lc(0,"jhi-metrics-endpoints-requests",20),i.Yc(1,"\n    "),i.kc()),2&t){const t=i.zc();i.Gc("updating",t.updatingMetrics)("endpointsRequestsMetrics",t.metrics.services)}}function Y(t,c){if(1&t&&(i.lc(0,"jhi-metrics-cache",21),i.Yc(1,"\n    "),i.kc()),2&t){const t=i.zc();i.Gc("updating",t.updatingMetrics)("cacheMetrics",t.metrics.cache)}}function b(t,c){if(1&t&&(i.lc(0,"jhi-metrics-datasource",22),i.Yc(1,"\n    "),i.kc()),2&t){const t=i.zc();i.Gc("updating",t.updatingMetrics)("datasourceMetrics",t.metrics.databases)}}class j{constructor(t,c){this.metricsService=t,this.changeDetector=c,this.updatingMetrics=!0}ngOnInit(){this.refresh()}refresh(){this.updatingMetrics=!0,this.metricsService.getMetrics().pipe(Object(r.a)(()=>this.metricsService.threadDump(),(t,c)=>{this.metrics=t,this.threads=c.threads,this.updatingMetrics=!1,this.changeDetector.detectChanges()})).subscribe()}metricsKeyExists(t){return this.metrics&&this.metrics[t]}metricsKeyExistsAndObjectNotEmpty(t){return this.metrics&&this.metrics[t]&&"{}"!==JSON.stringify(this.metrics[t])}}j.ɵfac=function(t){return new(t||j)(i.gc(d),i.gc(i.k))},j.ɵcmp=i.ac({type:j,selectors:[["jhi-metrics"]],decls:34,vars:7,consts:[["id","metrics-page-heading","jhiTranslate","metrics.title"],[1,"btn","btn-primary","float-right",3,"click"],["icon","sync"],["jhiTranslate","metrics.refresh.button"],["jhiTranslate","metrics.jvm.title"],["class","row",4,"ngIf"],[4,"ngIf"],["class","well well-lg","jhiTranslate","metrics.updating",4,"ngIf"],[3,"updating","requestMetrics",4,"ngIf"],[3,"updating","endpointsRequestsMetrics",4,"ngIf"],[3,"updating","cacheMetrics",4,"ngIf"],[3,"updating","datasourceMetrics",4,"ngIf"],[1,"row"],[1,"col-md-4",3,"updating","jvmMemoryMetrics"],[1,"col-md-4",3,"threadData"],[1,"col-md-4",3,"updating","systemMetrics"],["jhiTranslate","metrics.jvm.gc.title"],[3,"updating","garbageCollectorMetrics"],["jhiTranslate","metrics.updating",1,"well","well-lg"],[3,"updating","requestMetrics"],[3,"updating","endpointsRequestsMetrics"],[3,"updating","cacheMetrics"],[3,"updating","datasourceMetrics"]],template:function(t,c){1&t&&(i.lc(0,"div"),i.Yc(1,"\n    "),i.lc(2,"h2"),i.Yc(3,"\n        "),i.lc(4,"span",0),i.Yc(5,"Application Metrics"),i.kc(),i.Yc(6,"\n\n        "),i.lc(7,"button",1),i.xc("click",(function(){return c.refresh()})),i.Yc(8,"\n            "),i.hc(9,"fa-icon",2),i.Yc(10," "),i.lc(11,"span",3),i.Yc(12,"Refresh"),i.kc(),i.Yc(13,"\n        "),i.kc(),i.Yc(14,"\n    "),i.kc(),i.Yc(15,"\n\n    "),i.lc(16,"h3",4),i.Yc(17,"JVM Metrics"),i.kc(),i.Yc(18,"\n\n    "),i.Wc(19,h,11,5,"div",5),i.Yc(20,"\n\n    "),i.Wc(21,p,8,2,"div",6),i.Yc(22,"\n\n    "),i.Wc(23,l,2,0,"div",7),i.Yc(24,"\n\n    "),i.Wc(25,f,2,2,"jhi-metrics-request",8),i.Yc(26,"\n\n    "),i.Wc(27,M,2,2,"jhi-metrics-endpoints-requests",9),i.Yc(28,"\n\n    "),i.Wc(29,Y,2,2,"jhi-metrics-cache",10),i.Yc(30,"\n\n    "),i.Wc(31,b,2,2,"jhi-metrics-datasource",11),i.Yc(32,"\n"),i.kc(),i.Yc(33,"\n")),2&t&&(i.Tb(19),i.Gc("ngIf",c.metrics&&!c.updatingMetrics),i.Tb(2),i.Gc("ngIf",c.metrics&&c.metricsKeyExists("garbageCollector")),i.Tb(2),i.Gc("ngIf",c.updatingMetrics),i.Tb(2),i.Gc("ngIf",c.metrics&&c.metricsKeyExists("http.server.requests")),i.Tb(2),i.Gc("ngIf",c.metrics&&c.metricsKeyExists("services")),i.Tb(2),i.Gc("ngIf",c.metrics&&c.metricsKeyExists("cache")),i.Tb(2),i.Gc("ngIf",c.metrics&&c.metricsKeyExistsAndObjectNotEmpty("databases")))},directives:[u.m,m.a,g.o,u.q,u.r,u.w,u.x,u.s,u.t,u.u,u.v],encapsulation:2,changeDetection:0});const v={path:"",component:j,data:{pageTitle:"metrics.title"}};class k{}k.ɵmod=i.ec({type:k}),k.ɵinj=i.dc({factory:function(t){return new(t||k)},imports:[[n.a,s.h.forChild([v])]]}),("undefined"==typeof ngJitMode||ngJitMode)&&i.Sc(k,{declarations:[j],imports:[n.a,s.h]})}}]);