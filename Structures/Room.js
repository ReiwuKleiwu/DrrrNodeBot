module.exports = class Room {
    constructor({name, description, since, update, limit, language, roomId, music, staticRoom, hiddenRoom, gameRoom, adultRoom, host, users, total, talks}) {
        this.name = name;
        this.description = description; 
        this.since = since; 
        this.update = update; 
        this.limit = limit; 
        this.language = language; 
        this.roomId = roomId; 
        this.music = music; 
        this.staticRoom = staticRoom; 
        this.hiddenRoom = hiddenRoom; 
        this.gameRoom = gameRoom; 
        this.adultRoom = adultRoom; 
        this.host = host; 
        this.users = users; 
        this.total = total; 
        this.talks = talks; 
    }

}