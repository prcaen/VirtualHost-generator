var duplicateDirectoryCount = 1;
var duplicateIpCount = 2;
var duplicateIp2Count = 2;
var valid = false;
$(document).ready(function(){
  outputText();
  
  // Link to duplicate
  $('.directory p.duplicate a').click(duplicate);
  $('#phpmyadmin p.duplicate a').click(duplicate);
});

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
  {
    scrollElement = $("body");
  }
  else 
  {
    scrollElement.scrollTop(scrollValue);
  }
  
  // Bind new duplicate link
  var $linkDuplicate = fieldsetDuplicate.children('p.duplicate').children('a');
  $linkDuplicate.show().click(duplicate);
  
 if(fieldsetToDuplicate.hasClass('restrict-ip'))
  {
    var duplicateIptoCount;
    if($this.parent().parent().parent().attr('id') == 'phpmyadmin')
    {
      duplicateIptoCount = duplicateIp2Count;
    }
    else
    {
      duplicateIptoCount = duplicateIpCount;
    }
    var $nextP = $linkDuplicate.parent().next();
    target = 'domaine_or_ip_' + duplicateIptoCount;
    $nextP.children('label').attr('for', target);
    $nextP.children('input').attr('name', target).attr('id', target);
    duplicateIptoCount++;
    
    if($this.parent().parent().parent().parent().attr('id') == 'phpmyadmin')
    {
      duplicateIp2Count = duplicateIptoCount;
    }
    else
    {
      duplicateIpCount  = duplicateIptoCount;
    }
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

function outputText()
{
  var output;
  var outputData = new Array();
  
  var server_ip     = $('#server_ip');
  var server_port   = $('#server_port');
  var server_name   = $('#server_name');
  var server_alias  = $('#server_alias');
  var server_admin  = $('#server_admin');
  var document_root = $('#document_root');
  
  var dir_root_option_exec_cgi        = $('#directory_root #option_exec_cgi');
  var dir_root_option_followsymlinks  = $('#directory_root #option_followsymlinks');
  var dir_root_option_includes        = $('#directory_root #option_includes');
  var dir_root_option_indexes         = $('#directory_root #option_indexes');
  var dir_root_option_multiviews      = $('#directory_root #option_multiviews');
  var dir_root_option_allow_override  = $('#directory_root #option_allow_override');
  var dir_root_allow_deny             = $('#directory_root #allow-deny');
  
  var serverIp     = '*';
  var serverPort   = 80;
  var serverName   = 'example.com';
  var serverAlias  = '*';
  var serverAdmin  = null;
  var documentRoot = '/var/www';
  
  var dirRootOptionCgi              = '-ExecCGI';
  var dirRootOptionFollowSymLinks   = '+FollowSymLinks';
  var dirRootOptionIncludes         = '-Includes';
  var dirRootOptionIndexes          = '-Indexes';
  var dirRootOptionMultiViews       = '+MultiViews';
  var dirRootOptionAllowOverride    = 'All';
  var dirRootAllowDeny              = 'Deny,Allow';
  
  //ouput();
  
  $('input[type="text"]').keyup(onKeyUpInputText);

  /*$('input[type="text"]').keyup(function() { */
  
    /* Input which can be empty */
    /*// if IP is empty
    serverIp = validateInput(server_ip, '*', 'ip');
    
    // if PORT is empty
    serverPort = returnIfEmpty(server_port.val(), 80);
    
    // if SERVER_ALIAS is empty
    serverAlias = returnIfEmpty(server_alias.val(), '*');
    
    // if EMAIL
    serverAdmin = validateInput(server_admin, null, 'email'); */
      
    /* Input which can not be empty */
   /* // if SERVER_NAME
    serverName = returnIfEmpty(server_name.val(), 'example.com');
    
    
    // if DOCUMENT_ROOT
    documentRoot = returnIfEmpty(document_root.val(), '/var/www');    
    
    // Directory
  var directories = new Array;
  directories['root'] = new Array();
  $('.directory').each(function(i){
    var directory = $(this);
    if(i == 0)
    {
      directories['root'] = new Array();
      directories['root']['folder']                 = $('#document_root');
      directories['root']['option_exec_cgi']        = $('#directory_root #option_exec_cgi');
      directories['root']['option_followsymlinks']  = $('#directory_root #option_followsymlinks');
      directories['root']['option_includes']        = $('#directory_root #option_includes');
      directories['root']['option_indexes']         = $('#directory_root #option_indexes');
      directories['root']['option_multiviews']      = $('#directory_root #option_multiviews');
      directories['root']['option_allow_override']  = $('#directory_root #option_allow_override');
      directories['root']['allow_deny']             = $('#directory_root #allow-deny');
    }
    else
    {
      directories[i] = new Array();
      directories[i]['folder']                      = $('#directory_' + i + ' #document_root');
      directories[i]['option_exec_cgi']             = $('#directory_' + i + ' #option_exec_cgi');
      directories[i]['option_followsymlinks']       = $('#directory_' + i + ' #option_followsymlinks');
      directories[i]['option_includes']             = $('#directory_' + i + ' #option_includes');
      directories[i]['option_indexes']              = $('#directory_' + i + ' #option_indexes');
      directories[i]['option_multiviews']           = $('#directory_' + i + ' #option_multiviews');
      directories[i]['option_allow_override']       = $('#directory_' + i + ' #option_allow_override');
      directories[i]['allow_deny']                  = $('#directory_' + i + ' #allow-deny');
    }
  });
    console.log(directories);
    ouput();
  });
  
  
  
  $('input[type="checkbox"]').change(function() {
    dirRootOptionCgi             = isCheckedOption(dir_root_option_exec_cgi) + 'ExecCGI';
    dirRootOptionFollowSymLinks  = isCheckedOption(dir_root_option_followsymlinks) + 'FollowSymLinks';
    dirRootOptionIncludes        = isCheckedOption(dir_root_option_includes) + 'Includes';
    dirRootOptionIndexes         = isCheckedOption(dir_root_option_indexes) + 'Indexes';
    dirRootOptionMultiViews      = isCheckedOption(dir_root_option_multiviews) + 'MultiViews';
    dirRootOptionAllowOverride   = (dir_root_option_allow_override.attr('checked') == 'checked') ? 'All' : 'None';
    
    ouput();
  });
  
  $('select').change(function(){
    dirRootAllowDeny  = dir_root_allow_deny.attr('value');
    ouput();
  }); */
  
  function onKeyUpInputText()
  {
    var inputText       = $(this);
    // Retrieve ID
    var inputTextId     = inputText.attr('id');
    // Retrieve Class
    var inputTextClass  = inputText.attr('class');
    
    if(!isEmpty(inputTextId))
    {
      outputData[inputTextId] = inputText.val();
      
      /*switch(inputTextId)
      {
        case 'server_ip':
          
          break;
        case 'server_port':
          
          break;
        case 'server_name':
          
          break;
        case 'server_alias':
          
          break;
        case 'server_admin':
          
          break;
      }*/
    }
    else if(!isEmpty(inputTextClass))
    {
      outputData[inputTextId] = inputText.val();
    }
  }
  
  function print_r(theObj){
  if(theObj.constructor == Array ||
     theObj.constructor == Object){
    document.write("<ul>")
    for(var p in theObj){
      if(theObj[p].constructor == Array||
         theObj[p].constructor == Object){
document.write("<li>["+p+"] => "+typeof(theObj)+"</li>");
        document.write("<ul>")
        print_r(theObj[p]);
        document.write("</ul>")
      } else {
document.write("<li>["+p+"] => "+theObj[p]+"</li>");
      }
    }
    document.write("</ul>")
  }
}
  
  function ouput()
  {
    // ******* OUTPUT ********
      
      output  = 'NameVirtualHost ' + serverIp + ':' + serverPort + '\n';
      output += '\n';
      output += '<VirtualHost ' + serverIp + ':' + serverPort + '>\n';
      output += '\tServerName  ' + serverName + '\n';
      output += '\tServerAlias ' + serverAlias + '.' + serverName + '\n';
      if(serverAdmin != null)
        output += '\tServerAdmin ' + serverAdmin + '\n';
      output += '\n';
      output += '\t<Directory / >\n';
      output += '\tAllowOverride None \n';
      output += '\tOrder Deny,Allow \n';
      output += '\t</Directory>\n';
      output += '\n';
      output += '\tDocumentRoot ' + documentRoot + '/\n';
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
      output += '\t</Directory>\n';
      output += '</VirtualHost>';
        
      $('pre').text(output);
      
      // ***** Skin
      $('#directory_root legend').first().text('Répertoire racine (' + documentRoot + '/)');
  }
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

function returnIfEmpty (inputVal, textIfEmpty)
{
  if( inputVal == '' )
    return textIfEmpty;
  else
    return inputVal;
}

function validateInput (input, textIfEmpty, type)
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
	 }   
	  if(reg.test(inputVal))
	      return inputVal;
	    else
	      return textIfEmpty
}

function isCheckedOption (input)
{
  if (input.attr('checked') == 'checked')
    return '+';
  else
    return '-';
}
