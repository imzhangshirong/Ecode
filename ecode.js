//----------------------------------------------------------//
//*                            Ecode 2.1                            *//
//*       Created by zhangshirong  - J.A.I.S        *//
//----------------------------------------------------------//
var color_sys_command="#0000FF";
var color_sys_command_ignore="#EFEFEF";
var color_sys_flowline="#808080";
var color_sys_flowline_ignore="#EFEFEF";
var color_assembly="#000080"
var color_function="#000080";
var color_dll_command="#800000";
var color_custom_datatype="#000080";
var color_constant="#000080";
var color_constant_value="#800000";
var color_datatype="#0000FF";
var color_remark="#008000";

var color_code_number="#800000";
var color_code_array="#000080";
var color_code_quto="#008080";
var color_code_bracket="#000080";
var color_code_brace="#000080";
var color_code_constant="#000080";
var color_code_command="#800000";
//目前的调用方法
function trans(head_div_id){//head_div_id_ecode_1/2/3...
	var p_a=-1,n=0,htmldata="",datacode="",div_code_name="";
	htmldata=document.getElementById(head_div_id).innerHTML;
	p_a=htmldata.indexOf(head_div_id+"_ecode_",p_a+1);
	while(p_a!=-1){
		n=n+1;
		div_code_name=head_div_id+"_ecode_"+n.toString();
		datacode=document.getElementById(div_code_name).innerHTML;
		ecode(datacode,div_code_name);
		p_a=htmldata.indexOf(head_div_id+"_ecode_",p_a+1);
	}
}
//复制操作按钮
function ecode_copydata(divid){ 
	document.getElementById("data_"+divid).style.display = "block";
	document.getElementById("codearea_"+divid).style.display = "none";
	document.getElementById("copy_button_"+divid).href="javascript:ecode_copydata_('"+divid+"')";
	document.getElementById("copy_button_"+divid).innerHTML="恢复视图";
}
function ecode_copydata_(divid){ 
	document.getElementById("data_"+divid).style.display = "none";
	document.getElementById("codearea_"+divid).style.display = "block";
	document.getElementById("copy_button_"+divid).href="javascript:ecode_copydata('"+divid+"')";
	document.getElementById("copy_button_"+divid).innerHTML="复制代码";
}
//画代码
function ecode(data,divid){
	var temp="",temp_="",temp_r="",out="",headtext="";
	var p_a=-1,p_b=-1,a=0,b=0,t=-1,m_c=0;
	var all_sys=0,sys_line="",x=0,y=1;
	var y_sys_s=new Array();
	var y_sys_e=new Array();
	var y_sys_l=new Array();
	var data_=data;
	linetext=data_.split('\n');
	for (a=0;a<linetext.length;a++){
		headtext=(linetext[a]);
		p_a=headtext.indexOf(" ");
		headtext=headtext.substr(0,p_a);
		temp=linetext[a].substr(p_a);
		temp.replace(/[ ]/g,"");
		if(headtext==".程序集"){
			y+=20+1;
			linecode=temp.split(",");
			out+="<table class='e_code_tab'  style='margin-bottom:10px'><tr class='e_code_type_col'><td>程序集名</td><td>保留</td><td>保留</td><td>备注</td></tr><tr class='e_code_type_col_content'>";
			y+=20+1+1+10;
				for (b=0;b<linecode.length;b++){
					if(b==0){out+="<td style='color:"+color_function+"'>";}
					else if(b==3){out+="<td style='color:"+color_remark+"'>";}
					else{out+="<td>";}
					if(linecode[b]!=undefined){
						out+=linecode[b]+"</td>";
					}
					else{out+="</td>";}
				}
				for (b=0;b<4-linecode.length;b++){out+="<td></td>";}
				out+="</tr>"
				t=0;
		}
		else if(headtext==".程序集变量"){
			y+=20+1;
			linecode=temp.split(",");
			if(t==0){
				out+="<tr class='e_code_type_col'><td>变量名</td><td>类型</td><td>数组</td><td>备注</td></tr><tr class='e_code_type_col_content'>";
				y+=20+1;
			}
			else{out+="<tr class='e_code_type_col_content'>"}
			m_blank=0;
			for (b=0;b<linecode.length;b++){
				if(b==2){m_blank=1;}
				else{
					if(b==1){out+="<td style='color:"+color_datatype+"'>";}
					else if(b==4){out+="<td style='color:"+color_remark+"'>";}
					else{out+="<td>";}
					if(b==3){linecode[b]=linecode[b].replace(/["]/g,"");}
					if(linecode[b]!=undefined){
						out+=linecode[b]+"</td>";
					}
					else{out+="</td>";}
				}
			}
			for (b=0;b<4-linecode.length+m_blank;b++){out+="<td></td>";}
			out+="</tr>"
			t=1;
		}
		else if(headtext==".子程序"){
			y+=20+1;
			linecode=temp.split(",");
			out+="</table>";
			out+="<table class='e_code_tab' style='margin-bottom:5px;margin-top:5px;'><tr class='e_code_type_col'><td>子程序名</td><td>返回值类型</td><td>公开</td><td colspan='3'>备注</td></tr><tr class='e_code_type_col_content'>";
			y+=20+1+5+5;
			for (b=0;b<linecode.length;b++){
				if(b==0){out+="<td style='color:"+color_function+"'>";}
				else if(b==1){out+="<td style='color:"+color_datatype+"'>";}
				else if(b==3){out+="<td style='color:"+color_remark+"' colspan='3'>";}
				else{out+="<td>";}
				if(linecode[b]!=undefined){
					if(b==2&trim(linecode[b])!=""){out+="√</td>";}
					else{out+=linecode[b]+"</td>";}
				}
				else{out+="</td>";}
			}
			for (b=0;b<4-linecode.length;b++){
				if(b==4-linecode.length-1){out+="<td colspan='3'>";}else{out+="<td>"}
				out+="</td>";
			}
			out+="</tr>";
			t=2;
		}
		else if(headtext==".DLL命令"){
			y+=20+1;
			temp_="";
			linecode=temp.split(",");
			out+="</table>";
			temp="<table class='e_code_tab' style='margin-bottom:10px'><tr class='e_code_type_col'><td>Dll命令名</td><td>返回值类型</td><td>公开</td><td colspan='2'>备注</td></tr><tr class='e_code_type_col_content'>";
			y+=10+20+1;
			for (b=0;b<linecode.length;b++){
				if(b==0){temp+="<td style='color:"+color_function+"'>"+linecode[b]+"</td>";}
				else if(b==1){temp+="<td style='color:"+color_datatype+"'>"+linecode[b]+"</td>";}
				else if(b==2){
					linecode[b]=linecode[b].replace(/["]/g,"");
					temp_+="</tr><tr class='e_code_type_col'><td colspan='5'>库文件名</td></tr><tr class='e_code_type_col_content'><td colspan='5' style='color:"+color_dll_command+"'>"+linecode[b]+"</tr>";
					y+=20+20+1+1;
				}
				else if(b==3){
					linecode[b]=linecode[b].replace(/["]/g,"");
					temp_+="<tr class='e_code_type_col'><td colspan='5'>在库中对应的命令名</td></tr><tr class='e_code_type_col_content'><td colspan='5' style='color:"+color_dll_command+"'>"+linecode[b]+"</tr>";
					y+=20+20+1+1;
				}
				else if(b==4){
					temp+="<td>"+linecode[b]+"</td>";
				}
				else if(b==5){
					temp+="<td colspan='2' style='color:"+color_remark+"'>"+linecode[b]+"</td>";
				}
			}
			if(linecode.length<=4){temp+="<td></td>";}
			if(linecode.length<=5){temp+="<td colspan='2'></td>";}
			out+=temp+temp_;
			out+="</tr><tr class='e_code_type_col'><td>参数名</td><td>类型</td><td>传址</td><td>数组</th><td>备注</td></tr>"
			y+=20+1;
			t=2;
		}
		else if(headtext==".参数"){//子程序参数
			y+=20+1;
			linecode=temp.split(",");
			if(t!=3){
				out+="<tr class='e_code_type_col'><td>参数名</td><td>类型</td><td>参考</td><td>可空</td><td>数组</td><td>备注</td></tr><tr class='e_code_type_col_content'>";
				y+=20+1+1;
			}
			else{out+="<tr class='e_code_type_col_content'>";}
			m_c=0;
			for (b=0;b<linecode.length;b++){
				if(b==1){out+="<td style='color:"+color_datatype+"'>";}
				else if(b==3){out+="<td style='color:"+color_remark+"'>";}
				else{out+="<td>";}
				if(b==2){
					linecode[b]=trim(linecode[b]);
					if(linecode[b]=="参考"){out+="√</td><td></td><td></td>"}
					else if(linecode[b]=="可空"){out+="</td><td>√</td><td></td>"}
					else if(linecode[b]=="数组"){out+="</td><td></td><td>√</td>"}
					else if(linecode[b]=="参考 可空"){out+="√</td><td>√</td><td></td>"}
					else if(linecode[b]=="可空 数组"){out+="</td><td>√</td><td>√</td>"}
					else if(linecode[b]=="参考 数组"){out+="√</td><td></td><td>√</td>"}
					else if(linecode[b]=="参考 可空 数组"){out+="√</td><td>√</td><td>√</td>"}
					else{out+="</td><td></td><td></td>"}
					m_c=2
				}
				else{
					if(linecode[b]!=undefined){
						out+=linecode[b]+"</td>";
					}
					else{out+="</td>";}
				}
			}
			for (b=0;b<6-linecode.length-m_c;b++){out+="<td></td>";}
			out+="</tr>";
			t=3;
		}
		else if(headtext==".局部变量"){//子程序变量
			y+=20+1;
			linecode=temp.split(",");
				if(t!=4){
					out+="</table><table class='e_code_tab' style='margin-bottom:2px;'><tr class='e_code_type_col'><td>变量名</td><td>类型</td><td>静态</td><td>数组</td><td>备注</td></tr><tr class='e_code_type_col_content'>";
					y+=20+1+1+2;
				}
				else{out+="<tr class='e_code_type_col_content'>";}
				for (b=0;b<linecode.length;b++){
					if(b==3){linecode[b]=linecode[b].replace(/["]/g,"");}
					if(b==1){out+="<td style='color:"+color_datatype+"'>";}
					else if(b==4){out+="<td style='color:"+color_remark+"'>";}
					else{out+="<td>";}
					if(linecode[b]!=undefined){
						if(b==2){if(trim(linecode[b])!=""){out+="√</td>";}else{out+=linecode[b]+"</td>";}}
						else{out+=linecode[b]+"</td>";}
					}
					else{out+="</td>";}
				}
				for (b=0;b<5-linecode.length;b++){out+="<td></td>";}
				out+="</tr>";
				t=4;
		}
		else if(headtext==".数据类型"){
			y+=20+1;
			linecode=temp.split(",");
			out+="</table>"
			if(t!=5){
				out+="<table class='e_code_tab' style='margin-bottom:10px'><tr class='e_code_type_col'><td>数据类型名</td><td>公开</td><td colspan='3'>备注</td></tr><tr class='e_code_type_col_content'>";
				y+=20+10+1;
			}
			else{out+="<tr class='e_code_type_col_content'>"}
			for (b=0;b<linecode.length;b++){
				if(b==0){out+="<td style='color:"+color_custom_datatype+"'>"}
				else if(b==2){out+="<td colspan='3' style='color:"+color_remark+"'>"}
				else{out+="<td>";}
				if(linecode[b]!=undefined){
					if(b==1){if(trim(linecode[b])!=""){out+="√</td>";}else{out+=linecode[b]+"</td>";}}
					else{out+=linecode[b]+"</td>";}
				}
				else{out+="</td>";}
			}
			for (b=0;b<3-linecode.length;b++){
				if(b+linecode.length==2){out+="<td colspan='3'></td>";}
				else{out+="<td></td>";}
			}
			out+="</tr><tr class='e_code_type_col'><td>成员名</td><td>类型</td><td>传址</td><td>数组</th><td>备注</td></tr>";
			y+=20+1;
			t=5;
		}
		else if(headtext==".常量"){
			y+=20+1;
			linecode=temp.split(",");
			if(t!=6){
				out+="<table class='e_code_tab' style='margin-bottom:5px'><tr class='e_code_type_col'><td>常量名称</td><td>常量值</td><td>公开</td><td>备注</td></tr><tr class='e_code_type_col_content'>";
				y+=20+1+5;
			}
			else{out+="<tr class='e_code_type_col_content'>";}
			for (b=0;b<linecode.length;b++){
				if(b==1){linecode[b]=linecode[b].replace(/["]/g,"");}
				if(b==0){out+="<td style='color:"+color_constant+"'>"}
				else if(b==1){out+="<td style='color:"+color_constant_value+"'>"}
				else if(b==3){out+="<td style='color:"+color_remark+"'>";}
				else{out+="<td>"}
				if(linecode[b]!=undefined){
					if(b==2){if(trim(linecode[b])!=""){out+="√</td>";}else{out+=linecode[b]+"</td>";}}
					else{out+=linecode[b]+"</td>";}
				}
				else{out+="</td>";}
			}
			for (b=0;b<4-linecode.length;b++){out+="<td></td>";}
			out+="</tr>";
			t=6;
		}
		else if(linetext[a]!=""){
			temp=linetext[a].substr(0,7);
			temp_=temp;
			if(temp=="    .参数"||temp=="    .成员"){//Dll参数，数据类型成员
				y+=20+1;
				temp=linetext[a].substr(8);
				linecode=temp.split(",");
				out+="<tr class='e_code_type_col_content'>";
				m_c=0;
				for (b=0;b<linecode.length;b++){
					if(b==1){out+="<td style='color:#0000FF'>";}
					else if(b==3){if(temp_=="    .参数"){out+="<td style='color"+color_remark+"'>";}else{out+="<td>"}}
					else if(b==4){out+="<td style='color:"+color_remark+"'>";}
					else{out+="<td>"}
					if(linecode[b]!=undefined){
						linecode[b]=trim(linecode[b]);
						if(temp_=="    .参数"){
							if(b==2){
								if(linecode[b]=="传址"){out+="√</td><td></td>"}
								else if(linecode[b]=="数组"){out+="</td><td>√</td>"}
								else if(linecode[b]=="传址 数组"){out+="√</td><td>√</td>"}
								else{out+="</td><td></td>"}
								m_c=1;
							}
							else{out+=linecode[b]+"</td>";}
						}
						else{
							if(b==3){out+=linecode[b].replace(/["]/g,"")+"</td>";}
							else if(b==2){if(linecode[b]!=""){out+="√</td>";}else{out+="</td>"}}
							else{out+=linecode[b]+"</td>";}
						}
					}
					else{out+="</td>";}
				}
				
				for (b=0;b<5-m_c-linecode.length;b++){out+="<td></td>";}
				out+="</tr>";
			}
			else {//代码区域
				temp_="";
				temp=trim(linetext[a]);
				if(temp.substr(0,1)=="."){//处理系统流程命令
					p_a=temp.indexOf("(");
					p_b=linetext[a].indexOf(".");
					_blank=linetext[a].slice(0,p_b);
					if(p_a==-1){p_a=temp.length;wm=1}else{wm=0;}
					temp=trim(temp.slice(1,p_a));
					temp_r=temp
					if(temp=="如果真"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="如果真结束"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10-1).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed "+color_sys_flowline_ignore+";margin-right:4px'></div>";
						x+=24;
					}
					else if(temp=="判断开始"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
						temp_r="判断"
					}
					else if(temp=="默认"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]+20-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=24;
						temp_r="";
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="判断结束"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-1).toString()+"px;width:7px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10).toString()+"px;left:"+(y_sys_l[all_sys]*24-x+12).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=12;
						
					}
					else if(temp=="如果"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="否则"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]+20-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=24;
						temp_r="";
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="如果结束"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-1).toString()+"px;width:7px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10).toString()+"px;left:"+(y_sys_l[all_sys]*24-x+12).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=12;
						
					}
					else if(temp=="计次循环首"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="计次循环尾"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10-1).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=24;
					}
					else if(temp=="判断循环首"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="判断循环尾"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10-1).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed "+color_sys_flowline+";margin-right:4px'></div>";
						x+=24;
					}
					else if(temp=="变量循环首"){
						y_sys_s[all_sys]=y;
						y_sys_e[all_sys]=y;
						y_sys_l[all_sys]=_blank.length/4;
						all_sys++;
					}
					else if(temp=="变量循环尾"){
						all_sys--;
						y_sys_e[all_sys]=y;
						sys_line+="<div style='height:"+(y_sys_e[all_sys]-y_sys_s[all_sys]-2).toString()+"px;width:19px;float:left;position:relative;top:"+(y_sys_s[all_sys]+10-1).toString()+"px;left:"+(y_sys_l[all_sys]*24-x).toString()+"px;border-left:1px dashed "+color_sys_flowline+";border-top:1px dashed "+color_sys_flowline+";border-bottom:1px dashed"+color_sys_flowline+";margin-right:4px'></div>";
						x+=24;
					}
					if(temp.indexOf("版本")==-1&&temp.indexOf("支持库")==-1){
						if(temp.substr(temp.length-1,1)==" "){temp=temp.slice(0,temp.length-1);}
						p_a=linetext[a].indexOf("(");
						if(p_a==-1){p_a=linetext[a].length-1}
						temp_=linetext[a].substr(p_a+1)
						temp_=linetext[a].slice(_blank.length+1+temp.length,p_a+1).replace(/[ ]/g,"&nbsp;")+ecode_highlight(temp_)
						if(wm==1){linetext[a]="<div class='e_code_tab_width' style='width:"+((_blank.length+4)*6).toString()+"px'></div>"+temp_r.fontcolor(color_sys_command_ignore)+temp_;}
						else{linetext[a]="<div class='e_code_tab_width' style='width:"+((_blank.length+4)*6).toString()+"px'></div>"+temp_r.fontcolor(color_sys_command)+temp_;}
						temp=linetext[a];
					}
					else{temp=""}
				}
				else{temp=ecode_highlight(linetext[a]);}
				if(t>=0){out+="</table>";t=-1;}
				if(temp!=""){out+="<div class='e_code_codeline'>"+temp+"</div>";y+=18;}
			}
		}
	}
	if(t>=0){out+="</table>";t=-1;}//结束表格
	out="<div class='e_code_e_code'><div class='e_code_copy'><div class='e_code_copy_button'> <a id='copy_button_"+divid+"' href=javascript:ecode_copydata('"+divid+"')>复制代码</a></div></div><div id='data_"+divid+"' class='e_code_data'><textarea readonly='readonly' class='e_code_copy_codedata' style='padding:15px;' id='codedata_"+divid+"' class='e_code_codedata'>"+data+"</textarea></div><div class='e_code_codecontainer'><div class='e_code_codearea' id='codearea_"+divid+"' style='height:"+(y).toString()+"px;width:100%'>"+out+"<div style='height:"+y.toString()+"px;float:left;clear:left;position:relative;top:-"+y.toString()+"px;'>"+sys_line+"</div></div></div></div>";
	document.getElementById(divid).innerHTML=out;
	//document.getElementById("result").value=out;//测试
}
//高亮代码
function ecode_highlight(codeline){
	var illstr=";,;.;];); ;};+;-;*;/;\;=;|;>;<;[;{;(;",numstr="0123456789",all_num=-1,all_num_=-1;
	var p_a=-1,p_b=-1,p_c=-1,p_d=-1,temp_="",e=0,temp_1="",k=0,k_=0;
	var temp=codeline
	var num_s=new Array();
	var num_e=new Array();
	//高亮#常量
	p_a=temp.indexOf("#");
	while(p_a!=-1){
		p_b=-1;
		for(e=p_a;e<temp.length;e++){
			if(illstr.indexOf(";"+temp.substr(e,1)+";")!=-1){p_b=e;break;}
		}
		if(p_b==-1){p_b=temp.length}
		if(!inquto(temp,p_a)){
			p_c=temp.lastIndexOf("'",p_a)
			if(inquto(temp,p_c)||p_c==-1){
				temp_=temp.slice(p_a,p_b)
				temp_=temp_.fontcolor(color_code_constant)
				temp=temp.slice(0,p_a)+temp_+temp.substr(p_b);
				p_a=temp.indexOf("#",p_a+1+temp_.length);
			}
			else{break}
		}
	}
	//高亮数字
	p_b=-1;p_a=-1;
	for(e=0;e<temp.length;e++){
		if(numstr.indexOf(temp.charAt(e))!=-1&&k==0){
			if(temp.charAt(e-1)=="#"||illstr.indexOf(temp.charAt(e-1))==-1){k_=1}
			else {num_s[all_num+1]=e;
			num_e[all_num+1]=-1;}
			p_a=e;k=1;
		}
		else if(numstr.indexOf(temp.charAt(e))==-1&&k==1){
			if(k_==0){
				all_num++;
				num_s[all_num]=p_a;
				num_e[all_num]=e;}
			k_=0;
			k=0;
		}
	}
	if(num_e[all_num+1]==-1){all_num++}
	for(e=all_num;e>=0;e--){
		p_a=num_s[e]
		p_b=num_e[e]
		if(p_b==-1){p_b=temp.length}
		if(!inquto(temp,p_a)){
			p_c=temp.lastIndexOf("'",p_a)
			if(inquto(temp,p_c)||p_c==-1){
				temp_=temp.slice(p_a,p_b)
				temp=temp.slice(0,p_a)+temp_.fontcolor(color_code_number)+temp.substr(p_b);
			}
		}
	}
	//高亮数组
	temp=ecode_highlight_pair(temp,"[",color_code_array);
	temp=ecode_highlight_pair(temp,"]",color_code_array);
	//高亮{}字节集
	temp=ecode_highlight_pair(temp,"{",color_code_brace);
	temp=ecode_highlight_pair(temp,"}",color_code_brace);
	//高亮命令
	p_b=-1;
	p_a=temp.indexOf('(',p_b);
	while(p_a!=-1){
		p_c=p_a;
		p_b=p_a;
		for(e=p_a-1;e>0;e--){
			if(temp.substr(e,1)==" "){p_b--}
			else{break}
		}
		p_a=0;
		for(e=p_b-1;e>0;e--){
			if(illstr.indexOf(";"+temp.substr(e,1)+";")!=-1){p_a=e+1;break;}
		}

		if(!inquto(temp,p_b)){
			p_c=temp.lastIndexOf("'",p_a)
			if(inquto(temp,p_c)||p_c==-1){
				temp_=temp.slice(p_a,p_b)
				if(temp_=="返回"||temp_=="跳出循环"||temp_=="到循环尾"||temp_=="结束"){temp_=temp_.fontcolor(color_sys_command);}
				else{temp_=temp_.fontcolor(color_code_command);}
				temp=temp.slice(0,p_a)+temp_+temp.substr(p_b);
			}
		}
		p_b=temp.indexOf("(",p_a);
		p_a=temp.indexOf("(",p_b+1);
	}
	//高亮引号内容
	p_b=-1;
	p_a=temp.indexOf('“',p_b);
	while(p_a!=-1){
		p_b=temp.indexOf("”",p_a);
		p_c=temp.lastIndexOf("'",p_a)
			if(inquto(temp,p_c)||p_c==-1){
				temp_=temp.slice(p_a,p_b+1).replace(/[ ]/g,"&nbsp;");
				temp_=temp_.fontcolor(color_code_quto);
				temp=temp.slice(0,p_a)+temp_+temp.substr(p_b+1);
				p_a=temp.indexOf("“",p_a);
				p_b=temp.indexOf("”",p_a);
				p_a=temp.indexOf("“",p_b+1);
			}
			else{break}
	}
		//高亮()
	temp=ecode_highlight_pair(temp,"(",color_code_bracket);
	temp=ecode_highlight_pair(temp,")",color_code_bracket);
	p_a=temp.indexOf("'");
	while(p_a!=-1){
		if(!inquto(temp,p_a)){
			temp_=temp.substr(p_a).replace(/[ ]/g,"&nbsp;");
			temp_=temp_.fontcolor(color_remark);
			temp=temp.slice(0,p_a)+temp_
			break;
		}
		p_a=temp.indexOf("'",p_a+1);
	}
	temp_=trim(temp)
	p_a=temp.indexOf(temp_)
	//temp_1=temp.slice(0,p_a).replace(/[ ]/g,"&nbsp;")
	temp_1="<div class='e_code_tab_width' style='width:"+(temp.slice(0,p_a).length*6).toString()+"px'></div>"
	temp=temp_1+temp_
	return temp;
}
function ecode_highlight_pair(data,str,color){
	var temp=data,temp_="";
	var p_a=temp.indexOf(str);
	var p_c=-1;
	while(p_a!=-1){
		if(!inquto(temp,p_a)){
			p_c=temp.lastIndexOf("'",p_a)
			if(inquto(temp,p_c)||p_c==-1){
				temp_=str.fontcolor(color)
				temp=temp.slice(0,p_a)+temp_+temp.substr(p_a+1);
				p_a=temp.indexOf(str,p_a);
			}
		}
		p_a=temp.indexOf(str,p_a+1);
	}
	return temp;
}
//删首尾空
function trim(string){ 
var i=0;
	str=string;
	for(i=0;i<str.length; i++) { 
		if(str.charAt(i)!=" "){break}; 
	} 
	str = str.substring(i,str.length); 
	for(i=str.length-1;i>=0; i--) { 
		if(str.charAt(i)!=" "){break}; 
	} 
	str = str.slice(0,i+1); 
	return str; 
} 
//是否在引号内
function inquto(text,p){
	var p_c,p_d;
	if(p==-1){return 0}
	p_c=text.lastIndexOf("“",p)
		if(p_c==-1){p_c=text.length}
		p_d=text.indexOf("”",p_c)
		if(p_c<p&&p<p_d){return 1}
		else{return 0}
}