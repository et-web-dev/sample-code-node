'use strict';

function getRandomString(text){
	return text + Math.floor((Math.random() * 100000) + 1);
}

function getRandomInt(){
	return Math.floor((Math.random() * 100000) + 1);
}

function getRandomAmount(){
	return ((Math.random() * 100) + 1).toFixed(2);
}

function getDate(){
	return (new Date()).toISOString().substring(0, 10) ;
}


const _getRandomString = getRandomString;
export { _getRandomString as getRandomString };
const _getRandomInt = getRandomInt;
export { _getRandomInt as getRandomInt };
const _getRandomAmount = getRandomAmount;
export { _getRandomAmount as getRandomAmount };
const _getDate = getDate;
export { _getDate as getDate };