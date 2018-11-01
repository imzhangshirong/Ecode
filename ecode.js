//-------------------------------------------------------------//
//*                           Ecode 3.5.10                    *//
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
			{origi:".循环判断尾",replace:"<span class='sysCommand'>循环判断尾</span>"}
		];
		var sysCom=[
			"返回",
			"跳出循环",
			"到循环尾",
			"结束"
		];
		var sysCom2=[
			"或",
			"且"
		];
		var sysSta=[
			"真",
			"假"
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
					var origiData_copy=eleEcode[a].innerHTML;
					origiData=origiData.replace(/</g,"&lt;");
					origiData=origiData.replace(/>/g,"&gt;");
					eleEcode[a].innerHTML="<p>Loading...</p>"
					var lineCodes=origiData.split("\n");
					var b;
					for(b=0;b<lineCodes.length;b++) {
						var temp = new Object();
						if (trim(lineCodes[b]).substr(0, 1) == ".") {
							var tableCode = lineCodes[b].split(",");
							for (var c = 0; c < tableCode.length; c++) {
								tableCode[c] = tableCode[c];
							}
							tableCode[0]=trim(tableCode[0])
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

					var allHTML="<div class='controller'><span class='desc'>"+eleEcode[a].getAttribute("desc")+"</span><a class='copy' href='javascript:' onclick='EcodeCopyCode(this)'>复制代码</a></div><div class='show'>"+html+"</div></div><div" +
						" class='origiData'><textarea>"+origiData_copy+"</textarea></div>";
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
					eleEcodeShow.style.width=window.screen.availWidth+"px";
					//处理高度//////////////////////////////////////
					for(var b=0;b<eleEcodeUl.length;b++){
						var parent=eleEcodeUl[b];
						if(parent.children[2].children[0].className.indexOf("cycle")==-1){
							var def=0;
							var close=parent.children.length-1;
							var all=new Array();
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
							if(def==3){
								parent.children[2].style.marginBottom="20px";
							}
							if(def+1==close){
								parent.children[def].style.marginBottom="20px";
							}
							if(parent.children[close-1].children[0].tagName=="UL" ){
								if(parent.children[close-1].children[0].children[2] && parent.children[close-1].children[0].children[2].children[0].className.indexOf("cycle")==-1)parent.children[close].style.height="20px";
							}
							var parentNext;
							if(parent.parentElement && parent.parentElement.nextElementSibling){
								parentNext=parent.parentElement.nextElementSibling;
							}
							if(parent==parentNext)parentNext=null;
							if(parentNext){
								if(parentNext.querySelector(".def") && parentNext.children[0]==parentNext.querySelector(".def").parentElement){
									parent.children[close].style.marginBottom="20px";
								}
								if(parentNext.querySelector(".judgeChild") && parentNext.children[0]==parentNext.querySelector(".judgeChild").parentElement){
									parent.children[close].style.marginBottom="20px";
								}
							}
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
						if(parentLast && parentLast.querySelector(".def") && parentLast.children[0] && parentLast.children[0].children[0]==parentLast.querySelector(".def")){
							turn0=1;
						}
						var parentNext=parent.parentElement.nextElementSibling;
						if(parentNext==parent){
							parentNext=null;
						}
						var turn1=0;
						if(parentNext && parentNext.querySelector(".def") && parentNext.children[0] && parentNext.children[0].children[0]==parentNext.querySelector(".def")){
							turn1=1;
						}
						if(parentNext && parentNext.querySelector(".judgeChild") && parentNext.children[0] && parentNext.children[0].children[0]==parentNext.querySelector(".judgeChild")){
							turn1=1;
						}
						var add=turn0*5;
						var add_=turn1*5;
						var line1=parent.children[0];
						line1.style.top=10+add+"px";
						line1.style.height=parent.clientHeight-20-add-add_+"px";
						line1.querySelector(".triangle-right").style.top="-5px";
						line1.querySelector(".triangle-right").style.display="block";
					}
					//判断预处理//////////////////////////////////////
					var judgeValueFixed=new Array();
					for(var b=0;b<eleEcodeJudge.length;b++){
						var tempData=new Object();
						var parent=eleEcodeJudge[b].parentElement.parentElement;
						var parentLast;
						if(parent.parentElement.previousElementSibling){
							parentLast=parent.parentElement.previousElementSibling.children[0];
						}
						var parentNext;
						if(parent.parentElement.nextElementSibling){
							parentNext=parent.parentElement.nextElementSibling.children[0];
						}
						if(parentNext==parent)parentNext=null;
						var turn0=0;
						var turn1=0;
						var turn2=0;
						var turn3=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.querySelector(".sysCommand").className.indexOf("cycle")==-1 && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
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
						var close=parent.children.length-1;
						if(parent.parentElement.previousElementSibling){
							var defLastSys=parent.parentElement.previousElementSibling;
							if(defLastSys.children[0] && defLastSys.children[0].children[0]==defLastSys.querySelector(".def") && defLastSys.tagName=="LI"){
								turn0=1;
							}
						}
						var defNextSys=parent.children[def].nextElementSibling.querySelector(".sysCommand");
						var defPrevSys=parent.children[def].previousElementSibling.querySelector(".sysCommand");
							if(defNextSys){
							if(parent.children[def].nextElementSibling==defNextSys.parentElement.parentElement.parentElement){
								turn2=1;
							}
						}
						if(defPrevSys){
							if(parent.children[def].previousElementSibling==defPrevSys.parentElement.parentElement.parentElement){
								if(defPrevSys.className.indexOf("cycle")>-1)turn3=1;
							}
						}
						var add=turn0*4;
						var line1_;
						var line2_;
						var line3_;
						tempData['parent']=parent;
						tempData['turn0']=turn0;
						tempData['turn1']=turn1;
						tempData['turn2']=turn2;
						tempData['turn3']=turn3;
						tempData['def']=def;
						tempData['add']=add;
						tempData['all']=all;
						judgeValueFixed[judgeValueFixed.length]=tempData;
						if(all[0] && all[0]-2==1){
							parent.children[2].style.marginBottom="20px";
						}
						for(var c=0;c<all.length;c++){
							line1_=parent.children[all[c]].children[0].children[0].children[0];
							line2_=parent.children[all[c]].children[0].children[0].children[1];
							line3_=line1_.children[2];
							line1_.style.top=10+4+"px";
							line1_.style.left=-18+"px";
							var temp=0;
							if(c+1==all.length){
								if(def-all[c]==1){
									parent.children[all[c]].style.marginBottom="20px";
								}
								temp=parent.children[def].offsetTop+4;
							}
							else{
								if(all[c+1]-all[c]==1){
									parent.children[all[c]].style.marginBottom="20px";
								}
								temp=parent.children[all[c+1]].offsetTop;
							}
						}
						if(parentNext && parentNext.children[0] && (parentNext.children[0].className.indexOf("judgeChild") > 0 || parentNext.children[0].className.indexOf("def") > 0)) {
							parent.children[close].style.marginBottom = "20px";
						}
					}
					//如果真预处理//////////////////////////////////////
					var ifTrueValueFixed=new Array();
					for(var b=0;b<eleEcodeIfTrue.length;b++){
						var tempData=new Object();
						var parent=eleEcodeIfTrue[b].parentElement.parentElement;
						if(parent.parentElement.previousElementSibling){
							parentLast=parent.parentElement.previousElementSibling.children[0];
						}
						var parentNext;
						if(parent.parentElement.nextElementSibling){
							parentNext=parent.parentElement.nextElementSibling.children[0];
						}
						if(parentNext==parent)parentNext=null;
						var turn0=0;
						var turn1=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.querySelector(".sysCommand").className.indexOf("cycle")==-1 && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentLast && parentLast.children[2] && parentLast.querySelector(".def") && parentLast.querySelector(".def").parentElement==parentLast.children[2]){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
						var add=turn0*4;
						tempData['parent']=parent;
						tempData['turn0']=turn0;
						tempData['turn1']=turn1;
						tempData['add']=add;
						ifTrueValueFixed[ifTrueValueFixed.length]=tempData;
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
						if(parentNext==parent)parentNext=null;
						var turn0=0;
						var turn1=0;
						var turn2=0;
						var turn3=0;
						if(parentLast && parentLast.querySelector(".sysCommand") && parentLast.querySelector(".sysCommand").className.indexOf("cycle")==-1 && parentLast.children[2] && parentLast.children[2]==parentLast.querySelector(".sysCommand").parentElement ){
							turn0=1;
						}
						if(parentNext && parentNext.querySelector(".sysCommand") && parentNext.children[2] && parentNext.children[2] ==parentNext.querySelector(".sysCommand").parentElement){
							turn1=1;
						}
						var line1=parent.children[0];
						var line2=parent.children[1];
						var line3=parent.children[0].children[2];
						var line4=parent.children[1].children[2];
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
						var defPrevSys=parent.children[def].previousElementSibling.querySelector(".sysCommand");
						if(defNextSys){
							if(parent.children[def].nextElementSibling==defNextSys.parentElement.parentElement.parentElement){
								turn2=1;
							}
						}
						if(defPrevSys){
							if(parent.children[def].previousElementSibling==defPrevSys.parentElement.parentElement.parentElement){
								if(defPrevSys.className.indexOf("cycle")>-1)turn3=1;
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
							line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+20+parent.children[close].offsetHeight+"px";
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
						}
						else{
							line2.querySelector(".triangle-down").style.display="block";
							line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+10+parent.children[close].offsetHeight+"px";
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
						}
						if(turn2){
							line1.style.borderBottomWidth="0px";
							line1.style.height=line1.clientHeight-6+"px";
							line1.querySelector(".triangle-right").style.left="32px";
							line3.style.display="block";
						}
						if(turn3){
							line2.style.borderTopWidth="0px";
							line2.style.height=line2.clientHeight-8+"px";
							line2.style.top=parent.children[def].offsetTop-10+4+"px";
							line4.style.display="block";
						}

					}
					//计算判断流程线//////////////////////////////////////////
					for(var b=0;b<judgeValueFixed.length;b++){
						var tempData=judgeValueFixed[b];
						var parent=tempData['parent'];
						var turn0=tempData['turn0'];
						var turn1=tempData['turn1'];
						var turn2=tempData['turn2'];
						var turn3=tempData['turn3'];
						var line1=parent.children[0];
						var line2=parent.children[1];
						var line3=parent.children[0].children[2];
						var line4=parent.children[1].children[2];
						var close=parent.children.length-1;
						var all=tempData['all'];
						var def=tempData['def'];
						var add=tempData['add'];
						var line1_;
						var line2_;
						var line3_;
						if(all[0] && all[0]-2==1){
							parent.children[2].style.marginBottom="20px";
						}
						for(var c=0;c<all.length;c++){
							line1_=parent.children[all[c]].children[0].children[0].children[0];
							line2_=parent.children[all[c]].children[0].children[0].children[1];
							line3_=line1_.children[2];
							line1_.style.top=10+4+"px";
							line1_.style.left=-20+"px";
							var temp=0;

							if(c+1==all.length){
								temp=parent.children[def].offsetTop;
							}
							else{
								temp=parent.children[all[c+1]].offsetTop;
							}
							line1_.style.height=temp-parent.children[all[c]].offsetTop-10+"px";
							line1_.querySelector(".triangle-right").style.display="block";
							line1_.querySelector(".triangle-right").style.bottom="-5px";


							var temp_e=parent.children[all[c]-1].children[0].children[2];
							if(temp_e && temp_e.children[0] &&  temp_e.children[0].className.indexOf("cycle")>-1){
								line2_.style.top=line1_.offsetHeight+2+"px";
								line2_.style.width="30px";
							}
							else{
								line2_.style.top=line1_.offsetHeight-2+"px";
							}
							line2_.style.left="-12px";
							line2_.style.borderTopWidth="1px";
							line2_.style.display="block";

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
								line2.querySelector(".triangle-right").style.right="-1px";
								line2.style.borderBottomWidth="1px";
								line2.style.height=parent.children[close].offsetTop-parent.children[all[0]].offsetTop+20-6+"px";
							}
							else{
								line2.querySelector(".triangle-down").style.display="block";
								line2.style.height=parent.children[close].offsetTop-parent.children[all[0]].offsetTop+20-10-6+"px";
							}
							line2.style.top=parent.children[all[0]].offsetTop-10+"px";
							line2.style.display="block";
							if(turn2){
								line1_.style.borderBottomWidth="0px";
								line1_.style.height=line1_.offsetHeight-4+"px";
								line1_.querySelector(".triangle-right").style.left="32px";
								line3_.style.display="block";
							}
							if(turn3){
								line2.style.borderTopWidth="0px";
								line2.style.height=line2.clientHeight-2+"px";
								line2.style.top=line2.offsetTop+4+"px";
								line4.style.display="block";
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
								line2.querySelector(".triangle-right").style.right="-1px";
								line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+20-add+parent.children[close].offsetHeight+"px";

							}
							else{
								line2.querySelector(".triangle-down").style.display="block";
								line2.style.height=parent.children[close].offsetTop-parent.children[def].offsetTop+10+parent.children[close].offsetHeight+"px";
							}
							line2.style.top=parent.children[def].offsetTop-10+"px";
							line2.style.display="block";
							if(turn2){
								line1.style.borderBottomWidth="0px";
								line1.style.height=line1.clientHeight-6+"px";
								line1.querySelector(".triangle-right").style.left="34px";
								line3.style.display="block";
							}
							if(turn3){
								line2.style.borderTopWidth="0px";
								line2.style.height=line2.clientHeight-6+"px";
								line2.style.top=line2.offsetTop+6+"px";
								line4.style.display="block";
							}
						}

					}
					//计算如果真流程线//////////////////////////////////////
					for(var b=0;b<ifTrueValueFixed.length;b++){
						var tempData=ifTrueValueFixed[b];
						var parent=tempData['parent'];
						var turn0=tempData['turn0'];
						var turn1=tempData['turn1'];
						var add=tempData['add'];
						var line1=parent.children[0];
						var line2=parent.children[1];
						if(turn1){
							line1.style.top=10+add+"px";
							line1.style.height=parent.clientHeight-10+4-add+"px";
							line1.querySelector(".triangle-right").style.bottom="-5px";
							line1.querySelector(".triangle-right").style.display="block";
						}
						else{
							line1.style.display="none";
							line2.style.height=parent.children[parent.children.length-1].offsetTop+parent.children[parent.children.length-1].offsetHeight-10-add+"px";
							line2.style.top=10+add+"px";
							line2.style.left="2px";
							line2.style.width="15px";
							line2.style.display="block";
							line2.querySelector(".triangle-down").style.display="block";
						}
					}
					eleEcodeShow.style.height=eleEcodeShow.parentElement.clientHeight-40+"px";
					var eleEcodeDiv=eleEcodeShow.querySelectorAll("div");
					for(var b=0;b<eleEcodeDiv.length;b++){
						eleEcodeDiv[b].style.width=eleEcodeDiv[b].clientWidth+32+"px";
					}
					eleEcodeShow.style.width="100%";
				}
			}
		}
		function isArray(o) {
			return Object.prototype.toString.call(o) === '[object Array]';
		}
		function inQuote(quoteMat,position){
			var a;
			var k=0;
			for(a=0;a<quoteMat.length;a++){
				if(position<quoteMat[a][1] && position>quoteMat[a][0]){
					k=a+1;
					break;
				}
			}
			return k;
		}
		function drawn(origiArr){
			var html="";
			var endDivTag=0;
			for(var b=0;b<origiArr.length;b++){
				if(!isArray(origiArr[b])){
					if(origiArr[b].type==".程序集"){
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						if(trim(origiArr[b].parameter[1])=="" && trim(origiArr[b].parameter[2])==""){
							html+="<table class='assembly_table'><tr><th>程序集名</th><th>保留</th><th>保留</th><th>备注</th></tr>";
						}
						else{
							html+="<table class='assembly_table'><tr><th>类名</th><th>基类</th><th>公开</th><th>备注</th></tr>";
							origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
							if(origiArr[b].parameter[2].indexOf("公开")>-1){
								origiArr[b].parameter[2]="√";
							}
						}
						html+=tablePara(4,origiArr[b].parameter);
						lastPart=0;//程序集or类
					}
					else if(origiArr[b].type==".程序集变量"){
						if(lastPart!=0 && lastPart!=0.1){
							html+="<table class='assembly_table'><tr><th>程序集名</th><th>保留</th><th>保留</th><th>备注</th></tr>";
							lastPart=0;
						}
						if(lastPart!=0.1){
							html+="<tr><th>变量名</th><th>类型</th><th>数组</th><th>备注</th></tr>";
						}
						for(var c=2;c<origiArr[b].parameter.length-1;c++){
							origiArr[b].parameter[c]=origiArr[b].parameter[c+1];
						}
						origiArr[b].parameter.length--;
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);

						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[2]=origiArr[b].parameter[2].replace(/"/g,"");
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";

						html+=tablePara(4,origiArr[b].parameter);
						lastPart=0.1;//程序集变量
						endDivTag=1;
					}
					else if(origiArr[b].type==".子程序"){
						if(lastPart!=1){
							if(lastPart<1 && lastPart>-1){
								html+="</table>";
							}
							else if(lastPart>1 && lastPart<=2){
								html+="</table></div>";
							}
							html+="<div class='function'><table class='function_table'><tr><th>子程序名</th><th>返回值类型</th><th>公开</th><th colspan='3'>备注</th></tr>";
						}
						else{
							html+="</table></div><div class='function'><table class='function_table'><tr><th>子程序名</th><th>返回值类型</th><th>公开</th><th colspan='3'>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);
						origiArr[b].parameter[2]=trim(origiArr[b].parameter[2]);
						if(origiArr[b].parameter[2].indexOf("公开")>-1){
							origiArr[b].parameter[2]="√";
						}
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						html+=tablePara(4,origiArr[b].parameter,3,3);
						lastPart=1;//子程序
						endDivTag=1;
					}
					else if(origiArr[b].type==".参数"){
						if(lastPart==1){
							html+="<tr><th>参数名</th><th>类型</th><th>参考</th><th>可空</th><th>数组</th><th>备注</th></tr>";
						}
						else if(lastPart==3){
							html+="<tr><th>参数名</th><th>类型</th><th>传址</th><th>数组</th><th>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);
						origiArr[b].parameter[2]=trim(origiArr[b].parameter[2]);
						if(lastPart>=3 && lastPart<4){
							var temp="";
							if(origiArr[b].parameter[2].indexOf("传址")>-1){
								temp+="√";
							}
							temp+="</td><td>";
							if(origiArr[b].parameter[2].indexOf("数组")>-1){
								temp+="√";
							}
							origiArr[b].parameter[2]=temp;
							origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
							origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
							origiArr[b].parameter[2]=temp;
							html+=tablePara(4,origiArr[b].parameter);
							lastPart=3.1;
						}
						else if(lastPart>=1 && lastPart<2){
							var temp="";
							if(origiArr[b].parameter[2].indexOf("参考")>-1){
								temp+="√";
							}
							temp+="</td><td>";
							if(origiArr[b].parameter[2].indexOf("可空")>-1){
								temp+="√";
							}
							temp+="</td><td>";
							if(origiArr[b].parameter[2].indexOf("数组")>-1){
								temp+="√";
							}
							origiArr[b].parameter[2]=temp;
							origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
							origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
							html+=tablePara(4,origiArr[b].parameter);
							lastPart=1.1;
						}
						endDivTag=1;
						//子程序参数 1.1 dll参数 3.1
					}
					else if(origiArr[b].type==".局部变量"){
						if(lastPart!=2){
							html+="</table>"
							html+="<table class='variable_table'><tr><th>变量名</th><th>类型</th><th>静态</th><th>数组</th><th>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(5,origiArr[b].parameter);
						origiArr[b].parameter[2]=trim(origiArr[b].parameter[2]);
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						origiArr[b].parameter[3]=origiArr[b].parameter[3].replace(/"/g,"");
						if(origiArr[b].parameter[2].indexOf("静态")>-1){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=2;//局部变量
						endDivTag=1;
					}
					else if(origiArr[b].type==".DLL命令"){
						if(lastPart!=3){
							if(lastPart>-1)html+="</table>";
							html+="</div>";
						}
						html+="<div class='dllFunction'><table class='dllFunction_table'><tr><th>Dll命令名</th><th>返回值类型</th><th>公开</th><th colspan='2'>备注</th></tr>";
						origiArr[b].parameter=dealTablePara(6,origiArr[b].parameter);
						if(origiArr[b].parameter[4].indexOf("公开")>-1){
							origiArr[b].parameter[4]="√";
						}
						html+="<tr><td>"+origiArr[b].parameter[0]+"</td><td><span class='dataType'>"+origiArr[b].parameter[1]+"</span></td><td>"+origiArr[b].parameter[4]+"</td><td colspan='2'><span class='remark'>"+origiArr[b].parameter[5]+"</span></td></tr>";
						html+="<tr><th colspan='5'>库文件名：</th></tr>";
						html+="<tr><td colspan='5'><span class='command'>"+origiArr[b].parameter[2].replace(/"/g,"")+"</span></td></tr>";
						html+="<tr><th colspan='5'>在库中对应命令名：</th></tr>";
						html+="<tr><td colspan='5'><span class='command'>"+origiArr[b].parameter[3].replace(/"/g,"")+"</span></td></tr>";
						lastPart=3;//DLL
						endDivTag=1;
					}
					else if(origiArr[b].type==".常量"){
						if(lastPart!=4){
							if(lastPart>-1)html+="</table>";
							html+="</div>";
							html+="<div class='statics'><table class='statics_table'><tr><th>常量名称</th><th>常量值</th><th>公开</th><th>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);
						var temp=trim(origiArr[b].parameter[1].replace(/"/g,""));
						if(Number(temp)==temp && temp!=""){
							origiArr[b].parameter[1]="<span class='math'>"+temp+"</span>";
						}
						else{
							origiArr[b].parameter[1]="<span class='quote'>"+origiArr[b].parameter[1].replace(/ /g,"&nbsp;")+"</span>";
						}
						origiArr[b].parameter[0]="<span class='static'>"+origiArr[b].parameter[0]+"</span>";
						origiArr[b].parameter[3]="<span class='remark'>"+origiArr[b].parameter[3].replace(/ /g,"&nbsp;")+"</span>";
						if(origiArr[b].parameter[2].indexOf("公开")>-1){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(4,origiArr[b].parameter);
						lastPart=4;//常量
						endDivTag=1;
					}
					else if(origiArr[b].type==".数据类型"){
						if(lastPart!=5){
							if(lastPart>-1)html+="</table>";
							html+="</div>";
							html+="<div class='selfDataType'><table class='selfDataType_table'><tr><th>数据类型名</th><th>公开</th><th colspan='3'>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(4,origiArr[b].parameter);
						origiArr[b].parameter[0]="<span class='dataType'>"+origiArr[b].parameter[0]+"</span>";
						origiArr[b].parameter[2]="<span class='remark'>"+origiArr[b].parameter[2].replace(/ /g,"&nbsp;")+"</span>";
						if(origiArr[b].parameter[1].indexOf("公开")>-1){
							origiArr[b].parameter[1]="√";
						}
						html+=tablePara(3,origiArr[b].parameter,2,3);
						lastPart=5;//数据类型
						endDivTag=1;
					}
					else if(origiArr[b].type==".成员"){
						if(lastPart==5){
							html+="<tr><th>成员名</th><th>类型</th><th>传址</th><th>数组</th><th>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(5,origiArr[b].parameter);
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						origiArr[b].parameter[3]=origiArr[b].parameter[3].replace(/"/g,"");
						if(origiArr[b].parameter[2].indexOf("传址")>-1){
							origiArr[b].parameter[2]="√";
						}
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=5.1;//数据类型成员
						endDivTag=1;
					}
					else if(origiArr[b].type==".全局变量"){
						if(lastPart!=6){
							if(lastPart>-1)html+="</table>";
							html+="</div>";
							html+="<div class='globalVariable'><table class='globalVariable_table'><tr><th>全局变量名</th><th>全类型</th><th>数组</th><th>公开</th><th>备注</th></tr>";
						}
						origiArr[b].parameter=dealTablePara(5,origiArr[b].parameter);
						origiArr[b].parameter[4]="<span class='remark'>"+origiArr[b].parameter[4].replace(/ /g,"&nbsp;")+"</span>";
						var temp=origiArr[b].parameter[3];
						origiArr[b].parameter[3]=origiArr[b].parameter[2];
						origiArr[b].parameter[2]=temp;
						if(origiArr[b].parameter[3].indexOf("公开")>-1){
							origiArr[b].parameter[3]="√";
						}
						origiArr[b].parameter[2]=origiArr[b].parameter[2].replace(/"/g,"");
						origiArr[b].parameter[1]="<span class='dataType'>"+origiArr[b].parameter[1]+"</span>";
						html+=tablePara(5,origiArr[b].parameter);
						lastPart=6;//全局变量
						endDivTag=1;
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
								html+="<li><ul><o class='line1'><i class='triangle-right'></i><i class='triangle-down'></i><o class='line3'></o></o><o class='line2'><i class='triangle-down'></i><i class='triangle-right'></i><o class='line4'></o></o>";
							}
							else{
								html+="<ul><o class='line1'><i class='triangle-right'></i><i class='triangle-down'></i><o class='line3'></o></o><o class='line2'><i class='triangle-down'></i><i class='triangle-right'></i><o class='line4'></o></o>";
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
			if(endDivTag==1){
				if((lastPart >= 3 && lastPart < 4) || (lastPart >= 4 && lastPart < 5) || (lastPart >= 5 && lastPart < 6) || (lastPart >= 6))html+="</table>";
				html+="</div>";
			}
			return html;
		}
		function parseCodeLine(origiCodeStr,type){
			var codeStr=trimEnd(origiCodeStr);
			if(codeStr=="")return "";
			var str=codeStr;
			var add=0;
			//var addRemark=0;
			if(type){
				//高亮注释/////////////////////////////////
				var remark=codeStr.indexOf("'",0);
				var quote=findMatchStr("“","”",codeStr);
				while(remark>-1){
					if(remark==0)break;
					var inQ=inQuote(quote,remark);
					if(!inQ){
						break;
					}
					remark=codeStr.indexOf("'",remark+1);
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
				var compuStr="＼＝％＜＞≠≥≤＋－×÷,";
				for(var a=0;a<remark;a++){
					var p=a;
					var temp=str.substr(p,1);

					if(compuStr.indexOf(temp)>-1){
						var k=inQuote(quote,p);
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
				remark+=add;
				//高亮常量/////////////////////////////////
				add=0;
				quote=findMatchStr("“","”",codeStr);
				var statics=codeStr.indexOf("#",0);
				while(statics>-1){
					var k=0;
					if(statics<remark){
						k=inQuote(quote,statics);
					}
					else{
						k=1;
					}
					if(k==0){
						var p=new Array();
						p[p.length]=codeStr.indexOf("＋",statics);
						p[p.length]=codeStr.indexOf("－",statics);
						p[p.length]=codeStr.indexOf("×",statics);
						p[p.length]=codeStr.indexOf("÷",statics);
						p[p.length]=codeStr.indexOf("％",statics);
						p[p.length]=codeStr.indexOf("＝",statics);
						p[p.length]=codeStr.indexOf("＼",statics);
						p[p.length]=codeStr.indexOf("＜",statics);
						p[p.length]=codeStr.indexOf("＞",statics);
						p[p.length]=codeStr.indexOf(".",statics);
						p[p.length]=codeStr.indexOf(",",statics);
						p[p.length]=codeStr.indexOf("(",statics);
						p[p.length]=codeStr.indexOf(")",statics);
						p[p.length]=codeStr.indexOf("[",statics);
						p[p.length]=codeStr.indexOf("]",statics);
						p[p.length]=codeStr.indexOf("{",statics);
						p[p.length]=codeStr.indexOf("}",statics);
						p[p.length]=codeStr.indexOf("≥",statics);
						p[p.length]=codeStr.indexOf("≤",statics);
						p[p.length]=codeStr.indexOf("≠",statics);
						p[p.length]=codeStr.indexOf(" ",statics);
						//html
						p[p.length]=codeStr.indexOf("<",statics);
						p[p.length]=codeStr.indexOf(">",statics);
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
			var bracket0=findMatchStr("(",")",codeStr,true);
			for(var a=0;a<bracket0.length;a++){
				var k=0;
				if(type && bracket0[a][0]>remark){
					k=1;
				}
				if(k==0){
					var son=codeStr.substr(bracket0[a][0]+1,bracket0[a][1]-bracket0[a][0]-1);
					son=parseCodeLine(son);
					var lastStart=bracket0[a][0]-1;
					for(var b=lastStart;b>-1;b--){
						if(codeStr.substr(b,1)!=" "){
							lastStart=b;
							break;
						}
					}
					var p=new Array();
					p[p.length]=codeStr.lastIndexOf("＋",lastStart);
					p[p.length]=codeStr.lastIndexOf("－",lastStart);
					p[p.length]=codeStr.lastIndexOf("×",lastStart);
					p[p.length]=codeStr.lastIndexOf("÷",lastStart);
					p[p.length]=codeStr.lastIndexOf("％",lastStart);
					p[p.length]=codeStr.lastIndexOf("＝",lastStart);
					p[p.length]=codeStr.lastIndexOf("＼",lastStart);
					p[p.length]=codeStr.lastIndexOf("＜",lastStart);
					p[p.length]=codeStr.lastIndexOf("＞",lastStart);
					p[p.length]=codeStr.lastIndexOf(".",lastStart);
					p[p.length]=codeStr.lastIndexOf(",",lastStart);
					p[p.length]=codeStr.lastIndexOf("＝",lastStart);
					p[p.length]=codeStr.lastIndexOf("≠",lastStart);
					p[p.length]=codeStr.lastIndexOf("≥",lastStart);
					p[p.length]=codeStr.lastIndexOf("≤",lastStart);
					p[p.length]=codeStr.lastIndexOf(" ",lastStart);
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
					var len=rep.length-command.length+son.length-(bracket0[a][1]-bracket0[a][0])+1;
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
				var last=[-1,-1,-1];
				for(var a=0;a<=remark;a++){
					var p=a;
					var temp=str.substr(p,1);
					if(compuStr.indexOf(temp)>-1){
						var k=inQuote(quote,p);
						if(k==0){
							var replace=0;
							if(temp=="(" || temp==")"){
								temp="<span class='bracket0'>"+temp;
							}
							else if(temp=="[" || temp=="]"){
								var temp_=temp;
								if(temp=="]" && last[2]>-1){
									var strDate=codeStr.substr(last[2],a+add-last[2]);
									if(strDate.match(/^[\d]{4}年([\d]?[\d]{1}月)?([\d]?[\d]{1}日)?([\d]?[\d]{1}时)?([\d]?[\d]{1}分)?([\d]?[\d]{1}秒)?$/g)){
										
										temp="<span class='datetime'>"+strDate+"</span><span class='bracket1'>"+temp;
										replace=1;
									}
									last[2]=-1;
								}
								
								if(replace==0){
									temp="<span class='bracket1'>"+temp;
								}
								if(temp_=="["){
									last[2]=a;
								}
							}
							else if(temp=="{" || temp=="}"){
								temp="<span class='bracket2'>"+temp;
							}
							
							temp+="</span>";
							if(last[2]>-1){
								last[2]+=add+temp.length;
							}
							if(replace==1){
								codeStr=codeStr.substr(0,add+p-strDate.length)+temp+codeStr.substr(add+p+1);
								add+=temp.length-1-strDate.length;
							}
							else{
								codeStr=codeStr.substr(0,add+p)+temp+codeStr.substr(add+p+1);
								add+=temp.length-1;
							}
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
						var temp=rep.split(" ");
						var rep_="";
						for(var c=0;c<temp.length;c++){
							var temp_=temp[c];
							var sp=temp[c].indexOf("<");
							if(sp>-1){
								temp_=temp[c].substr(0,sp);
							}
							for(var d=0;d<sysSta.length;d++){
								if(temp_==sysSta[d]){
									temp_="<span class='logicStatic'>"+temp_+"</span>";
								}
							}
							for(var d=0;d<sysCom2.length;d++){
								if(temp_==sysCom2[d]){
									temp_="</span><span class='logic'>"+temp_+"</span><span class='var'>";
								}
							}
							rep_+=" "+temp_;
						}
						if(temp.length==0){
							rep_=rep;
						}
						if(trim(rep_)){
							rep="<span class='var'>"+rep_+"</span>";
						}
						else{
							rep="";
						}
						str=rep+str.substr(p_);
						add+=rep.length-(p_);
					}
				}
				while(p>-1 && p<remark){
					var k=inQuote(quote,p);
					if(k==0){
						var p2=codeStr.indexOf("<span",p);
						if(p2==-1){p2=codeStr.length}
						var rep=trim(codeStr.substr(p+7,p2-p-7));
						if(Number(rep)==rep && rep!=""){
							rep="<span class='math'>"+rep+"</span>";
						}
						else{
							var temp=rep.split(" ");
							var rep_="";
							for(var c=0;c<temp.length;c++){
								var temp_=temp[c];
								var sp=temp[c].indexOf("<");
								if(sp>-1){
									temp_=temp[c].substr(0,sp);
								}
								for(var d=0;d<sysSta.length;d++){
									if(temp_==sysSta[d]){
										temp_="<span class='logicStatic'>"+temp_+"</span>";
									}
								}
								for(var d=0;d<sysCom2.length;d++){
									if(temp_==sysCom2[d]){
										temp_="</span><span class='logic'>"+temp_+"</span><span class='var'>";
									}
								}
								rep_+=" "+temp_;
							}
							if(temp.length==0){
								rep_=rep;
							}
							if(trim(rep_)){
								rep="<span class='var'>"+rep_+"</span>";
							}
							else{
								rep_="";
							}
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
		function dealTablePara(cols,origiArr){
			var arr=new Array();
			var keep="";
			var keepStop=1;
			for(var c=origiArr.length;c<cols;c++){
				origiArr[c]="";
			}
			for(var c=0;c<origiArr.length;c++){
				var temp=trim(origiArr[c]);
				if(temp.substr(0,1)!='"' && temp.substr(-1)!='"'){
					if(keepStop){
						arr[arr.length]=origiArr[c];
					}
					else{
						keep+=","+origiArr[c];
					}
				}
				else{

					if(temp.substr(0,1)=='"' && temp.substr(-1)=='"' && temp.length>1){
						arr[arr.length]=origiArr[c];
						keep="";
						keepStop=1;
					}
					else{
						if(keepStop==0){
							keep+=",";
						}
						keep+=origiArr[c];
						if(keepStop==0){
							arr[arr.length]=keep;
							keep="";
							keepStop=1;
						}
						else{
							keepStop=0;
						}
					}
				}
			}
			if(keep!=""){
				arr[arr.length]=keep;
			}
			if(arr.length>cols){
				for(var c=cols;c<arr.length;c++){
					arr[cols-1]+=","+arr[c];
				}
				arr.length=cols;
			}
			for(var c=arr.length;c<cols;c++){
				arr[c]="";
			}
			return arr;
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
		function findMatchStr(startStr,endStr,origiStr,quote){
			var temp0=new Array();
			var temp1=new Array();
			var half=new Array();
			var end=-1;
			var start=origiStr.indexOf(startStr);
			if(quote){
				var p_quote=findMatchStr("“","”",origiStr);
			}
			while(start>-1){
				var k=[0,0];
				end=origiStr.indexOf(endStr,start+1);
				if(p_quote){
					for(var a=0;a<p_quote.length;a++){
						if(start<p_quote[a][1] && start>p_quote[a][0]){
							k[0]=1;
							start=origiStr.indexOf(startStr,start+1);
							end=origiStr.indexOf(endStr,start+1);
						}
						if(end<p_quote[a][1] && end>p_quote[a][0]){
							k[1]=1;
							end=origiStr.indexOf(endStr,end+1);
						}
					}
				}
				var p=origiStr.indexOf(startStr,start+1);
				if(p==-1){
					p=origiStr.length;
				}
				temp1=new Array();
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
				if(k[1]==1){
					start=origiStr.indexOf(startStr,end+1);
				}
				else{
					start=origiStr.indexOf(startStr,start+1);
				}
			}
			if(temp1[1]==-1 && origiStr.indexOf(startStr,temp1[0]+1)>-1){
				temp1[1]=origiStr.indexOf(startStr,temp1[0]+1);
				temp0[temp0.length]=temp1;
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
		function trimEnd(str){ //删尾空
			return str.replace(/(\s*$)/g, "");
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
