const foods = require('./foods.js');

module.exports = function(message, commandSender, channel){
	const cmdI = message.indexOf(';');
	const lcmdI = message.lastIndexOf(';') == cmdI ? undefined : message.lastIndexOf(';')
	if(cmdI == -1){ return null; }
	message = message.slice(cmdI+1, lcmdI);

	const commandList = createCommandList(message);
	return commandOutput = iterateCommandList(commandList, commandSender);
}

function createCommandList(message){
	return message.split('|').map(function(cmd){
		let cmdObj = {};
		cmdObj.args = cmd.split(' ').filter((e)=>e!='');
		if(cmdObj.args[0] == 'eodem'){ cmdObj.args.shift(); }
		cmdObj.command = cmdObj.args.shift();
		return cmdObj;
	}).filter(e => e.command);
}

function iterateCommandList(commandList, commandSender){
	let returnText = '';
	let chatType = 'chat';
	while(commandList.length != 0){
		const cmd = commandList.shift();
		const args = returnText.split(' ').concat(cmd.args).filter((e)=>e!='');
		switch(cmd.command){
			case 'nere':
				returnText = reverseString(args.join(' '));
			break; case 'mulcere':
				let personToPet = args[0] || commandSender;
				returnText = 'pets '+personToPet;
				chatType = 'action';
			break; case 'edere':
				let personToFood = args[0] || commandSender;
				returnText = 'gives '+personToFood+' '+foods();
				chatType = 'action';
			break; case 'help':
				returnText = 'nere [text]: flip text; mulcere [person]: pet\'s person; edere [person]: feeds person; forum [number]: links forum; imago [number]: links post';
				chatType = 'pm';
			default:break;
		}
	}
	return {
		text: returnText,
		type: chatType
	}
}

const reverseString = (str) => str.split('').reverse().join('');