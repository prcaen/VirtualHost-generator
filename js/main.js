var duplicateDirectoryCount = 1;
var duplicateIpCount = 2;
var duplicateIp2Count = 2;
var valid = false;

var output;
var outputData = new Array();

$(document).ready(function(){
  outputText();

  // Link to duplicate
  $('.directory p.duplicate a').click(duplicate);
  $('#phpmyadmin p.duplicate a').click(duplicate);
});

function outputText()
{  
  var serverIp     = '*';
  var serverPort   = 80;
  var serverName   = 'example.com';
  var serverAlias  = '*';
  var serverAdmin  = null;
  var documentRoot = '/var/www';
  
  outputData['server_ip'] 	 = serverIp;
  outputData['server_port']  = serverPort;
  outputData['server_name']  = serverName;
  outputData['server_alias'] = serverAlias;
  outputData['server_admin'] = serverAdmin;
  
  var dirRootOptionCgi              = '-ExecCGI';
  var dirRootOptionFollowSymLinks   = '+FollowSymLinks';
  var dirRootOptionIncludes         = '-Includes';
  var dirRootOptionIndexes          = '-Indexes';
  var dirRootOptionMultiViews       = '+MultiViews';
  var dirRootOptionAllowOverride    = 'All';
  var dirRootAllowDeny              = 'Deny,Allow';
  
  ouput();
  
  $('input[type="text"]').keyup(onKeyUpInputText);
  
  function onKeyUpInputText()
  {
    var inputText       = $(this);
    // Retrieve ID
    var inputTextId     = inputText.attr('id');
    // Retrieve Class
    var inputTextClass  = inputText.attr('class');
    
    var inputTextSelector;
    
    if(!isEmpty(inputTextId))
    	inputTextSelector = inputTextId;
   	else
   		inputTextSelector = inputTextClass;
      
    switch(inputTextId)
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
    /* output += '\tDocumentRoot ' + documentRoot + '/\n';
    output += '\t<Directory ' + documentRoot + '/ >\n';
    output += '\t\tOptions ' + dirRootOptionCgi + ' ' + dirRootOptionFollowSymLinks;
    output += ' ' + dirRootOptionIndexes + ' ' + dirRootOptionIncludes + ' '
    output += dirRootOptionMultiViews + '\n';
    output += '\t\tAllowOverride ' + dirRootOptionAllowOverride + '\n';
    output += '\t\tOrder ' + dirRootAllowDeny + '\n';
    if(dirRootAllowDeny == 'Deny,Allow')
    {
      output += '\t\tDeny from All \n';
      output += '\t\tAllow from localhost\t# Local \n';
      output += '\t\tAllow from 127.0.0.1\t# Local \n';
    }
    else
    {
      output += '\t\tAllow from All \n';
    }
    */
    output += '\t</Directory>\n';
    output += '</VirtualHost>';
      
    $('pre').text(output);
    
    // ***** Skin
    //$('#directory_root legend').first().text('Répertoire racine (' + documentRoot + '/)');
}
  
function isEmpty(obj) 
{
  if(typeof obj == 'undefined' || obj === null || obj === '')
    return true;
    
  if(typeof obj == 'number' && isNaN(obj))
    return true;
    
  if(obj instanceof Date && isNaN(Number(obj)))
    return true;
    
  return false;
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
    fieldsetDuplicate.attr('id', target);
    duplicateDirectoryCount++;
    
  }
  
  fieldsetToDuplicate.after(fieldsetDuplicate);
  
  var to = fieldsetDuplicate.offset().top;
  scrollElement.animate({ scrollTop: to }, {
    duration: Math.abs($(window).scrollTop() - to) * 0.75,
    complete: function() { fieldsetDuplicate.focus(); }
  });
  return false;
}
