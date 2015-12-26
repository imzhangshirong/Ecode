//-------------------------------------------------------------//
//*                            Ecode 3.4                      *//
//*                Created by zhangshirong Jarvis             *//
//-------------------------------------------------------------//
var Ecode = {
	create: function() {
		var ecode={};
		var lastPart=-1;
		var doubleCom=[
			[".如果真",".如果真结束"],
			[".判断开始",".判断结束"],
			[".如果",".如果结束"],
			[".判断循环首",".判断循环尾"],
			[".变量循环首",".变量循环尾"],
			[".计次循环首",".计次循环尾"],
			[".循环判断首",".循环判断尾"]
		]
		var replaceCommand=[
			{origi:".如果真",replace:"<span class='sysCommand ifTrue'>如果真</span>"},
			{origi:".如果真结束",replace:"<span class='sysCommand close ifTrueClose'>如果真结束</span>"},
			{origi:".判断开始",replace:"<span class='sysCommand judge'>判断</span>"},
			{origi:".判断",replace:"<span class='sysCommand judgeChild'><o class='line1'><i class='triangle-right'></i><i class='triangle-down'></i><o class='line3'></o></o><o class='line2'><i class='triangle-down'></i></o>判断</span>"},
			{origi:".默认",replace:"<span class='sysCommand judgeDef def'>默认</span>"},
			{origi:".判断结束",replace:"<span class='sysCommand close judgeClose'>判断结束</span>"},
			{origi:".如果",replace:"<span class='sysCommand if'>如果</span>"},
			{origi:".否则",replace:"<span class='sysCommand ifDef def'>否则</span>"},
			{origi:".如果结束",replace:"<span class='sysCommand ifClose close'>如果结束</span>"},
			{origi:".判断循环首",replace:"<span class='sysCommand cycle'>判断循环首</span>"},
			{origi:".判断循环尾",replace:"<span class='sysCommand'>判断循环尾</span>"},
			{origi:".计次循环首",replace:"<span class='sysCommand cycle'>计次循环首</span>"},
			{origi:".计次循环尾",replace:"<span class='sysCommand'>计次循环尾</span>"},
			{origi:".变量循环首",replace:"<span class='sysCommand cycle'>变量循环首</span>"},
			{origi:".变量循环尾",replace:"<span class='sysCommand'>变量循环尾</span>"},
			{origi:".循环判断首",replace:"<span class='sysCommand cycle'>循环判断首</span>"},
			{origi:".循环判断尾",replace:"<span class='sysCommand'>循环判断尾</span>"},
		];
		var sysCom=[
			'返回',
			'跳出循环',
			'到循环尾',
			'结束',
		]
		ecode.trans=function(ele){ //ele如果为空则转换当前所有class为ecode的，ele为指定的即转换指定，同时ele可以为自定义的元素数组
			var eleEcode;
			if(ele){
				if(ele.length>1){eleEcode=[ele];}
				else{eleEcode=ele;}
			}
			else{
				eleEcode=document.querySelectorAll(".ecode");
			}
			for(var a=0;a<eleEcode.length;a++){
				lastPart=-1;
				if(eleEcode[a].getAttribute("status")!="trans"){
					eleEcode[a].setAttribute("status","trans");
					var origiData=eleEcode[a].innerHTML;
					eleEcode[a].innerHTML="<p>Loading...</p>"
					var lineCodes=origiData.split("\n");
					var b;
					for(b=0;b<lineCodes.length;b++) {
						var temp = new Object();
						if (trim(lineCodes[b]).substr(0, 1) == ".") {
							var tableCode = lineCodes[b].split(",");
							for (var c = 0; c < tableCode.length; c++) {
								tableCode[c] = trim(tableCode[c]);
							}
							var p = tableCode[0].indexOf(" ");
							if(p==-1){
								p=tableCode[0].length;
							}
							temp.type = tableCode[0].substr(0, p);
							tableCode[0] = tableCode[0].substr(p + 1);
							temp.parameter = tableCode;
						}
						else {
							temp.type = "code";
							temp.parameter = lineCodes[b];
						}
						lineCodes[b] = temp;
					}
					//清除空白行
					var lineCodesR=new Array();
					for(b=0;b<lineCodes.length;b++){
						if(lineCodes[b].type!=""){
							if(lineCodes[b].type!="code" || lineCodes[b].parameter!=""){
								if(lineCodes[b].type!=".版本" && lineCodes[b].type!=".支持库"){
									lineCodesR[lineCodesR.length]=lineCodes[b];
								}

							}
						}
					}
					////////////////////////
					//程序集单位
					var assembly=new Array();
					var limit=findMatchArr(".程序集","",lineCodesR);
					if(limit.length==0){
						limit=new Array();
						limit[limit.length]=[0,lineCodesR.length-1];
					}
					for(b=0;b<limit.length;b++){//0
						var temp=new Array();
						for(var c=limit[b][0];c<=limit[b][1];c++){
							temp[temp.length]=lineCodesR[c];
						}
						var limit1=findMatchArr(".子程序","",temp);
						if(limit1.length>0){
							var program=new Array();
							for(var c=limit[b][0];c<limit1[0][0];c++){
								program[program.length]=lineCodesR[c];
							}
							for(var c=0;c<limit1.length;c++){
								var temp1=new Array();
								for(var d=limit1[c][0];d<=limit1[c][1];d++){
									temp1[temp1.length]=temp[d];
								}
								program[program.length]=matchRe(temp1);
							}
							assembly[assembly.length]=program;
						}
						else{
							assembly[assembly.length]=matchRe(temp);
						}
					}
					var html="";
					for(var b=0;b<assembly.length;b++){
						html+="<div class='assembly'>";
						html+=drawn(assembly[b]);
					}
					var allHTML="<div class='controller'><span class='desc'>"+eleEcode[a].getAttribute("desc")+"</span><a class='copy' href='javascript:' onclick='EcodeCopyCode(this)'>复制代码</a></div><div class='show'>"+html+"</div><div" +
						" class='origiData'><textarea>"+origiData+"</textarea></div>";
					eleEcode[a].innerHTML=allHTML;
					var eleOrigiData=eleEcode[a].querySelector(".origiData");
					eleEcode[a].style.height=eleEcode[a].clientHeight+"px";
					eleOrigiData.style.height=eleEcode[a].clientHeight-30+"px";
					var eleEcodeIfTrue=eleEcode[a].querySelectorAll(".ifTrue");
					var eleEcodeCyc=eleEcode[a].querySelectorAll(".cycle");
					var eleEcodeShow=eleEcode[a].querySelector(".show");
					var eleEcodeJudge=eleEcode[a].querySelectorAll(".judge");
					var eleEcodeIf=eleEcode[a].querySelectorAll(".if");
					var eleEcodeUl=eleEcode[a].querySelectorAll("ul");
					//处理高度//////////////////////////////////////
					for(var b=0;b<eleEcodeUl.length;b++){
						var parent=eleEcodeUl[b];
						var def;
						var close=parent.children.length-1;
						for(var c=2;c<parent.children.length;c++){
							var temp=parent.children[c].querySelector(".def");
							if(temp && temp.parentElement.parentElement==parent.children[c]){
								def=c;
								break;
							}
						}
						if(def==3){
							parent.children[2].style.marginBottom="20px";
						}
						if(def+1==close){
							parent.children[def].style.marginBottom="20px";
						}
						var nextParent;
						if(parent.parentElement && parent.parentElement.nextElementSibling){
							nextParent=parent.parentElement.nextElementSibling;
						}
						if(nextParent){
							if(nextParent.querySelector(".def") && nextParent.children[0]==nextParent.querySelector(".def").parentElement){
								parent.children[close].style.marginBottom="20px";
							}
						}
					}
					//如果真//////////////////////////////////////
					eleEcodeShow.style.width=window.screen.availWidth+"px";
					for(var b=0;b<eleEcodeIfTrue.length;b++){
						var parent=eleEcodeIfTrue[b].parentElement.parentElement;
						if(parent.parentElement.previousElementSibling){
							parentLast=parent.parentElement.previousElementSibling.children[0];
						}
						var parentNext;
						if(parent.parentElement.nextElementSibling){
							parentNext=parent.parentElement.nextElementSibling.children[0];
						}
						var turn0=0;
						var turn1=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
						var line1=parent.children[0];
						var line2=parent.children[1];
						var close=parent.children[parent.children.length-1];
						//alert(def)
						var add=turn0*4;
						if(turn1){
							line1.style.top=10+add+"px";
							line1.style.height=close.offsetTop-10+6-add+"px";
							line1.querySelector(".triangle-right").style.bottom="-5px";
							line1.querySelector(".triangle-right").style.display="block";
						}
						else{
							line1.style.display="none";
							line2.style.height=close.offsetTop-10-add+"px";
							line2.style.top=10+add+"px";
							line2.style.display="block";
							line2.querySelector(".triangle-down").style.display="block";
						}
					}
					//如果//////////////////////////////////////
					for(var b=0;b<eleEcodeIf.length;b++){
						var parent=eleEcodeIf[b].parentElement.parentElement;
						var parentLast;
						if(parent.parentElement.previousElementSibling){
							parentLast=parent.parentElement.previousElementSibling.children[0];
						}
						var parentNext;
						if(parent.parentElement.nextElementSibling){
							parentNext=parent.parentElement.nextElementSibling.children[0];
						}
						var turn0=0;
						var turn1=0;
						var turn2=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
						var line1=parent.children[0];
						var line2=parent.children[1];
						var line3=parent.children[0].children[2];
						var close=parent.children.length-1;
						var def;
						for(var c=2;c<parent.children.length-1;c++){
							var temp=parent.children[c].querySelector("p .def");
							if(temp){
								var par=temp.parentElement.parentElement.parentElement;
								if(par==parent) {
									def = c;
								}
							}
						}
						if(parent.parentElement.previousElementSibling){
							var defLastSys=parent.parentElement.previousElementSibling;
							if(defLastSys.children[0].children[0]==defLastSys.querySelector(".def") && defLastSys.tagName=="LI"){
								turn0=1;
							}
						}
						var defNextSys=parent.children[def].nextElementSibling.querySelector(".sysCommand");
						if(defNextSys){
							if(parent.children[def].nextElementSibling==defNextSys.parentElement.parentElement.parentElement){
								turn2=1;
							}
						}
						var add=turn0*4;
						line1.style.top=10+add+"px";
						line1.style.height=parent.children[def].offsetTop-add+"px";
						line1.querySelector(".triangle-right").style.bottom="-5px";
						line1.querySelector(".triangle-right").style.display="block";
						if(turn1){
							line2.querySelector(".triangle-right").style.display="block";
							line2.querySelector(".triangle-right").style.bottom="-5px";
							line2.style.borderBottomWidth="1px";
							if(add==0){
								add=6;
							}
							line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+20-add+"px";
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
						}
						else{
							line2.querySelector(".triangle-down").style.display="block";
							line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+10+"px";
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
						}
						if(turn2){
							line1.style.borderBottomWidth="0px";
							line1.style.height=line1.clientHeight-6+"px";
							line1.querySelector(".triangle-right").style.left="30px";
							line3.style.display="block";
						}
					}
					//循环//////////////////////////////////////
					for(var b=0;b<eleEcodeCyc.length;b++){
						var parent=eleEcodeCyc[b].parentElement.parentElement;
						var parentLast=parent.parentElement.previousElementSibling;
						//var close=parentLast.children.length-1;
						var turn0=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.children[0] && parentLast.children[0].children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}

						var add=turn0*5;
						var line1=parent.children[0];
						line1.style.top=10+add+"px";
						line1.style.height=parent.clientHeight-20-add+"px";
						line1.querySelector(".triangle-right").style.top="-5px";
						line1.querySelector(".triangle-right").style.display="block";
					}
					for(var b=0;b<eleEcodeJudge.length;b++){
						var parent=eleEcodeJudge[b].parentElement.parentElement;
						var parentLast;
						if(parent.parentElement.previousElementSibling){
							parentLast=parent.parentElement.previousElementSibling.children[0];
						}
						var parentNext;
						if(parent.parentElement.nextElementSibling){
							parentNext=parent.parentElement.nextElementSibling.children[0];
						}

						var turn0=0;
						var turn1=0;
						var turn2=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
						var line1=parent.children[0];
						var line2=parent.children[1];
						var line3=parent.children[0].children[2];
						var close=parent.children.length-1;
						var all=new Array();
						var def;
						for(var c=2;c<parent.children.length-1;c++){
							var temp=parent.children[c].querySelector("p .judgeChild");
							if(temp){
								var par=temp.parentElement.parentElement.parentElement;
								if(par==parent) {
									all[all.length] = c;
								}
							}
							var temp=parent.children[c].querySelector("p .def");
							if(temp){
								var par=temp.parentElement.parentElement.parentElement;
								if(par==parent) {
									def = c;
								}
							}
						}
						if(parent.parentElement.previousElementSibling){
							var defLastSys=parent.parentElement.previousElementSibling;
							if(defLastSys.children[0].children[0]==defLastSys.querySelector(".def") && defLastSys.tagName=="LI"){
								turn0=1;
							}
						}
						var defNextSys=parent.children[def].nextElementSibling.querySelector(".sysCommand");
						if(defNextSys){
							if(parent.children[def].nextElementSibling==defNextSys.parentElement.parentElement.parentElement){
								turn2=1;
							}
						}
						var add=turn0*4;
						var line1_;
						var line2_;
						var line3_;
						for(var c=0;c<all.length;c++){
							line1_=parent.children[all[c]].children[0].children[0].children[0];
							line2_=parent.children[all[c]].children[0].children[0].children[1];
							line3_=line1_.children[2];
							line1_.style.top=10+4+"px";
							line1_.style.left=-20+"px";
							var temp;
							var k=0;
							if(c==all.length-1){
								temp=parent.children[def].offsetTop+20+6;
								if(def-all[c]==1){
									k=1;
								}
								else{
									temp-=20;
								}
							}
							else{
								temp=parent.children[all[c+1]].offsetTop+20;
								if(all[c+1]-all[c]==1){
									k=1;
								}
								else{
									temp-=20;
								}
							}
							if(k==1){
								parent.children[all[c]].style.marginBottom="20px";
							}
							line1_.style.height=temp-parent.children[all[c]].offsetTop-10+"px";
							line1_.querySelector(".triangle-right").style.display="block";
							line1_.querySelector(".triangle-right").style.bottom="-5px";
						}
						line1.style.top=10+add+"px";
						line1.style.height=parent.children[def].offsetTop-add+"px";
						line1.querySelector(".triangle-right").style.bottom="-5px";
						line1.querySelector(".triangle-right").style.display="block";
						if(all.length){
							line1.style.height=parent.children[all[0]].offsetTop-10+6-add+"px";
							if(turn1){
								line2.querySelector(".triangle-right").style.display="block";
								line2.querySelector(".triangle-right").style.bottom="-5px";
								line2.style.borderBottomWidth="1px";
								if(add==0){
									add=6;
								}
							}
							else{
								line2.querySelector(".triangle-down").style.display="block";
							}
							line2.style.height=parent.children[close].offsetTop-parent.children[all[0]].offsetTop+20-add+"px";
							line2.style.top=parent.children[all[0]].offsetTop-10+"px";
							line2.style.display="block";
							if(turn2){
								line1_.style.borderBottomWidth="0px";
								line1_.style.height=line1.clientHeight-6+"px";
								line1_.querySelector(".triangle-right").style.left="30px";
								line3_.style.display="block";
							}
						}
						else{
							if(turn1){
								line2.querySelector(".triangle-right").style.display="block";
								line2.querySelector(".triangle-right").style.bottom="-5px";
								line2.style.borderBottomWidth="1px";
								if(add==0){
									add=6;
								}
								line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+20-add+"px";

							}
							else{
								line2.querySelector(".triangle-down").style.display="block";
								line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+10+"px";
							}
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
							if(turn2){
								line1.style.borderBottomWidth="0px";
								line1.style.height=line1.clientHeight-6+"px";
								line1.querySelector(".triangle-right").style.left="30px";
								line3.style.display="block";
							}
						}
					}
					eleEcodeShow.style.height=eleEcodeShow.parentElement.clientHeight-40+"px";
					var eleEcodeDiv=eleEcodeShow.querySelectorAll("div");
					for(var b=0;b<eleEcodeDiv.length;b++){
						eleEcodeDiv[b].style.width=eleEcodeDiv[b].clientWidth+30+"px";
					}
					eleEcodeShow.style.width="100%";
				}
			}
		}
		function isArray(o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		}
		function drawn(origiArr){
			var html="";
			var mlk=0;
			for(var b=0;b<origiArr.length;b++){
				if(!isArray(origiArr[b])){
					if(origiArr[b].type==".程序集"){
						html+="<table class='assembly_table'><tr><th>程序集名</th><th>保留</th><th>保留</th><th>备注</th></tr>";
						for(var c=origiArr[b].parameter.length;c<4;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						html+=tablePara(4,origiArr[b].parameter);
						lastPart=0;//程序集
						mlk=1;
					}
					else if(origiArr[b].type==".程序集变量"){
						if(lastPart!=0 && lastPart!=0.1){
							html+="<table class='assembly_table'><tr><th>程序集名</th><th>保留</th><th>保留</th><th>备注</th></tr>";
							lastPart=0;
						}
						if(lastPart!=0.1){
							html+="<tr><th>变量名</th><th>类型</th><th>数组</th><th>备注</th></tr>";
							lastPart=0.1;//程序集变量
						}
						for(var c=origiArr[b].parameter.length;c<4;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						html+=tablePara(4,origiArr[b].parameter);
						lastPart=0.1;//程序集变量
						mlk=1;
					}
					else if(origiArr[b].type==".子程序"){
						if(lastPart!=1){
							if(lastPart<1 && lastPart>-1){
								html+="</table>";
							}
							else if(lastPart<0){
								html+="</div>";
							}
							else if(lastPart>1 && lastPart<=2){
								html+="</table></div>";
							}
							html+="<div class='function'><table class='function_table'><tr><th>子程序名</th><th>返回值类型</th><th>公开</th><th colspan='3'>备注</th></tr>";
							lastPart=1;//子程序
						}
						else{
							html+="</table></div><div class='function'><table class='function_table'><tr><th>子程序名</th><th>返回值类型</th><th>公开</th><th colspan='3'>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<4;c++){
							origiArr[b].parameter[c]="";
						}
						if(origiArr[b].parameter[2]=="公开"){
							origiArr[b].parameter[2]="√";
						}
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						html+=tablePara(4,origiArr[b].parameter,3,3);
						lastPart=1;//子程序
						mlk=1;
					}
					else if(origiArr[b].type==".参数"){
						if(lastPart==1){
							html+="<tr><th>参数名</th><th>类型</th><th>参考</th><th>可空</th><th>数组</th><th>备注</th></tr>";
						}
						else if(lastPart==3){
							html+="<tr><th>参数名</th><th>类型</th><th>传址</th><th>数组</th><th>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<5;c++){
							origiArr[b].parameter[c]="";
						}
						if(lastPart>=3 && lastPart<4){
							var temp="";
							if(origiArr[b].parameter[2]=="传址 数组"){
								temp="√</td><td>√";
							}
							else if(origiArr[b].parameter[2]=="传址"){
								temp="√</td><td>";
							}
							else if(origiArr[b].parameter[2]=="数组"){
								temp="</td><td>√";
							}
							else{
								temp="</td><td>";
							}
							origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
							origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
							origiArr[b].parameter[2]=temp;
							html+=tablePara(4,origiArr[b].parameter);
							lastPart=3.1;
						}
						else if(lastPart>=1 && lastPart<2){
							if(origiArr[b].parameter[2]=="参考 可空 数组"){
								origiArr[b].parameter[2]="√</td><td>√</td><td>√";
							}
							else if(origiArr[b].parameter[2]=="参考 可空"){
								origiArr[b].parameter[2]="√</td><td>√</td><td>";
							}
							else if(origiArr[b].parameter[2]=="参考 数组"){
								origiArr[b].parameter[2]="√</td><td></td><td>√";
							}
							else if(origiArr[b].parameter[2]=="可空 数组"){
								origiArr[b].parameter[2]="</td><td>√</td><td>√";
							}
							else if(origiArr[b].parameter[2]=="参考"){
								origiArr[b].parameter[2]="√</td><td></td><td>";
							}
							else if(origiArr[b].parameter[2]=="可空"){
								origiArr[b].parameter[2]="</td><td>√</td><td>";
							}
							else if(origiArr[b].parameter[2]=="数组"){
								origiArr[b].parameter[2]="</td><td></td><td>√";
							}
							else{
								origiArr[b].parameter[2]="</td><td></td><td>";
							}
							origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
							origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
							html+=tablePara(4,origiArr[b].parameter);
							lastPart=1.1;
						}
						mlk=1;
						//子程序参数 1.1 dll参数 3.1
					}
					else if(origiArr[b].type==".局部变量"){
						if(lastPart!=2){
							html+="</table>"
							html+="<table class='variable_table'><tr><th>变量名</th><th>类型</th><th>静态</th><th>数组</th><th>备注</th></tr>";
							lastPart=2;//局部变量
						}
						for(var c=origiArr[b].parameter.length;c<5;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						origiArr[b].parameter[3]=origiArr[b].parameter[3].replace(/"/g,"");
						if(origiArr[b].parameter[2]=="静态"){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=2;//局部变量
						mlk=1;
					}
					else if(origiArr[b].type==".DLL命令"){
						if(lastPart!=3){
							html+="</table></div>";
						}
						html+="<div class='dllFunction'><table class='dllFunction_table'><tr><th>Dll命令名</th><th>返回值类型</th><th>公开</th><th colspan='2'>备注</th></tr>";
						for(var c=origiArr[b].parameter.length;c<6;c++){
							origiArr[b].parameter[c]="";
						}
						if(origiArr[b].parameter[4]=="公开"){
							origiArr[b].parameter[4]="√";
						}
						html+="<tr><td>"+origiArr[b].parameter[0]+"</td><td><span class='dataType'>"+origiArr[b].parameter[1]+"</span></td><td>"+origiArr[b].parameter[4]+"</td><td colspan='2'><span class='remark'>"+origiArr[b].parameter[5]+"</span></td></tr>";
						html+="<tr><th colspan='5'>库文件名：</th></tr>";
						html+="<tr><td colspan='5'><span class='command'>"+origiArr[b].parameter[2].replace(/"/g,"")+"</span></td></tr>";
						html+="<tr><th colspan='5'>在库中对应命令名：</th></tr>";
						html+="<tr><td colspan='5'><span class='command'>"+origiArr[b].parameter[3].replace(/"/g,"")+"</span></td></tr>";
						lastPart=3;//DLL
						mlk=1;
					}
					else if(origiArr[b].type==".常量"){
						if(lastPart!=4){
							html+="</table></div>";
							html+="<div class='statics'><table class='statics_table'><tr><th>常量名称</th><th>常量值</th><th>公开</th><th>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<4;c++){
							origiArr[b].parameter[c]="";
						}
						var temp=trim(origiArr[b].parameter[1].replace(/"/g,""));
						if(Number(temp)==temp && temp!=""){
							origiArr[b].parameter[1]="<span class='math'>"+temp+"</span>";
						}
						else{
							origiArr[b].parameter[1]="<span class='quote'>"+origiArr[b].parameter[1].replace(/ /g,"&nbsp;")+"</span>";
						}
						origiArr[b].parameter[0]="<span class='static'>"+origiArr[b].parameter[0]+"</span>";
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						if(origiArr[b].parameter[2]=="公开"){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(4,origiArr[b].parameter);
						lastPart=4;//常量
						mlk=1;
					}
					else if(origiArr[b].type==".数据类型"){
						if(lastPart!=5){
							html+="</table></div>";
							html+="<div class='selfDataType'><table class='selfDataType_table'><tr><th>数据类型名</th><th>公开</th><th colspan='3'>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<4;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[0]="<span class='dataType'>"+origiArr[b].parameter[0]+"</span>";
						origiArr[b].parameter[2]="<span class='remark'>"+origiArr[b].parameter[2].replace(/ /g,"&nbsp;")+"</span>";
						if(origiArr[b].parameter[1]=="公开"){
							origiArr[b].parameter[1]="√";
						}
						html+=tablePara(3,origiArr[b].parameter,2,3);
						lastPart=5;//数据类型
						mlk=1;
					}
					else if(origiArr[b].type==".成员"){
						if(lastPart==5){
							html+="<tr><th>成员名</th><th>类型</th><th>传址</th><th>数组</th><th>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<5;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						origiArr[b].parameter[3]=origiArr[b].parameter[3].replace(/"/g,"");
						if(origiArr[b].parameter[2]=="传址"){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=5.1;//数据类型成员
						mlk=1;
					}
					else if(origiArr[b].type==".全局变量"){
						if(lastPart!=6){
							html+="</table></div>";
							html+="<div class='globalVariable'><table class='globalVariable_table'><tr><th>全局变量名</th><th>全类型</th><th>数组</th><th>公开</th><th>备注</th></tr>";
						}
						for(var c=origiArr[b].parameter.length;c<5;c++){
							origiArr[b].parameter[c]="";
						}
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						var temp=origiArr[b].parameter[3];
						origiArr[b].parameter[3]=origiArr[b].parameter[2];
						origiArr[b].parameter[2]=temp;
						if(origiArr[b].parameter[3]=="公开"){
							origiArr[b].parameter[3]="√";
						}

						origiArr[b].parameter[2]=origiArr[b].parameter[2].replace(/"/g,"");
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=6;//全局变量
						mlk=1;
					}
					else if(origiArr[b].type.substr(0,1)=="."){
						if(lastPart>=0){
							html+="</table>";
							lastPart=-2;
						}
						var command=origiArr[b].type;
						for(var c=0;c<replaceCommand.length;c++){
							if(replaceCommand[c].origi==command){
								command=replaceCommand[c].replace;
								break;
							}
						}
						var parameter="";
						for(var c=0;c<origiArr[b].parameter.length;c++){
							parameter+=origiArr[b].parameter[c];
							if(c<origiArr[b].parameter.length-1){
								parameter+=",";
							}
						}
						if(b==0){
							if(lastPart<-1){
								html+="<li><ul><o class='line1'><i class='triangle-right'></i><i class='triangle-down'></i><o class='line3'></o></o><o class='line2'><i class='triangle-down'></i><i class='triangle-right'></i></o>";
							}
							else{
								html+="<ul><o class='line1'><i class='triangle-right'></i><i class='triangle-down'></i><o class='line3'></o></o><o class='line2'><i class='triangle-down'></i><i class='triangle-right'></i></o>";
							}
							lastPart--;
							html+="<p>"+command+parseCodeLine(parameter,1)+"</p>";
						}
						else if(b==origiArr.length-1){
							html+="</li><p>"+command+parseCodeLine(parameter,1)+"</p>";
							html+="</ul>";

						}
						else{
							html+="<li><p>"+command+parseCodeLine(parameter,1)+"</p></li>";
						}

					}
					else if(origiArr[b].type=="code"){
						if(lastPart>-1){
							html+="</table>";
							lastPart=-1;
						}
						var parameter=origiArr[b].parameter;
						if(lastPart<-1){
							html+="<li><p class='codeline'>"+parseCodeLine(parameter,1)+"</p></li>";
						}
						else{
							html+="<p class='codeline'>"+parseCodeLine(parameter,1)+"</p>";
						}
					}
				}
				else{
					html+=drawn(origiArr[b]);
				}
			}
			if(mlk==1){
				html+="</div>";
			}
			return html;
		}
		function parseCodeLine(origiCodeStr,type){
			var codeStr=origiCodeStr;
			var str=codeStr;
			var add=0;
			var remark=codeStr.length;
			if(type){
				//高亮注释/////////////////////////////////
				var quote=findMatchStr("“","”",codeStr);
				while(remark>-1){
					remark=codeStr.lastIndexOf("'",remark-1);
					if(quote.length>0){
						if(quote[quote.length-1][1]<remark || quote[quote.length-1][0]>remark){break;}
					}
					else{break;}
				}
				if(remark==-1){
					remark=codeStr.length;
				}
				else{
					codeStr=codeStr.substr(0,remark)+"<span class='remark'>"+codeStr.substr(remark).replace(/ /g,"&nbsp;")+"</span>";
				}
				//高亮运算符/////////////////////////////////
				add=0;
				str=codeStr;
				quote=findMatchStr("“","”",codeStr);
				var compuStr="+-*/\\＝%<>≠=,＋";
				for(var a=0;a<remark;a++){
					var p=a;
					var temp=str.substr(p,1);
					if(compuStr.indexOf(temp)>-1){
						var k=0;
						for(var b=0;b<quote.length;b++){
							if(quote[b][0]<p && quote[b][1]>p){
								k=1;
								break;
							}
						}
						if(k==0){
							temp="<span class='operator'>"+temp+"</span>";
							codeStr=codeStr.substr(0,add+p)+temp+codeStr.substr(add+p+1);
							add+=temp.length-1;
						}
					}
				}
				remark+=add;
				//高亮引用/////////////////////////////////
				add=0;
				str=codeStr;
				quote=findMatchStr("“","”",codeStr);
				for(var a=0;a<quote.length;a++){
					if(quote[a][1]<remark){
						var rep="<span class='quote'>"+codeStr.substr(add+quote[a][0],quote[a][1]-quote[a][0]+1).replace(/ /g,"&nbsp;")+"</span>";
						codeStr=codeStr.substr(0,add+quote[a][0])+rep+codeStr.substr(add+quote[a][1]+1);
						add+=rep.length-(quote[a][1]-quote[a][0])-1;
					}
				}
				remark+=add-1;
				//高亮常量/////////////////////////////////
				add=0;
				quote=findMatchStr("“","”",codeStr);
				var statics=codeStr.indexOf("#",0);
				while(statics>-1){
					var k=0;
					for(var a=0;a<quote.length;a++){
						if((quote[a][0]<statics && quote[a][1]>statics)||(statics>remark)){
							k=1;
							break;
						}
					}
					if(k==0){
						var p=new Array();
						p[p.length]=codeStr.indexOf("+",statics);
						p[p.length]=codeStr.indexOf("-",statics);
						p[p.length]=codeStr.indexOf("*",statics);
						p[p.length]=codeStr.indexOf("/",statics);
						p[p.length]=codeStr.indexOf("%",statics);
						p[p.length]=codeStr.indexOf("=",statics);
						p[p.length]=codeStr.indexOf("\\",statics);
						p[p.length]=codeStr.indexOf(">",statics);
						p[p.length]=codeStr.indexOf("<",statics);
						p[p.length]=codeStr.indexOf(".",statics);
						p[p.length]=codeStr.indexOf(",",statics);
						p[p.length]=codeStr.indexOf(" ",statics);
						p[p.length]=codeStr.indexOf("(",statics);
						p[p.length]=codeStr.indexOf(")",statics);
						p[p.length]=codeStr.indexOf("[",statics);
						p[p.length]=codeStr.indexOf("]",statics);
						p[p.length]=codeStr.indexOf("{",statics);
						p[p.length]=codeStr.indexOf("}",statics);
						p[p.length]=codeStr.indexOf("＝",statics);
						p[p.length]=codeStr.indexOf("≠",statics);
						var p1=codeStr.length;
						for(var b=0;b< p.length;b++){
							if(p[b]!=-1 && p[b]<p1){
								p1=p[b];
							}
						}
						var rep="<span class='static'>"+trim(codeStr.substr(statics,p1-statics))+"</span>";
						codeStr=codeStr.substr(0,statics)+rep+codeStr.substr(p1);
						add+=rep.length-(p1-statics);
						remark+=rep.length-(p1-statics);
					}
					statics=codeStr.indexOf("#",add+statics+1);
				}
				add=0;
				str=codeStr;

			}
			//高亮命令/////////////////////////////////
			var quote=findMatchStr("“","”",codeStr);
			var bracket0=findMatchStr("(",")",codeStr);
			for(var a=0;a<bracket0.length;a++){
				var k=0;
				for(var b=0;b<quote.length;b++){
					if((quote[b][0]<bracket0[a][0] && quote[b][1]>bracket0[a][1])||(bracket0[a][0]>remark)){
						k=1;
						break;
					}
				}
				if(k==0){
					var son=codeStr.substr(bracket0[a][0]+1,bracket0[a][1]-bracket0[a][0]-1);
					son=parseCodeLine(son);
					var p=new Array();
					p[p.length]=codeStr.lastIndexOf("+",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("-",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("*",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("/",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("%",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("=",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("\\",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf(">",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("<",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf(".",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf(",",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("＝",bracket0[a][0]-1);
					p[p.length]=codeStr.lastIndexOf("≠",bracket0[a][0]-1);
					var p1=-1;
					for(var b=0;b< p.length;b++){
						if(p[b]!=-1 && p[b]>p1){
							p1=p[b];
						}
					}
					var command=codeStr.substr(p1+1,bracket0[a][0]-p1-1);
					var m=0
					for(var e=0;e<sysCom.length;e++){
						if(sysCom[e]==trim(command)){
							m=1;
							break;
						}
					}
					if(m==0){
						var rep="<span class='command'>"+trim(command)+"</span>";
					}
					else{
						var rep="<span class='sysCommand'>"+trim(command)+"</span>";
					}
					str=str.substr(0,add+p1+1)+rep+str.substr(add+bracket0[a][0],1)+son+codeStr.substr(bracket0[a][1]);
					var len=rep.length-command.length+son.length-(bracket0[a][1]-bracket0[a][0])+1
					add+=len;
					remark+=len;
				}
			}
			if(type){
				//高亮括号样式/////////////////////////////////
				add=0;
				codeStr=str;
				quote=findMatchStr("“","”",codeStr);
				var compuStr="(){}[]";
				for(var a=0;a<=remark;a++){
					var p=a;
					var temp=str.substr(p,1);
					if(compuStr.indexOf(temp)>-1){
						var k=0;
						for(var b=0;b<quote.length;b++){
							if(quote[b][0]<p && quote[b][1]>p){
								k=1;
								break;
							}
						}
						if(k==0){
							if(temp=="(" || temp==")"){
								temp="<span class='bracket0'>"+temp;
							}
							else if(temp=="[" || temp=="]"){
								temp="<span class='bracket1'>"+temp;
							}
							else if(temp=="{" || temp=="}"){
								temp="<span class='bracket2'>"+temp;
							}
							temp+="</span>";
							codeStr=codeStr.substr(0,add+p)+temp+codeStr.substr(add+p+1);
							add+=temp.length-1;
						}
					}
				}
				remark+=add;
				//高亮数字/////////////////////////////////
				str=codeStr;
				add=0;
				quote=findMatchStr("“","”",codeStr);
				var p=codeStr.indexOf("</span>");
				var p_=codeStr.indexOf("<span");
				if(p_<p && p_>-1){
					rep=trim(codeStr.substr(0,p_));
					if(rep!=""){
						rep="<span class='var'>"+rep+"</span>";
						str=rep+str.substr(p_);
						add+=rep.length-(p_);
					}
				}
				while(p>-1 && p<remark){
					var k=0;
					for(var b=0;b<quote.length;b++){
						if(quote[b][0]<p && quote[b][1]>p){
							k=1;
							break;
						}
					}
					if(k==0){
						var p2=codeStr.indexOf("<span",p);
						if(p2==-1){p2=codeStr.length}
						var rep=trim(codeStr.substr(p+7,p2-p-7));
						if(Number(rep)==rep && rep!=""){
							rep="<span class='math'>"+rep+"</span>";
						}
						else{
							rep="<span class='var'>"+rep+"</span>";
						}
						str=str.substr(0,add+p+7)+rep+str.substr(add+p2);
						add+=rep.length-(p2-p-7);
					}
					p=codeStr.indexOf("</span>",p+1);
				}
				remark+=add;
			}
			return str;
		}
		function tablePara(cols,origiArr,start,num){
			var temp="";
			for(var c=0;c<cols;c++){
				temp+="<td"
				if(start==c){
					temp+=" colspan='"+num+"'";
				}
				temp+=">";
				if(c<origiArr.length){
					temp+=origiArr[c];
				}
				temp+="</td>";
			}
			temp="<tr>"+temp+"</tr>";
			return temp;
		}
		function matchRe(origiArr){
			var limit=new Array();
			var temp0=new Array();
			var last=-1
			for(var a=0;a<origiArr.length;a++){
				if(a>last) {
					var k=0;
					for(var e=0;e<doubleCom.length;e++){
						if(origiArr[a].type ==doubleCom[e][0]){
							var next=new Array();
							for(var c=a;c<origiArr.length;c++){
								next[next.length]=origiArr[c];
							}
							limit = findMatchArr(doubleCom[e][0], doubleCom[e][1], next);
							if (limit.length > 0) {
								var temp1 = new Array({});
								for (var c = limit[0][0] + 1; c < limit[0][1]; c++) {
									temp1[temp1.length] = next[c];
								}
								temp1 = matchRe(temp1);
								temp1[0] = next[limit[0][0]];
								temp1[temp1.length] = next[limit[0][1]];
								temp0[temp0.length] = temp1;
								last=a+limit[0][1];
							}
							k=1;
							break;
						}
					}
					if(k==0){
						temp0[temp0.length] = origiArr[a];
					}
				}
			}
			return temp0;
		}
		function findMatchStr(startStr,endStr,origiStr){
			var temp0=new Array();
			var half=new Array();
			var end=-1;
			var start=origiStr.indexOf(startStr);
			while(start>-1){
				end=origiStr.indexOf(endStr,start+1);
				var p=origiStr.indexOf(startStr,start+1);
				if(p==-1){
					p=origiStr.length;
				}
				var temp1;
				if(p>end){
					temp1=[start,end];
					var pp=half.length-1;
					for(var a=pp;a>=0;a--){
						end=origiStr.indexOf(endStr,end+1);
						if(end<p){
							temp0[half[a]][1]=end;
							half.length--;
						}
						else{
							break;
						}
					}
				}
				else{
					temp1=[start,-1];
					half[half.length]=temp0.length;
				}
				temp0[temp0.length]=temp1;
				start=origiStr.indexOf(startStr,start+1);

			}
			var tempRe=new Array();
			var last=-1;
			for(var a=0;a<temp0.length;a++){
				if(temp0[a][1]>last){
					tempRe[tempRe.length]=temp0[a];
					last=temp0[a][1];
				}
			}
			return tempRe;

		}
		function findMatchArr(startStr,endStr,origiArr){
			var temp0=new Array();
			var start=-1;
			var half=new Array();
			var end=-1;
			for(var a=0;a<origiArr.length;a++){
				if(origiArr[a].type==startStr){
					if(endStr!=""){
						half[half.length]=temp0.length;
						start=a;
						temp0[temp0.length]=[start,end];
					}
					else{
						if(start!=-1){
							temp0[temp0.length]=[start,a-1];
						}
						start=a;
					}
					end=-1;
				}
				if(origiArr[a].type==endStr){

					end=a;
					if(half.length>0){
						temp0[half[half.length-1]][1]=end;
						half.length--;
					}
				}
			}
			if(endStr=="") {
				if (start != -1 && end == -1) {
					end = origiArr.length - 1;
					var temp = [start, end];
					temp0[temp0.length] = temp.concat();
				}
			}
			var tempRe=new Array();
			var last=-1;
			for(var a=0;a<temp0.length;a++){
				if(temp0[a][1]>last){
					tempRe[tempRe.length]=temp0[a];
					last=temp0[a][1];
				}
			}
			return tempRe;
		}
		function trim(str){ //删首尾空
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
		return ecode;
	}
}
function EcodeCopyCode(a){
	var eleP=a.parentElement.parentElement;
	if(eleP.querySelector(".origiData").style.display=="block"){
		eleP.querySelector(".origiData").style.display="none";
		a.innerHTML="复制代码";
	}
	else{
		eleP.querySelector(".origiData").style.display="block";
		a.innerHTML="恢复视图";
	}
}
function EcodeSetCode(ele,data){
	ele.innerHTML=data;
	ele.setAttribute("status","");
}