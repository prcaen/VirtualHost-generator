(function($){
	$.virtualHostGenerator = function(el, options){
			var base = this;
			var tools = {};

			base.$el = $(el);
			base.el = el;
			base.output = '';

			base.$el.data("virtualHostGenerator", base);

			base.init = function(){
				base.options = $.extend({},$.virtualHostGenerator.defaultOptions, options);
				base.checkEmpty();
				base.eventListeners();
				if(!tools.detectBlobBuilder())
					$('#' + base.options.downloadBtn).parent().hide();
				base.generatedOutput();
			};

			base.eventListeners = function(){
				$('.' + base.options.inputTextClass).keyup(base.onKeyUpInputText);
				$('.' + base.options.inputCheckboxClass).change(base.onChangeInputCheckbox);
				$('.' + base.options.selectClass).change(base.onChangeSelect);
				$('.new-folder').click(base.onClickNewFolder);
				$('.new-ip-restrict').click(base.onClickNewRestrictIP);
				$('.order-restrict').change(base.onChangeOrderRestrict);
				$('.options_folder').change(base.onChangeOptionsFolder);
				$('.vh-restrict-ip').keyup(base.onKeyUpRestrictIP);
				$('.vh-phpmyadmin-restrict-ip').keyup(base.onKeyUpPhpMyAdminRestrictIP);
				$('.folder_name').keyup(base.onKeyUpFolderName);
				$('.delete-folder').click(base.onClickDeleteFolder);
			};

			base.onKeyUpInputText = function(){
				var input = $(this);
				var dataType = input.attr('data-type');
				var val = input.val();
				var id = input.attr('id');

				for(var field in base.options.fields) {
					if(base.options.fields[field] == id) {
						if(tools.validateInput(val, dataType))
							$.virtualHostGenerator.data[field] = val;
						else
							$.virtualHostGenerator.data[field] = $.virtualHostGenerator.defaultValues[field];
					}
				}
				if(id == 'document_root') {
					if(tools.validateInput(val, dataType))
						$.virtualHostGenerator.data.directories.root.documentRoot = val;
					else
						$.virtualHostGenerator.data.directories.root.documentRoot = $.virtualHostGenerator.defaultValues.documentRoot;
				}
				base.generatedOutput();
			};

			base.onKeyUpRestrictIP = function(){
				var input = $(this);
				var dataType = input.attr('data-type');
				var val = input.val();
				var folder = input.parent().parent().parent().parent().parent().parent().attr('id');
				var id = input.attr('id').replace('domaine_or_ip_', '');

				if(folder == 'folder_root') {
					if(tools.validateInput(val, dataType))
						$.virtualHostGenerator.data.directories.root.restrictIps[id] = input.val();
				}
				else {
					folder = folder.replace('folder_', '');
					if(tools.validateInput(val, dataType))
						$.virtualHostGenerator.data.directories[folder].restrictIps[id] = input.val();
				}
				base.generatedOutput();
			};

			base.onKeyUpPhpMyAdminRestrictIP = function(){
				var input = $(this);
				var dataType = input.attr('data-type');
				var val = input.val();
				var id = input.attr('id').replace('domaine_or_ip_', '');
				
				if(tools.validateInput(val, dataType))
					$.virtualHostGenerator.data.phpMyAdmin.restrictIps[id] = input.val();

				base.generatedOutput();
			};

			base.onKeyUpFolderName = function(){
				var input = $(this);
				var dataType = input.attr('data-type');
				var val = input.val();
				var folder = input.parent().parent().parent().parent().attr('id').replace('folder_', '');

				if(tools.validateInput(val, dataType))
					$.virtualHostGenerator.data.directories[folder].documentRoot = input.val();
				else
					$.virtualHostGenerator.data.directories[folder].documentRoot = $.virtualHostGenerator.defaultValues.documentRoot

				base.generatedOutput();
			};

			base.onChangeInputCheckbox = function(){
				var input = $(this);
				var id = input.attr('id');
				for(var field in base.options.fields) {
					if(base.options.fields[field] == id) {
						if(input.is(':checked'))
							$.virtualHostGenerator.data[field] = true;
						else
							$.virtualHostGenerator.data[field] = false;
					}
					else if(base.options.fields.phpMyAdmin.protect == id) {
						if(input.is(':checked'))
							$.virtualHostGenerator.data.phpMyAdmin.protect = true;
						else
							$.virtualHostGenerator.data.phpMyAdmin.protect = false;
					}
				}
				base.generatedOutput();
			};

			base.onChangeSelect = function(e){
				var select = $(this);
				var id = select.attr('id');
				var val = select.val();
				if(id == 'log_level') {
					$.virtualHostGenerator.data.logLevel = val;
				}

				base.generatedOutput();
			};

			base.onClickNewFolder = function(e) {
				e.preventDefault();

				var nbFolder = $('.folder').length - 1;
				if($.virtualHostGenerator.data.directories[nbFolder] == undefined) {
					$.virtualHostGenerator.data.directories[nbFolder] = {
						documentRoot: $.virtualHostGenerator.defaultValues.documentRoot, 
						allowDeny: 'Allow,Deny',
						optionExecCGI: '-' + $.virtualHostGenerator.defaultValues.dirOptionExecCGI,
						optionFollowSymlinks: '+' + $.virtualHostGenerator.defaultValues.dirOptionFollowSymlinks,
						optionIncludes: '-' + $.virtualHostGenerator.defaultValues.dirOptionIncludes,
						optionIndexes: '-' + $.virtualHostGenerator.defaultValues.dirOptionIndexes,
						optionMultiviews: '+' + $.virtualHostGenerator.defaultValues.dirOptionMultiviews,
						optionAllowOverride: $.virtualHostGenerator.defaultValues.dirOptionAllowOverride,
						restrictIps: {}
					};
				}

				var clone = $('#new_folder').clone();
				$(this).parent().parent().after(clone);
				clone.slideToggle(function() {
					$('body').css('overflow', 'hidden');
					$('html,body').animate({scrollTop: $(clone).offset().top - 50}, 1000, function() {
						$('body').css('overflow', 'auto');
					});
				});
				$(this).remove();
				clone.removeClass('hide').attr('id', 'folder_' + nbFolder);
				base.eventListeners();
				base.generatedOutput();
			};

			base.onClickDeleteFolder = function(e) {
				e.preventDefault();

				var element = $(this);
				var folder = element.parent().parent();
				var folderId = folder.attr('id').replace('folder_', '');
				var newBtn = folder.children('.page-header').children('.new-folder').clone();
				folder.slideToggle(function(){
					folder.prev().children('.page-header').prepend(newBtn);
					$('body').css('overflow', 'hidden');
					$('html,body').animate({scrollTop: $(folder).prev().offset().top - 180}, 1000, function() {
						$('body').css('overflow', 'auto');
					});
					folder.remove();
					delete $.virtualHostGenerator.data.directories[folderId];
					base.eventListeners();
					base.generatedOutput();
				});
			};

			base.onClickNewRestrictIP = function(e) {
				e.preventDefault();

				var element = $(this);

				if(element.parent().parent().prev().children('.controls').children('select').val() == 'Allow,Deny')
					var clone = element.parent().prev().clone();
				else
					var clone = element.parent().prev().prev().clone();

				nbRestrict = element.parent().children('p').length + 1;
				clone.children('p').children('input').attr('name', 'domaine_or_ip_' + nbRestrict).attr('id', 'domaine_or_ip_' + nbRestrict);
				clone = clone.html();
				element.parent().append(clone);
				element.remove();
				base.eventListeners();
				base.generatedOutput();
			};

			base.onChangeOrderRestrict = function(e) {
				e.preventDefault();

				var element = $(this);
				var div = element.parent().parent().next().children('div').next().next();
				var folder = element.parent().parent().parent().parent().parent().attr('id');

				if(element.val() == 'Allow,Deny') {
					div.children('p').children('label').text('Disallow');
					div.children('button').removeClass('btn-success').addClass('btn-danger');
					div.children('button').text('New disallowed IP/domain');
				}
				else {
					div.children('p').children('label').text('Allow');
					div.children('button').removeClass('btn-danger').addClass('btn-success');
					div.children('button').text('New allowed IP/domain');
				}
				if(folder == undefined && element.attr('id') == 'phpmyadmin_allow_deny') {
					$.virtualHostGenerator.data.phpMyAdmin.allowDeny = element.val();
				}
				else if(folder == 'folder_root')
					$.virtualHostGenerator.data.directories.root.allowDeny = element.val();
				else {
					folder = folder.replace('folder_', '');
					$.virtualHostGenerator.data.directories[folder][allowDeny] = element.val();
				}

				base.eventListeners();
				base.generatedOutput();
			};

			base.onChangeOptionsFolder = function(e) {
				e.preventDefault();

				var element = $(this);
				var folder = element.parent().parent().parent().parent().parent().parent().attr('id');
				var optionType = element.attr('id');
				var dirOptionType = 'dir' + tools.capitaliseFirstLetter(optionType);
				if(folder == 'folder_root') {
					if(optionType != 'optionAllowOverride')
						$.virtualHostGenerator.data.directories.root[optionType] = ((element.is(':checked')) ? '+' : '-') + $.virtualHostGenerator.defaultValues[dirOptionType];
					else
						$.virtualHostGenerator.data.directories.root[optionType] = ((element.is(':checked')) ? 'All' : 'None');
				}
				else {
					folder = folder.replace('folder_', '');
					if(optionType != 'optionAllowOverride')
						$.virtualHostGenerator.data.directories[folder][optionType] = ((element.is(':checked')) ? '+' : '-') + $.virtualHostGenerator.defaultValues[dirOptionType];
					else
						$.virtualHostGenerator.data.directories[folder][optionType] = ((element.is(':checked')) ? 'All' : 'None');
				}
				base.eventListeners();
				base.generatedOutput();
			};

			base.checkEmpty = function() {
				for(var field in base.options.fields) {
					if(field == 'phpMyAdmin') {
						$.virtualHostGenerator.data.phpMyAdmin.protect = true;
					}
					else if(field == 'directories') {
						continue;
					}
					else
						$.virtualHostGenerator.data[field] = (tools.isEmpty($(field).val())) ? $.virtualHostGenerator.defaultValues[field] : $(field).val();
				}
			};

			base.generatedOutput = function() {
				// ******* OUTPUT ********
				base.output	 = 'NameVirtualHost ' + $.virtualHostGenerator.data.serverIp + ':' + $.virtualHostGenerator.data.serverPort + '\n';
				base.output += '\n';
				base.output += '<VirtualHost ' + $.virtualHostGenerator.data.serverIp + ':' + $.virtualHostGenerator.data.serverPort + '>\n';
				base.output += '\tServerName	' + $.virtualHostGenerator.data.serverName + '\n';
				base.output += '\tServerAlias	' + $.virtualHostGenerator.data.serverAlias + '.' + $.virtualHostGenerator.data.serverName + '\n';

				if($.virtualHostGenerator.data.serverAdmin)
					base.output += '\tServerAdmin	' + $.virtualHostGenerator.data.serverAdmin + '\n';

				base.output += '\n';
				base.output += '\t<Directory / >\n';
				base.output += '\t\tAllowOverride None \n';
				base.output += '\t\tOrder Deny,Allow \n';
				base.output += '\t</Directory>\n';
				base.output += '\n';

				// Directories
				base.output += '\tDocumentRoot ' + $.virtualHostGenerator.data.documentRoot + '\n';

				base.output += '\t<Directory ' + $.virtualHostGenerator.data.directories.root.documentRoot + ' >\n';
				base.output += '\t\tOptions ' + $.virtualHostGenerator.data.directories.root.optionExecCGI + ' ' + $.virtualHostGenerator.data.directories.root.optionFollowSymlinks;
				base.output += ' ' + $.virtualHostGenerator.data.directories.root.optionIndexes + ' ' + $.virtualHostGenerator.data.directories.root.optionIncludes + ' '
				base.output += $.virtualHostGenerator.data.directories.root.optionMultiviews + '\n';
				base.output += '\t\tAllowOverride ' + $.virtualHostGenerator.data.directories.root.optionAllowOverride + '\n';
				base.output += '\t\tOrder ' + $.virtualHostGenerator.data.directories.root.allowDeny + '\n';
				if($.virtualHostGenerator.data.directories.root.allowDeny == 'Deny,Allow')
				{
					base.output += '\t\tDeny from All \n';
					base.output += '\t\tAllow from localhost\t\t# Local \n';
					base.output += '\t\tAllow from 127.0.0.1\t\t# Local \n';
					for(var value in $.virtualHostGenerator.data.directories.root.restrictIps)
					{
						if($.virtualHostGenerator.data.directories.root.restrictIps[value])
							base.output += '\t\tAllow from ' + $.virtualHostGenerator.data.directories.root.restrictIps[value] + '\n';
					}
				}
				else
				{
					base.output += '\t\tAllow from All \n';
					for(var value in $.virtualHostGenerator.data.directories.root.restrictIps)
					{
						if($.virtualHostGenerator.data.directories.root.restrictIps[value])
							base.output += '\t\tDeny from ' + $.virtualHostGenerator.data.directories.root.restrictIps[value] + '\n';
					}
				}
				base.output += '\t</Directory>\n';

				for(var key in $.virtualHostGenerator.data.directories)
				{
					if(key != 'root') {
						base.output += '\n';
						base.output += '\t<Directory ' + $.virtualHostGenerator.data.directories[key].documentRoot + ' >\n';
						base.output += '\t\tOptions ' + $.virtualHostGenerator.data.directories[key].optionExecCGI + ' ' + $.virtualHostGenerator.data.directories[key].optionFollowSymlinks;
						base.output += ' ' + $.virtualHostGenerator.data.directories[key].optionIndexes + ' ' + $.virtualHostGenerator.data.directories[key].optionIncludes + ' '
						base.output += $.virtualHostGenerator.data.directories[key].optionMultiviews + '\n';
						base.output += '\t\tAllowOverride ' + $.virtualHostGenerator.data.directories[key].optionAllowOverride + '\n';
						base.output += '\t\tOrder ' + $.virtualHostGenerator.data.directories[key].allowDeny + '\n';
						if($.virtualHostGenerator.data.directories[key].allowDeny == 'Deny,Allow')
						{
							base.output += '\t\tDeny from All \n';
							base.output += '\t\tAllow from localhost\t\t# Local \n';
							base.output += '\t\tAllow from 127.0.0.1\t\t# Local \n';
							for(var value in $.virtualHostGenerator.data.directories[key].restrictIps)
							{
								if($.virtualHostGenerator.data.directories[key].restrictIps[value])
									base.output += '\t\tAllow from ' + $.virtualHostGenerator.data.directories[key].restrictIps[value] + '\n';
							}
						}
						else
						{
							base.output += '\t\tAllow from All \n';
							for(var value in $.virtualHostGenerator.data.directories[key].restrictIps)
							{
								if($.virtualHostGenerator.data.directories[key].restrictIps[value])
									base.output += '\t\tDeny from ' + $.virtualHostGenerator.data.directories[key].restrictIps[value] + '\n';
							}
						}
						base.output += '\t</Directory>\n';
					}
				}

				// Logs
				base.output += '\n';
    		base.output += '\t# Logs\n';
    		
    		if($.virtualHostGenerator.data.errorLog)
    		  base.output += '\tErrorLog ' + $.virtualHostGenerator.data.errorLog + '\n';
    		  
    		base.output += '\tLogLevel ' + $.virtualHostGenerator.data.logLevel + '\n';
    		
    		if($.virtualHostGenerator.data.accessLog)
    		  base.output += '\tCustomLog ' + $.virtualHostGenerator.data.accessLog + ' combined\n';

				// PhpMyAdmin
				if($.virtualHostGenerator.data.phpMyAdmin.protect)
				{
					base.output += '\n';
					base.output += '\t# PHPMyAdmin\n';
					base.output += '\t<Directory /usr/share/phpmyadmin>\n';
					if($.virtualHostGenerator.data.phpMyAdmin.allowDeny == 'Deny,Allow')
					{
						base.output += '\t\tDeny from All \n';
						base.output += '\t\tAllow from localhost\t\t# Local \n';
						base.output += '\t\tAllow from 127.0.0.1\t\t# Local \n';
						for(var value in $.virtualHostGenerator.data.phpMyAdmin.restrictIps)
						{
							if($.virtualHostGenerator.data.phpMyAdmin.restrictIps[value])
								base.output += '\t\tAllow from ' + $.virtualHostGenerator.data.phpMyAdmin.restrictIps[value] + '\n';
						}
					}
					else
					{
						base.output += '\t\tAllow from All \n';
						for(var value in $.virtualHostGenerator.data.phpMyAdmin.restrictIps)
						{
							if($.virtualHostGenerator.data.phpMyAdmin.restrictIps[value])
								base.output += '\t\tDeny from ' + $.virtualHostGenerator.data.phpMyAdmin.restrictIps[value] + '\n';
						}
					}
					base.output += '\t</Directory>\n';
				}

				// Security
				if(!$.virtualHostGenerator.data.serverSignature)
				{
					base.output += '\n';
					base.output += '\t# Security\n';
					base.output += '\tServerSignature Off\n';
				}

				base.output += '</VirtualHost>';

				base.$el.text(base.output);

				tools.prepareDownloadFile(base.output);
			};

			// Tools
			tools.validateInput = function(val, type)
			{
				var reg;
				switch (type)
				{
					case 'email':
						reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
						break;
					case 'ip':
						reg = new RegExp('^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$', 'i');
						break;
					case 'domain':
						reg = new RegExp('(^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$|localhost)', 'i');
						break;
					case 'folder-name':
						reg = new RegExp('^/(.+)/([^/]+)/$', 'i');
						break;
					case 'port':
						reg = new RegExp('^(6553[0-5]|655[0-3]\d|65[0-5]\d{2}|6[01]\d{3}|[12]\d{4}|[1-9]\d{3}|[1-9]\d{2}|[1-9]\d|\d)$', 'i');
						break;
					case 'folder-file-name':
						reg = new RegExp('^(.*?)([^/\\]*?)(\.[^/\\.]*)?$', 'i');
						break;
					default:
						reg = new RegExp();
						break;
				}

				if(reg.test(val) && !tools.isEmpty(val)) {
					//console.log('RegExp: true');
					return true;
				}
				else {
					//console.log('RegExp: false');
					return false;
				}
			};

			tools.capitaliseFirstLetter = function(string)
			{
    		return string.charAt(0).toUpperCase() + string.slice(1);
			};

			tools.prepareDownloadFile = function(output) {
				// Pure JS.
				const MIME_TYPE = 'text/plain';
				window.URL = window.webkitURL || window.URL;
  			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

  			var bb = new BlobBuilder();
  			var link = document.querySelector('#vh-download');

  			bb.append(output);
  			link.download = 'your-virtualhost';
  			link.href = window.URL.createObjectURL(bb.getBlob(MIME_TYPE));
  			link.dataset.downloadurl = [MIME_TYPE, link.download, link.href].join(':');
  			link.draggable = true;
  			link.classList.add('dragout');
			};

			tools.isEmpty = function(obj)
			{
				if(typeof obj == 'undefined' || obj === null || obj === '')
					return true;

				if(typeof obj == 'number' && isNaN(obj))
					return true;

				if(obj instanceof Date && isNaN(Number(obj)))
					return true;

				return false;
			};

			tools.detectBlobBuilder = function() {
				// Detect BlobBuilder because modernizr don't for the moment.
				if(window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)
					return true;
				else
					return false;
			};

			base.init();
	};

	$.fn.virtualHostGenerator = function(){
		return this.each(function(){
			(new $.virtualHostGenerator(this));
		});
	};

	$.virtualHostGenerator.defaultValues = {
		serverIp: '*',
		serverPort: 80,
		serverName: 'example.com',
		serverAlias: '*',
		serverAdmin: null,
		documentRoot:'/var/www/',
		dirOptionExecCGI: 'ExecCGI',
		dirOptionFollowSymlinks: 'FollowSymLinks',
		dirOptionIncludes: 'Includes',
		dirOptionIndexes: 'Indexes',
		dirOptionMultiviews: 'MultiViews',
		dirOptionAllowOverride: 'All',
		dirAllowDeny: 'Deny,Allow',
		logLevel: 'debug',
		errorLog: '/var/log/apache2/error_log',
		accessLog: '/var/log/apache2/access_log',
		phpMyAdmin: {
			protect : true,
			allowDeny : 'Allow,Deny'
		},
		serverSignature: false
	};

	$.virtualHostGenerator.data = {
		serverIp : '',
		serverPort : '',
		serverName : '',
		serverAlias : '',
		serverAdmin : '',
		logLevel : $.virtualHostGenerator.defaultValues.logLevel,
		errorLog : $.virtualHostGenerator.defaultValues.errorLog,
		accessLog : $.virtualHostGenerator.defaultValues.accessLog,
		serverSignature : '',
		documentRoot : '',
		directories: {
			root: {
				documentRoot: $.virtualHostGenerator.defaultValues.documentRoot,
				allowDeny: 'Allow,Deny',
				optionExecCGI: '-' + $.virtualHostGenerator.defaultValues.dirOptionExecCGI,
				optionFollowSymlinks: '+' + $.virtualHostGenerator.defaultValues.dirOptionFollowSymlinks,
				optionIncludes: '-' + $.virtualHostGenerator.defaultValues.dirOptionIncludes,
				optionIndexes: '-' + $.virtualHostGenerator.defaultValues.dirOptionIndexes,
				optionMultiviews: '+' + $.virtualHostGenerator.defaultValues.dirOptionMultiviews,
				optionAllowOverride: $.virtualHostGenerator.defaultValues.dirOptionAllowOverride,
				restrictIps: {}
			}
		},
		phpMyAdmin: {
			protect : '',
			allowDeny : $.virtualHostGenerator.defaultValues.phpMyAdmin.allowDeny,
			restrictIps: {}
		}
	};

	$.virtualHostGenerator.defaultOptions = {
		newBtnClass: 'new-btn',
		inputTextClass: 'vh-input-text',
		inputCheckboxClass: 'vh-input-checkbox',
		selectClass: 'vh-select',
		downloadBtn: 'vh-download',
		fields: {
			serverIp: 'server_ip',
			serverPort: 'server_port',
			serverName: 'server_name',
			serverAlias: 'server_alias',
			serverAdmin: 'server_admin',
			documentRoot: 'document_root',
			logLevel: 'log_level',
			errorLog: 'errorLog',
			accessLog: 'accessLog',
			serverSignature: 'server_signature',
			phpMyAdmin: {
				protect: 'phpmyadmin_protect',
				allowDeny: 'phpmyadmin_allow_deny'
			}
		}
	};

})(jQuery);
