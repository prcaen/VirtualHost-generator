var duplicateDirectoryCount = 1;
var duplicateIpCount = 2;
var duplicateIp2Count = 2;
var valid = false;

var output;
var outputData = new Array();

var serverIp     = '*';
var serverPort   = 80;
var serverName   = 'example.com';
var serverAlias  = '*';
var serverAdmin  = null;
var documentRoot = '/var/www/';

var dirOptionCgi              = 'ExecCGI';
var dirOptionFollowSymLinks   = 'FollowSymLinks';
var dirOptionIncludes         = 'Includes';
var dirOptionIndexes          = 'Indexes';
var dirOptionMultiViews       = 'MultiViews';
var dirOptionAllowOverride    = 'All';

$(document).ready(function(){
  outputText();

  // Link to duplicate
  $('.directory p.duplicate a').click(duplicate);
  $('#phpmyadmin p.duplicate a').click(duplicate);
});

function outputText()
{  
  outputData['server_ip'] 	  = serverIp;
  outputData['server_port']   = serverPort;
  outputData['server_name']   = serverName;
  outputData['server_alias']  = serverAlias;
  outputData['server_admin']  = serverAdmin;
  outputData['document_root'] = documentRoot
  
  outputData['directory'] = new Array();
  outputData['directory']['root'] = new Array();
  outputData['directory']['root']['option_exec_cgi']        = '-' + dirOptionCgi;
  outputData['directory']['root']['option_followsymlinks']  = '+' + dirOptionFollowSymLinks;
  outputData['directory']['root']['option_includes']        = '-' + dirOptionIncludes;
  outputData['directory']['root']['option_indexes']         = '-' + dirOptionIndexes;
  outputData['directory']['root']['option_multiviews']      = '+' + dirOptionMultiViews;
  outputData['directory']['root']['option_allow_override']  = dirOptionAllowOverride;
  
   /* var dirAllowDeny              = 'Deny,Allow'; */  
  
  ouput();
  
  $('input[type="text"]').keyup(onKeyUpInputText);
  $('input[type="checkbox"]').change(onChangeInputCheckbox);
  
  function onKeyUpInputText()
  {
    var inputText         = $(this);
    var inputTextSelector = retrieveInputSelector(inputText)
      
    switch(inputTextSelector)
    {
      case 'server_ip':
        outputData[inputTextSelector] = validateInput(inputText, serverIp, 'ip');
        break;
      case 'server_port':
        outputData[inputTextSelector] = validateInput(inputText, serverPort, 'port');
        break;
      case 'server_name':
        outputData[inputTextSelector] = validateInput(inputText, serverName, 'url');
        break;
      case 'server_alias':
        outputData[inputTextSelector] = validateInput(inputText, serverAlias, 'urlWithAlias');
        break;
      case 'server_admin':
        outputData[inputTextSelector] = validateInput(inputText, serverAdmin, 'email');
        break;
      case 'document_root':
        outputData[inputTextSelector] = validateInput(inputText, documentRoot, 'folder');
    }
    
    ouput();
	}
	
	function onChangeInputCheckbox()
	{
	  var inputCheckbox         = $(this);
	  var inputCheckboxSelector = retrieveInputSelector(inputCheckbox)
	  var idDirectory           = inputCheckbox.parent().parent().attr('id');
	  
	  if(idDirectory == 'directory_root')
	    idDirectory = 'root';
    
    switch(inputCheckboxSelector)
    {
      case 'option_exec_cgi':
        outputData['directory'][idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionCgi;
        break;
     case 'option_followsymlinks':
        outputData['directory'][idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionFollowSymLinks;
        break;
     case 'option_includes':
        outputData['directory'][idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionIncludes;
        break;
     case 'option_indexes':
        outputData['directory'][idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionIndexes;
        break;
     case 'option_multiviews':
        outputData['directory'][idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionMultiViews;
        break;
     case 'option_allow_override':
        if(inputCheckbox.attr('checked') == 'checked')
          outputData['directory'][idDirectory][inputCheckboxSelector] = 'All';
        else
          outputData['directory'][idDirectory][inputCheckboxSelector] = 'None';
        break;
    }
    
    ouput();
	}

}
  
function ouput()
{
  // ******* OUTPUT ********
    
    output  = 'NameVirtualHost ' + outputData['server_ip'] + ':' + outputData['server_port'] + '\n';
    output += '\n';
    output += '<VirtualHost ' + outputData['server_ip'] + ':' + outputData['server_port'] + '>\n';
    output += '\tServerName  ' + outputData['server_name'] + '\n';
    output += '\tServerAlias ' + outputData['server_alias'] + '.' + outputData['server_name'] + '\n';
    if(outputData['server_admin'] != null)
      output += '\tServerAdmin ' + outputData['server_admin'] + '\n';
    output += '\n';
    output += '\t<Directory / >\n';
    output += '\tAllowOverride None \n';
    output += '\tOrder Deny,Allow \n';
    output += '\t</Directory>\n';
    output += '\n';
    output += '\tDocumentRoot ' + outputData['document_root'] + '\n';
    output += '\t<Directory ' + outputData['document_root'] + ' >\n';
    output += '\t\tOptions ' + outputData['directory']['root']['option_exec_cgi'] + ' ' + outputData['directory']['root']['option_followsymlinks'];
    output += ' ' + outputData['directory']['root']['option_indexes'] + ' ' + outputData['directory']['root']['option_includes'] + ' '
    output += outputData['directory']['root']['option_multiviews'] + '\n';
    output += '\t\tAllowOverride ' + outputData['directory']['root']['option_allow_override'] + '\n';
    /*output += '\t\tOrder ' + dirRootAllowDeny + '\n';
    if(dirRootAllowDeny == 'Deny,Allow')
    {
      output += '\t\tDeny from All \n';
      output += '\t\tAllow from localhost\t# Local \n';
      output += '\t\tAllow from 127.0.0.1\t# Local \n';
    }
    else
    {
      output += '\t\tAllow from All \n';
    }*/
    output += '\t</Directory>\n';
    console.log(outputData['directory'].length);
    output += '</VirtualHost>';
      
    $('pre').text(output);
    
    // ***** Skin
    $('#directory_root legend').first().text('Répertoire racine (' + outputData['document_root'] + ')');
}

function validateInput(input, textIfEmpty, type)
{
  var reg;
  var inputVal = input.val();
  switch (type)
  {
    case 'email':
      reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
	    break;
		case 'ip':
			reg = new RegExp("^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$", 'i');
	    break;
	  default:
	  	reg = new RegExp();
	  	break;
  }
  if(reg.test(inputVal) && !isEmpty(inputVal))
		return inputVal;
	else
		return textIfEmpty
}

function isCheckedOption(input)
{
  if (input.attr('checked') == 'checked')
    return '+';
  else
    return '-';
}

function duplicate()
{
  event.preventDefault();
  var $this = $(this);
  $this.hide().unbind('click');
  
  // Duplicate fielset
  var fieldsetToDuplicate = $this.parent().parent();
  var fieldsetDuplicate = fieldsetToDuplicate.clone();
  
  var target;
  
  // Scroll
  var scrollElement = $("html");
  var scrollValue = scrollElement.scrollTop();
  if (scrollElement.scrollTop(scrollValue + 1).scrollTop() == scrollValue)
    scrollElement = $("body");
  else
    scrollElement.scrollTop(scrollValue);
  
  // Bind new duplicate link
  var $linkDuplicate = fieldsetDuplicate.children('p.duplicate').children('a');
  $linkDuplicate.show().click(duplicate);
  
 if(fieldsetToDuplicate.hasClass('restrict-ip'))
  {
    var duplicateIptoCount;
    if($this.parent().parent().parent().attr('id') == 'phpmyadmin')
      duplicateIptoCount = duplicateIp2Count;
    else
      duplicateIptoCount = duplicateIpCount;

    var $nextP = $linkDuplicate.parent().next();
    target = 'domaine_or_ip_' + duplicateIptoCount;
    $nextP.children('label').attr('for', target);
    $nextP.children('input').attr('name', target).attr('id', target);
    duplicateIptoCount++;
    
    if($this.parent().parent().parent().parent().attr('id') == 'phpmyadmin')
      duplicateIp2Count = duplicateIptoCount;
    else
      duplicateIpCount  = duplicateIptoCount;
  }
  else
  {  
    fieldsetDuplicate.children('legend').text("Répertoire (/var/www/)");
    if(duplicateDirectoryCount == 1)
    {
      fieldsetDuplicate.children('p.duplicate').append('<p><label for="document_root">Répertoire <span class="important">*</span></label> <input type="text" name="document_root" id="document_root" value="/var/www/" /><br /></p>');
    }
    
    target = 'directory_' + duplicateDirectoryCount;
    
    outputData['directory'][target] = new Array();
    outputData['directory'][target]['option_exec_cgi']        = '-' + dirOptionCgi;
    outputData['directory'][target]['option_followsymlinks']  = '+' + dirOptionFollowSymLinks;
    outputData['directory'][target]['option_includes']        = '-' + dirOptionIncludes;
    outputData['directory'][target]['option_indexes']         = '-' + dirOptionIndexes;
    outputData['directory'][target]['option_multiviews']      = '+' + dirOptionMultiViews;
    outputData['directory'][target]['option_allow_override']  = dirOptionAllowOverride;
    
    fieldsetDuplicate.attr('id', target);
    duplicateDirectoryCount++;
    
  }
  
  fieldsetToDuplicate.after(fieldsetDuplicate);
  outputText();
  var to = fieldsetDuplicate.offset().top;
  scrollElement.animate({ scrollTop: to }, {
    duration: Math.abs($(window).scrollTop() - to) * 0.75,
    complete: function() { fieldsetDuplicate.focus(); }
  });
  return false;
}
