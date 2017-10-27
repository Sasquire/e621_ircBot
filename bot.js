const irc = require('irc'); // https://node-irc.readthedocs.io/en/latest/API.html#client 
const request = require('request');
const DText = require('./DTextParser.js');
const commandParser = require('./customCommands.js');

const $nick    = 'eodem';
const $server  = 'irc.furnet.org';
const $channel = '#e621';
const $pass    = ''; // haha you think ill give this away?

function errorLog(message){ console.log('ERROR: ', message); }

var client = new irc.Client($server, $nick, {autoConnect: false});
client.addListener('error', errorLog);

client.connect(function() {
	console.log("Connected!");
	client.say('nickserv', 'identify '+$pass);
	setTimeout(function(){
		client.join($channel);
	}, 1000);
});

client.addListener('message#', function(user, channel, text, json){
	checkForCommands(text, user, channel);
});

function checkForCommands(message, user, channel){
	const commandOutput = commandParser(message, user, channel);
	if(commandOutput){
		switch(commandOutput.type){
			case 'action':
				client.action($channel, commandOutput.text);
			break; case 'pm':
				client.say(user, commandOutput.text);
			break; default:
				client.say($channel, commandOutput.text)
			break;
		}
	}

	const DTextParsed = DText(message);
	if(DTextParsed){
		client.say($channel, DTextParsed.join(' '));
	}
}
