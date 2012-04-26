function isEmail(email) {
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');

	if(reg.test(email) && !isEmpty(email))
		return true;
	else
		return false;
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