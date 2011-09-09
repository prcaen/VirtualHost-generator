var duplicateDirectoryCount = 1;
var duplicateIpCount = 2;
var duplicateIp2Count = 2;
var valid = false;

var output;
var outputData = {};
outputData.directory = {};

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
var dirAllowDeny              = 'Deny,Allow';

$(document).ready(function(){
  outputText();

  // Link to duplicate
  $('.directory p.duplicate a').click(duplicate);
  $('#phpmyadmin p.duplicate a').click(duplicate);
  
  // On click label witch have there a class for input
  $('label').click(onLabelClick)
});

function outputText()
{  
  (isEmpty(outputData.server_ip))    ? outputData.server_ip    = serverIp : '';
  (isEmpty(outputData.server_port))  ? outputData.server_port  = serverPort : '';
  (isEmpty(outputData.server_name))  ? outputData.server_name  = serverName : '';
  (isEmpty(outputData.server_alias)) ? outputData.server_alias = serverAlias : '';
  (isEmpty(outputData.server_admin)) ? outputData.server_admin = serverAdmin : '';
  
  if(isEmpty(outputData.directory.root))
  {
    outputData.directory.root = {};
    outputData.directory.root.restrict_ip = {};
    outputData.directory.root.document               = documentRoot;
    outputData.directory.root.option_exec_cgi        = '-' + dirOptionCgi;
    outputData.directory.root.option_followsymlinks  = '+' + dirOptionFollowSymLinks;
    outputData.directory.root.option_includes        = '-' + dirOptionIncludes;
    outputData.directory.root.option_indexes         = '-' + dirOptionIndexes;
    outputData.directory.root.option_multiviews      = '+' + dirOptionMultiViews;
    outputData.directory.root.option_allow_override  = dirOptionAllowOverride;
    outputData.directory.root.allow_deny             = dirAllowDeny;
  }
  
  outputF();
  
  $('input[type="text"]')    .keyup(onKeyUpInputText);
  $('input[type="checkbox"]').change(onChangeInputCheckbox);
  $('select')                .change(onChangeSelect);
  
  function onKeyUpInputText()
  {
    var inputText         = $(this);
    var inputTextSelector = retrieveInputSelector(inputText);
    
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
        outputData.directory.root.document = validateInput(inputText, documentRoot, 'folder');
        break;
      case 'document':
        var idDirectory = inputText.parent().parent().parent().attr('id');
        outputData.directory[idDirectory][inputTextSelector] = validateInput(inputText, documentRoot, 'folder');
        break;
      case 'domaine_or_ip':
        var idDirectory = inputText.parent().parent().parent().parent().attr('id');
        if(idDirectory == 'directory_root')
	        idDirectory = 'root';
        outputData.directory[idDirectory].restrict_ip[inputText.attr('id')] = validateInput(inputText, serverIp, 'ip');
        console.log(outputData);
        break;
    }
    
    outputF();
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
        outputData.directory[idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionCgi;
        break;
     case 'option_followsymlinks':
        outputData.directory[idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionFollowSymLinks;
        break;
     case 'option_includes':
        outputData.directory[idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionIncludes;
        break;
     case 'option_indexes':
        outputData.directory[idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionIndexes;
        break;
     case 'option_multiviews':
        outputData.directory[idDirectory][inputCheckboxSelector] = isCheckedOption(inputCheckbox) + dirOptionMultiViews;
        break;
     case 'option_allow_override':
        if(inputCheckbox.attr('checked') == 'checked')
          outputData.directory[idDirectory][inputCheckboxSelector] = 'All';
        else
          outputData.directory[idDirectory][inputCheckboxSelector] = 'None';
        break;
    }
    
    outputF();
	}
	
	function onChangeSelect()
	{
	  var select = $(this);
	  var selectSelector = retrieveInputSelector(select);
	  
	  switch(selectSelector)
	  {
	    case 'allow_deny':
	      var idDirectory = select.parent().parent().parent().attr('id');
	      if(idDirectory == 'directory_root')
	        idDirectory = 'root';
	      outputData.directory[idDirectory][selectSelector] = select.val();
	      break;
	  }
	  
	  outputF();
	}

}
  
function outputF()
{
  // ******* OUTPUT ********
    
    output  = 'NameVirtualHost ' + outputData.server_ip + ':' + outputData.server_port + '\n';
    output += '\n';
    output += '<VirtualHost ' + outputData.server_ip + ':' + outputData.server_port + '>\n';
    output += '\tServerName  ' + outputData.server_name + '\n';
    output += '\tServerAlias ' + outputData.server_alias + '.' + outputData.server_name + '\n';
    if(outputData.server_admin != null)
      output += '\tServerAdmin ' + outputData.server_admin + '\n';
    output += '\n';
    output += '\t<Directory / >\n';
    output += '\t\tAllowOverride None \n';
    output += '\t\tOrder Deny,Allow \n';
    output += '\t</Directory>\n';
    output += '\n';
    output += '\tDocumentRoot ' + outputData.directory.root.document + '\n';
    for(var key in outputData.directory)
    {
      output += '\t<Directory ' + outputData.directory[key].document + ' >\n';
      output += '\t\tOptions ' + outputData.directory[key].option_exec_cgi + ' ' + outputData.directory[key].option_followsymlinks;
      output += ' ' + outputData.directory[key].option_indexes + ' ' + outputData.directory[key].option_includes + ' '
      output += outputData.directory[key].option_multiviews + '\n';
      output += '\t\tAllowOverride ' + outputData.directory[key].option_allow_override + '\n';
      output += '\t\tOrder ' + outputData.directory[key].allow_deny + '\n';
      if(outputData.directory[key].allow_deny == 'Deny,Allow')
      {
        output += '\t\tDeny from All \n';
        output += '\t\tAllow from localhost\t# Local \n';
        output += '\t\tAllow from 127.0.0.1\t# Local \n';
      }
      else
      {
        output += '\t\tAllow from All \n';
      }
      output += '\t</Directory>\n';
      output += '\n';
    }
    output += '</VirtualHost>';
      
    $('pre').text(output);
    
    // ***** Skin
    $('#directory_root legend').first().text('Répertoire racine (' + outputData.directory.root.document + ')');
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
    
    var idDirectory;
    if($this.parent().parent().parent().attr('id') == 'phpmyadmin')
      idDirectory = $this.parent().parent().parent().attr('id')
    else
      idDirectory = $this.parent().parent().parent().parent().attr('id');
      
    if(idDirectory == 'directory_root')
      idDirectory = 'root';
    
    if(isEmpty(outputData.directory[idDirectory]['restrict_ip']))
      outputData.directory[idDirectory]['restrict_ip'] = {};
    
    outputData.directory[idDirectory]['restrict_ip'][target] = $nextP.children('input').val();
    
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
      fieldsetDuplicate.children('p.duplicate').append('<p><label for="document_root">Répertoire <span class="important">*</span></label> <input type="text" name="document" id="document" value="' + $('#vh-options').find('#document_root').val() + '" /><br /></p>');
    }
    
    target = 'directory_' + duplicateDirectoryCount;
    
    outputData.directory[target] = {}
    outputData.directory[target]['document']               = fieldsetDuplicate.find('#document').val();
    outputData.directory[target]['option_exec_cgi']        = isCheckedOption(fieldsetDuplicate.find('.option_exec_cgi')) + dirOptionCgi ;
    outputData.directory[target]['option_followsymlinks']  = isCheckedOption(fieldsetDuplicate.find('.option_followsymlinks')) + dirOptionFollowSymLinks;
    outputData.directory[target]['option_includes']        = isCheckedOption(fieldsetDuplicate.find('.option_includes')) + dirOptionIncludes;
    outputData.directory[target]['option_indexes']         = isCheckedOption(fieldsetDuplicate.find('.option_indexes')) + dirOptionIndexes;
    outputData.directory[target]['option_multiviews']      = isCheckedOption(fieldsetDuplicate.find('.option_multiviews')) + dirOptionMultiViews;
    outputData.directory[target]['allow_deny']             = fieldsetDuplicate.find('#allow_deny').val();
    
    if(fieldsetDuplicate.find('.option_allow_override').attr('checked') == 'checked')
      outputData.directory[target]['option_allow_override']  = 'All';
    else
      outputData.directory[target]['option_allow_override']  = 'None';

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
