module.exports = function(string){
	string += ' ';
	return [].concat(localURL()).concat(wiki()).concat(search()).concat(wordsLinks());

	function localURL(){
		const regex = /\".+?\"\:\/.+?\B/g;
		const matches = string.match(regex) || [];
		
		return matches.map(e=>'https://e621.net'+e.split(':')[1]);
	}
	
	function wiki(){
		const regex = /\[\[.+?\]\]/g;
		const matches = string.match(regex) || [];
		
		return matches.map(e=>'https://e621.net/wiki/show/'+e.substring(2, e.length-2).split('|')[0]);
	}
	
	function search(){
		const regex = /\{\{.+?\}\}/g;
		const matches = string.match(regex) || [];

		return matches.map(function(e){
			let lastIndex = e.lastIndexOf('|');
			if(lastIndex == -1){ lastIndex = e.length-2}
			let tags = e.substring(2, lastIndex).split(' ').filter((e)=>e!='').join('%20');
			return 'https://e621.net/post/search?tags=' + tags;
		});
	}

	function wordsLinks(){
		const regex = /(post|forum|comment|blip|pool|set|takedown|ticket) \#[0-9]+/g;
		const specialRegex = /(record|category) \#[0-9]+/g;
		const matches = string.match(regex) || [];
		const specialMatches = string.match(specialRegex) || [];
		
		const finalMatches = matches.map(e=>e.split(' #')).map(e=>'https://e621.net/'+e[0]+'/show/'+e[1])
		const finalSpecialMatches = specialMatches.map(function(e){
			const split = e.split(' #');
			if(split[0] == 'record'){
				return 'https://e621.net/user_record?user_id='+split[1];
			} else {
				return 'https://e621.net/forum?category='+split[1];
			}
		})
		return [].concat(finalMatches).concat(finalSpecialMatches);;
	}
}