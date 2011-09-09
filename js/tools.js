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

function retrieveInputSelector(input)
{
 // Retrieve ID
  var inputId     = input.attr('id');
  // Retrieve Class
  var inputClass  = input.attr('class');
  
  if(!isEmpty(inputClass))
    return inputClass;
  else if(!isEmpty(inputId))
  	return inputId;
  else if(!isEmpty(inputClass))
    return inputClass;
 	else
 		alert('Erreur');
}

function onLabelClick()
{
  var label      = $(this);
  var input      = label.prev();
  if(input.is(':checkbox'))
  {
    var inputClass = input.attr('class');
    if(!isEmpty(inputClass))
    {
      if(input.attr('checked') == 'checked')
        input.attr('checked', false);
      else
        input.attr('checked', true);
    }
  }
}
