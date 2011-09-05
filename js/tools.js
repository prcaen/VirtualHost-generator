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
  
  if(!isEmpty(inputId))
  	return inputId;
  else if(!isEmpty(inputClass))
    return inputClass;
 	else
 		alert('Erreur');
}
