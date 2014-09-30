define(["SOS","text!svg/thermometer.svg","widget/common"],function(e,t,r){var s=["service","offering","feature","property","refresh_interval"],n=3.342574,i=473.74954,u=-24;return{inputs:s,init:function(s,a){function o(){e.getObservation(s.offering,[s.feature],[s.property],"latest",l)}function l(t){if(1==t.length&&"Cel"==t[0].result.uom&&"number"==typeof t[0].result.value){var o=t[0],l=o.featureOfInterest.name.value,p=new Date(o.resultTime),v=o.result.value,f=(o.procedure,n*(v-u)),m=i-f;a.querySelector(".feature_name").innerHTML=l,a.querySelector(".request_time").innerHTML=r.date.display(new Date),a.querySelector(".result_time").innerHTML=r.date.display(p),a.querySelector(".result_value").innerHTML=v,c.setAttribute("height",f),c.setAttribute("y",m),e.describeSensor(o.procedure,function(e){var t=e.hasOwnProperty("ProcessModel")?e.ProcessModel.outputs.OutputList.output:e.System.outputs.OutputList.output;for(var r in t){var n=t[r];n.Quantity.definition==s.property&&(a.querySelector(".property_name").innerHTML=n.name)}})}else console.error("Thermometer Widget Error - Got an invalid observation from the SOS service")}var p='<div class="widget">';p+='<h1 class="feature_name"></h1>',p+=t,p+='<h2><span class="property_name"></span>: <span class="result_value"></span> Cel</h2>',p+='<h3>Request time: <span class="request_time"></span></h3>',p+='<h3>Result time: <span class="result_time"></span></h3>',p+="</div>",a.innerHTML=p;var c=a.querySelector(".svg-temp").firstChild;e.setUrl(s.service),setInterval(o,1e3*s.refresh_interval),o()}}});