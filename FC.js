
var blockID = 0;
var selectedBlockID = "";
var itemsClass = "";
var listItems = []; 
var ddmItems = [];
var oldSelection = 1000;
var outputForm = [];
var textField = "";

function updateCSS() {

    $(".deleteButton").css({
    	'width': '10px',
		'height': '20px',
		'float': 'right',
		'font-weight': 'bold',
		'font-size': '12px',
		'text-decoration': 'none',
		'display': 'none'
    });
    
    $(".tfLabel").css({
		'width': '120px',
		'height': '50px',
		'float': 'left',
		'line-height': '50px',
		'vertical-align': 'center',
		'text-align': 'center'
    });
	
	$(".tfInputField").css({
		'width': '230px',
		'height': '50px',
		'float': 'left',
		'line-height': '50px',
		'vertical-align': 'center'
    });
    
    $(".ddmBlock").css({
		'margin-top': '3px',
		'margin-right': '7px',
		'margin-left': '3px',
		'width': '366px',
		'height': '50px',
		'background-color': '#FFFFFF',
		'float': 'left'
	});
	$(".ddmLabel").css({
		'width': '120px',
		'height': '50px',
		'float': 'left',
		'line-height': '50px',
		'vertical-align': 'center',
		'text-align': 'center',
		'margin-top' : '0px'
	});
					
	$(".ddmInputField").css({
		'width': '230px',
		'height': '50px',
		'float': 'left',
		'line-height': '50px',
		'vertical-align': 'center'
	});
}


function appendBlock() {
	
	blockID++;
	textField = '<li class = "block" id = "'+blockID+'" name = "Text field_Label '+blockID+'_Normal Text___false">'+
	'<div id = "label'+blockID+'" class = "tfLabel">Label '+blockID+'</div><div id = "input" class = "tfInputField">'+
	'<input class = "tfInputField'+blockID+'" type = "text" name = "text" value="" style = "height: 25px; width: 200px;"/>'+
	'</div><a href = "#" id = "delete'+blockID+'" class = "deleteButton">x</a></li>';
	var firstAd = true;
    $("ul.output").append(textField);
    updateCSS();
}

var deleted = false;

$(document).ready(function() {	
	$("#addBlock").click(function() {
		appendBlock ();
	});

	$("ul#sortable").delegate(".deleteButton", "click", function(e) {
		var parent = $(e.target).parent();
		parent.slideUp('slow', function() {$(this).remove();});
		parent.css({'background-color':'rgba(255, 0, 0, 0.55)'}).animate({ opacity: 0.0 }, "slow");	
		$(".inputType").val("0");
		$("#controlDiv").children().hide();	
		selectedBlockID = "";
		$(".inputType").prop('disabled', true);	
		deleted = true;
	});
	
	function removeHTML (type) {
	  type = type.split("_");
	  switch(type[0]) {
	  	case "Text field" : $("#ctf"+type[1]).remove();
	  	break;
	  	case "list" : $("#cl"+type[1]).remove();
	  	break;
	  } 
	  
	}
	
	$(".output").delegate(".block", "click", function(){
		
		var selectedBlock = $(this);
		
			$(".block").css("box-shadow","0 0 0 0");
			$(".liBlock").css("box-shadow","0 0 0 0");

		selectedBlockID = selectedBlock.attr("id");
		
		if(!deleted && selectedBlockID != oldSelection){
			selectedBlock.css("box-shadow","0 0 4px 1px blue");
			$(".inputType").prop('disabled', false);

			selectedBlockAttr = $("li#"+selectedBlockID+".block").attr("name");
			
			updateInputType(selectedBlockAttr);
			updateControlDiv(selectedBlockAttr);
			updateAttr(selectedBlockAttr);
			updateBlock(selectedBlockAttr);		

		} else if(!deleted) 
			selectedBlock.css("box-shadow","0 0 4px 1px blue");
		
		
		oldSelection = selectedBlockID;
		deleted = false;
		
	});
	
	$(".output").delegate(".block", "mouseenter", function(){
			$(this).css("background-color", "rgba(98, 153, 255, .1)");
			$(this).find(".deleteButton").show();
	});
	$(".output").delegate(".block", "mouseleave", function(){
			$(this).css("background-color", "#FFFFFF");
			$(this).find(".deleteButton").hide();			
	});
	
	$(function() {
		$( ".output" ).sortable();
		$( "li" ).disableSelection();
	});
	$(".inputType").change(function() {
		var str =$(".inputType").find(":selected").text();
		updateControlDiv(str);
		changeBlock(str);
		selectedBlockAttr = $("li#"+selectedBlockID+".block").attr("name");
		updateAttr(selectedBlockAttr);
		updateBlock(selectedBlockAttr);
		
		updateCSS();

	});

	$("a#create").click(function() {
		$("ul.output").children().each(function(i){
			attr = $(this).attr("name").split("_");
			switch(attr[0]) {
				case "Text field" :
				outputForm[i] = new textFieldConstructor(attr[1], attr[2], attr[3], attr[4], attr[5]);
				break;
				case "List" : outputForm[i] = buildListObject(attr);
				break;
				case "Drop Down Menu" : outputForm[i] = new selectConstructor(attr[1], attr[attr.length-1], attr.slice(3, -1));
			}
		});
		display(outputForm);
	});

	tfListener();
	liListener();
	ddmListener();

	
});

function display (output) {
	$.each(outputForm, function(){
	  	switch(this.type) {
	  		case "text" : 
	  			console.log("type: " + this.type);
				console.log("label: " + this.label);
				console.log("textType: " + this.textType);
				console.log("regex: " + this.regex);
				console.log("placeholder: " + this.placeholder);
				console.log("required: " + this.required);
				console.log(" ");
				break;
			case "select" :
				console.log("type: " + this.type);
				console.log("label: " + this.label);
				console.log("required: " + this.required);
				console.log("options: " + this.options);
				console.log(" ");
				break;
			case "checkbox" :
				console.log("type: " + this.type);
				console.log("label: " + this.label);
				console.log("checkboxes: " + this.checkboxes);
				console.log("sort: " + this.sort);
				console.log("required: " + this.required);
				console.log(" ");
				break;
			case "radio" : 
				console.log("type: " + this.type);
				console.log("label: " + this.label);
				console.log("radios: " + this.radios);
				console.log("sort: " + this.sort);
				console.log("required: " + this.required);
				console.log(" ");
				break;
			case "list" : 
				console.log("type: " + this.type);
				console.log("label: " + this.label);
				console.log("items: " + this.items);
				console.log("sort: " + this.sort);
				console.log("required: " + this.required);
				console.log(" ");
				break;
			
	  	}
	});
}

function buildListObject (attr) {
	switch(attr[2]) {
		case "Check box" : return new checkboxConstructor(attr[1], attr.slice(5, -1), attr[4], attr[attr.length-1]);
		case "Radio button" :  return new radioConstructor(attr[1], attr.slice(5, -1), attr[4], attr[attr.length-1]);
		case "Normal list" : return new normalListConstructor(attr[1], attr.slice(5, -1), attr[4], attr[attr.length-1]);
	}
  
}

function textFieldConstructor(label, textType, regex, placeholder, required) {
	this.type = "text";
	this.label = label;
	this.textType = textType;
	this.regex = regex;
	this.placeholder = placeholder;
	this.required = required;
}

function selectConstructor(label, required, options) {
	this.type = "select";
	this.label = label;
	this.options = options;
	this.required = required;
}

function radioConstructor(label, radios, sort, required) {
	this.type = "radio";
	this.label = label;
	this.radios = radios;
	this.sort = sort;
	this.required = required;
}

function checkboxConstructor(label, checkboxes, sort, required) {
	this.type = "checkbox";
	this.label = label;
	this.checkboxes = checkboxes;
	this.sort = sort;
	this.required = required;
}

function normalListConstructor(label, items, sort, required) {
	this.type = "list";
	this.label = label;
	this.items = items;
	this.sort = sort;
	this.required = required;	
}
	
function changeListSort(type) {
  if(type == "Ordered List") {
			$($("li#" + selectedBlockID + ".block").find("ul").get().reverse()).each(function() {
				$(this).replaceWith($("<ol  class = 'liInputField" + selectedBlockID + "' name = 'orderList'>" + $(this).html() + "</ol>"));
			});
			
			$($("li#" + selectedBlockID + ".block").find("li").get().reverse()).each(function() {
				$(this).css("list-style-type", "decimal-leading-zero");
			});
		}
		else if(type == "Unordered List"){
			$($("li#" + selectedBlockID + ".block").find("ol").get().reverse()).each(function() {
				$(this).replaceWith($("<ul class = 'liInputField" + selectedBlockID + "' name = 'unorderList'>" + $(this).html() + "</ul>"));
			});
			
			$($("li#" + selectedBlockID + ".block").find("li").get().reverse()).each(function() {
				$(this).css("list-style-type", "square");
			});
		}
}

function liAttr() {
		var itemsNo = $(".LiiItemsNo").val();

	  var attr = "List";
		attr += "_" + $(".LiiLabel").val();
		attr += "_" + $(".Liitype").val();
		attr += "_" + itemsNo;
		attr += "_" + $(".LiiSort").val();
		
		var val;
		listItems[selectedBlockID] = listItems[selectedBlockID] || [];
		for(var i = 1; i <= itemsNo; i++) {
			val = $("input#" + selectedBlockID + "N" + i).val();
			attr += "_" + val;
			listItems[selectedBlockID][i] = val;
		}	
		attr += "_"+ $(".LilRequired").prop("checked");
		return attr;
	}
	
function ddmAttr() {
	
	var itemsNo = $(".ddmiitemsNo").val();
  	var attr = "Drop Down Menu";
	attr += "_" + $(".ddmilabel").val();
	attr += "_" + itemsNo;
	var val;
	
	ddmItems[selectedBlockID] = ddmItems[selectedBlockID] || [];
	for(var i = 1; i <= itemsNo; i++) {
		val = $("input#" + selectedBlockID + "N" + i + ".ddm").val();
		attr += "_" + val;
		ddmItems[selectedBlockID][i] = val;
	}
	attr += "_"+ $(".DdmlRequired").prop("checked");
	return attr;
}

function ddmListener () {
  $("input.ddmilabel, .DdmlRequired").change(function() {
  	  var itemsNo = $(".ddmiitemsNo").val();
	updateBlock(ddmAttr());
	
  });
  
  $("input.ddmiitemsNo").change(function() {
  	  var itemsNo = $(".ddmiitemsNo").val();
	updateBlock(ddmAttr());
	updateDDMList(itemsNo);
  });
  $(".ddmList").delegate($(".ddmList").children(), "change", function() {
		updateBlock(ddmAttr());
	});
	
}
	
function liListener() {

	$("#cl").delegate(".LilRequired, .LiiLabel, .Liitype, .LiiSort", "change", function() {
		
		updateBlock(liAttr());
		changeListSort(liAttr().split("_")[4]);
		
		liBlockCss($(".LiiItemsNo").val());
	});
	
	$(".itemsList").delegate($(".itemsList").children(), "change", function() {
		updateBlock(liAttr());
	});
	
	$(".LiiItemsNo").change(function(){		
		var itemsNo = $(".LiiItemsNo").val();
		updateList(itemsNo);	
		
		listItems[selectedBlockID] = listItems[selectedBlockID] || [];
				
		for(var i = 1; i <= itemsNo; i++) {			
			if(listItems[selectedBlockID][i] != undefined) 
				$("input#"+ selectedBlockID +"N"+i).val(listItems[selectedBlockID][i]);
		}
		updateBlock(liAttr());	
		changeListSort(liAttr().split("_")[4]);
		liBlockCss($(".LiiItemsNo").val());
	});

}

function tfListener() {
  $(".TfiRequired, .TfiLabel, .TfiType, .TfiFilter, .TfiHint").change(function() {
			var attr = "Text field";
			attr += "_"+ $(".TfiLabel").val();
			attr += "_"+ $(".TfiType").val();
			attr += "_"+ $(".TfiFilter").val();
			attr += "_"+ $(".TfiHint").val();
			attr += "_"+ $(".TfiRequired").prop("checked");
			updateBlock(attr);
			
	});
}

function updateBlock(attr) {
	$("li#" + selectedBlockID + ".block").attr("name", attr);
  	attr = attr.split("_"); 
  	switch(attr[0]) {
  		case "Text field" : updateTextFieldBlock(attr);
  		break;
  		case "List" : updateListBlock(attr);
  		break;
  		case "Drop Down Menu" : updateDDMBlock(attr);
  		break;
  	}
}
function updateDDMBlock(attr) {
	var len = attr.length;
	attr[1] += (attr[len-1] == "true") ? '<span style = "color : red">*</span>' : "";
	var items = "";
	if(len > 3)
	for(var i = 3; i < len-1; i++) 
		items += '<option value = "'+attr[i]+'" id = "' + selectedBlockID + '_'+(i-2)+'">'+attr[i]+'</option>';
  	$("select#" + selectedBlockID + ".ddmList").html(items);
	$("div#label"+selectedBlockID+".ddmLabel").html(attr[1]);
}
function updateListBlock (attr) {
	var len = attr.length;
  	attr[1] += (attr[attr.length-1] == "true") ? '<span style = "color : red">*</span>' : "";
  	$("div#label"+selectedBlockID+".liLabel").html(attr[1]);

  	switch(attr[2]) {
  		case "Normal list" :
  			for(var i = 5; i < len-1; i++) 
  				$("li#"+ selectedBlockID+"_" + (i-4)).html(attr[i]);
  			break;
  		case "Check box" :
  			for(var i = 5; i < len-1; i++) {
  				var html = '<input type="checkbox" name ="'+attr[1].split("<")[0]+'" value = "'+attr[i]+'"> '+attr[i];
  				$("li#"+ selectedBlockID+"_" + (i-4)).html(html);
  			}
  			break;
  		case "Radio button" :
  			for(var i = 5; i < len-1; i++) {
  				var html = '<input type="radio" name ="'+attr[1].split("<")[0]+'" value = "'+attr[i]+'"> '+attr[i];
  				$("li#"+ selectedBlockID+"_" + (i-4)).html(html);
  			}
  			break;
  	}
}

function updateTextFieldBlock(attr) {
	attr[1] += (attr[5] == "true") ? '<span style = "color : red">*</span>' : "";
	$("div#label"+selectedBlockID+".tfLabel").html(attr[1]);
	$("input.tfInputField"+selectedBlockID).prop("type", attr[2]);
  	$("input.tfInputField"+selectedBlockID).attr("placeholder", attr[4]);
}

function updateInputType(type) {
	type = type.split("_");
	switch(type[0]) {
		case "" : $(".inputType").val("0");
		break;
		case "Text field" : $(".inputType").val("1");
		break;
		case "List" : $(".inputType").val("2");
		break;
		case "Drop Down Menu" : $(".inputType").val("3");
		break;
	}
}

function updateAttr(type) {
	var type = type.split("_");
	var k= "";
	switch(type[0]) {
		case "Text field" : updateTfAttr(type); break;
		case "List" : updateLiAttr(type); break;
		case "Drop Down Menu" : updateddmAttr(type); break;
	}
}

function updateddmAttr(type) {
	updateDDMList(type[2]);
	var len = type.length;
  $("input.ddmilabel").val(type[1]);
  $("input.ddmiitemsNo").val(type[2]);
  if(len > 3)
 	 for(var i = 3; i <len-1; i++ ) 
  		$("input#" + selectedBlockID + "N" + (i-2) + ".ddm").val(type[i]);
  
  var checked = type[len-1] == "true" ? true : false;
  
  $(".DdmlRequired").prop("checked", checked);
}

function updateTfAttr(type) {
  $(".TfiLabel").val(type[1]);
	$(".TfiType").val(type[2]);
	$(".TfiFilter").val(type[3]);
	$(".TfiHint").val(type[4]);
	var checked = type[type.length-1] == "true" ? true : false;
	$(".TfiRequired").prop("checked", checked);
}

function updateLiAttr(type) {
	updateList(type[3], type[4]);
	len = type.length;
  $(".LiiLabel").val(type[1]);
	$(".Liitype").val(type[2]);
	$(".LiiItemsNo").val(type[3]);
	$(".LiiSort").val(type[4]);
	
	
	for(var i = 5; i <len-1; i++ ) {
		$("input#" + selectedBlockID + "N" + (i-4)).val(type[i]);
	}
	var checked = type[len-1] == "true" ? true : false;
	$(".LiiRequired").prop("checked", checked);
}

function updateControlDiv(type) {
	$("#controlDiv").children().hide();
	type = type.split("_");
	switch(type[0]) {
		case "" : $("#controlDiv").children().hide();
		break;
		case "Text field" : $("#ctf").show();
		break;
		case "List" : $("#cl").show();
		$("input.item1").attr("id", selectedBlockID + "N" + "1");
		break;
		case "Drop Down Menu" : $("#cddm").show();
		break;
	}
}

function changeBlock(val, id) {
	var list = '<div id = "label'+selectedBlockID+'" class = "liLabel">newItem'+selectedBlockID+'</div><div id = "input'+selectedBlockID+'" class = "liInputField">'+
	'<ol class = "liInputField'+selectedBlockID+'" name = "orderList">'+
	'<li id = "'+selectedBlockID+'_1"  style="list-style-type: decimal-leading-zero"></li>'+						
	'</ol></div><a href = "#" id = "delete'+selectedBlockID+'" class = "deleteButton">x</a>';
		
	var textField ='<div id = "label'+selectedBlockID+'" class = "tfLabel">Label '+selectedBlockID+'</div><div id = "input" class = "tfInputField">'+
	'<input class = "tfInputField'+selectedBlockID+'" type = "text" name = "text" value="" style = "height: 25px; width: 200px;"/>'+
	'</div><a href = "#" id = "delete'+selectedBlockID+'" class = "deleteButton">x</a>';
	
	var dropDownMenu = '<div id = "label'+selectedBlockID+'" class = "ddmLabel">newItem'+selectedBlockID+'</div><div id = "input" class = "ddmInputField">'+
	'<select name = "inputType" class  = "ddmList" id = "'+selectedBlockID+'" style="width: 204px; height: 29px">'+
	'</select></div><a href = "#" id = "delete'+selectedBlockID+'" class = "deleteButton">x</a>';
	
	switch(val) {
		case "Text field" : 
		$("li#" + selectedBlockID + ".block").html(textField);
		$("li#" + selectedBlockID + ".block").attr("name", "Text field_Label "+selectedBlockID+"_Normal Text___false");
		tfBlockCss();
		break;
		case "List" : 
		$("li#" + selectedBlockID + ".block").html(list);
		$("li#" + selectedBlockID + ".block").attr("name", "List_newItem"+selectedBlockID+"_Normal List_1_Ordered List__false");
		liBlockCss($(".LiiItemsNo").val());
		break;
		case "Drop Down Menu" : 
		$("li#" + selectedBlockID + ".block").html(dropDownMenu);
		$("li#" + selectedBlockID + ".block").attr("name", "Drop Down Menu_newItem"+selectedBlockID+"_1__false");
		tfBlockCss();
		break;
	}
}

function updateListCSS (num) {
      $("#li_" + num).css({
		'width': '366px',
		'height': '200px',
		'background-color': '#FFFFFF',
		'float': 'left'
	});
}

function updateDDMList(value) {
	value = Number(value);
	$(".itemsList").html("");
	var html = "";
	var list = "";
	
	for(var i = 0; i < value; i++) {
		html += '<div class = "listItemLabel">#'+(i+1)+'</div><div class = "listItemtf" id = "'+(i+1)+'">'+
		'<input type="text" class = "ddm" value = "" id = "'+ selectedBlockID + 'N' + (i+1) + '" style="width: 206px; height: 25px"/></div>';
		list += '<option value="'+i+'" id = "'+ selectedBlockID + '_' + (i+1) + '"></option>';
	}
	$(".ddmList").html(html);
	$("select.ddmList").html(list);
}

function updateList(value, sort) {
		
	value = Number(value);
	$(".itemsList").html("");
	var html = "";
	var list = "";	
	
	switch(sort) {
		case "Ordered List" : sort = "decimal-leading-zero"; break;
		case "Unordered List" : sort = "square"; break;
	}

	for(var i = 0; i < value; i++) {
		html += '<div class = "listItemLabel">#'+(i+1)+'</div><div class = "listItemtf" id = "'+(i+1)+'">'+
		'<input type="text" id = "'+ selectedBlockID + 'N' + (i+1) + '" style="width: 206px; height: 25px"/></div>';
		list += '<li id = ' + selectedBlockID + '_' + (i+1) + ' style="list-style-type: ' + sort + '"></li>';
		$("input#"+ selectedBlockID +"N"+(i+1)).val("listItems[selectedBlockID][i]");
	}
	
	$(".itemsList").html(html);
	$(".liInputField"+selectedBlockID).html(list);

	liBlockCss(value);
	
	$("li#" + selectedBlockID + ".block").attr("name", "List_newItem1_Normal List_" + value + "_Ordered List__false");
		
}

function getListItems(attr) {
	return attr.split("_").slice(attr[5], attr[attr.length-1]);
}

function tfBlockCss() {
	
  $("li#"+selectedBlockID+".block").css({
	'margin-top': '3px',
	'margin-right': '7px',
	'margin-left': '3px',
	'width': '366px',
	'height':'50px',
	'background-color': '#FFFFFF',
	'float': 'left'
	});
}

function liBlockCss(val) {
	
	var h = (val > 2) ? (val-2)*20 : 0;
  
  $("li#"+selectedBlockID+".block").css({
	'margin-top': '3px',
	'margin-right': '7px',
	'margin-left': '3px',
	'width': '366px',
	'height': (h+50) + 'px',
	'background-color': '#FFFFFF',
	'float': 'left'
	});

	
	$("div#label" + selectedBlockID + ".liLabel").css({
		'width': '120px',
		'height': '50px',
		'float': 'left',
		'line-height': '50px',
		'vertical-align': 'center',
		'text-align': 'center',
		'margin-top' : (h/2) + 'px'
	});
		
	h = val*20;

	var margin = (val > 2) ? 4 : (50-(val*20))/2;
	
	$(".liInputField"+ selectedBlockID).css({
		'margin-left': '35px',
		'margin-top': margin + 'px',
		'width': '195px',
		'height': h + 'px',
		'float': 'left',
		'line-height': '20px',
		'vertical-align': 'center',
	});
}

