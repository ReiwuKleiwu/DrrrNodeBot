const fetch = require('node-fetch');
const request = require('request-promise');
const Room = require('./Room');

module.exports = class Bot {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.session;
        this.loginToken;
        this.roomID;
        this.room;
        this.url = 'https://drrr.com/';
        this.api = '?ajax=1&api=json';
        this.language = 'de-DE'
        this.path = ``;
    }

    //Fetch JSON Data from current URL
    static async fetchJson(url, path, api = '', session) {
        const drrrFetch = await fetch(url + path + api, {
            headers: {
                cookie: session ? `drrr-session-1=${session};` : ''
            }
        });
        const drrrJSON = await drrrFetch.json();
        return drrrJSON;
    }

    static async fetchRoomData(session, update) {
        const drrrFetch = await fetch(`https://drrr.com/json.php?update=${update}`, {
            headers: {
                cookie: session ? `drrr-session-1=${session};` : ''
            }
        });
        const roomJSON = await drrrFetch.json();
        return roomJSON;
    }

    async roomLoop() {
        setInterval(async () => {
            const roomJSON = await this.constructor.fetchJson(this.url, this.path, this.api, this.session);
            this.room = new Room(roomJSON.room);

            const room = await this.constructor.fetchRoomData(this.session, this.room.update);

           console.log(room);
            

        }, 1000);
    }


    // Check whether or not the bot is still logged in on drrr.com
    async checkStatus() {
        const drrrJSON = await this.constructor.fetchJson(this.url, this.api, this.session);

        // Returns 'true' if logged in or 'false' if not logged in
        return !(drrrJSON.Authorization);
    }

    //Bot logs into the site
    async siteLogin() {
        const drrrJSON = await this.constructor.fetchJson(this.url, this.api);
        const {
            token,
            Authorization
        } = drrrJSON;
        this.session = Authorization;

        console.log(`Login into Drrr.com with cookie: ${Authorization} and token: ${token}`);
        const formData = {
            name: this.name,
            icon: this.icon,
            token: token,
            login: 'direct',
            language: this.language
        };

        await request({
            method: 'POST',
            uri: this.url + this.api,
            formData: formData,
            headers: {
                'Cookie': `drrr-session-1=${this.session};`,
                'User-Agent': 'Bot'

            }
        }, (error, response, body) => {
            if (error) console.log(error);
            if (!response.body.error) {
                console.log(`Logged successfully into Drrr.com!`);
                this.path = `lounge`;
            } else {
                console.log(`There was an error logging into Drrr.com: ${request.body.error}`);
            }
        });
    }

    //Bot logs into a room
    async roomLogin(id) {
        if (id) {

            const drrrJSON = await this.constructor.fetchJson(this.url, this.path, this.api, this.session);

            if (await this.constructor.searchRoom(drrrJSON, id)) {
                console.log(`Room ${id} was found.`);
                await request({
                    method: 'GET',
                    uri: this.url + `room/?id=` + id,
                    headers: {
                        Cookie: `drrr-session-1=${this.session};`
                    }
                }, async (error, response, body) => {
                    if (!error) {
                        this.path = `room`;
                        this.roomID = `id`;

                        const roomJSON = await this.constructor.fetchJson(this.url, this.path, this.api, this.session);

                        this.room = new Room(roomJSON.room);

                        console.log(this.room.talks);

                    }
                });
            } else {
                console.error(`Room ${id} was not found.`);
                return;
            }


        } else {
            console.error(`No room ID was provided.`);
            return;
        }
    }

    static async searchRoom(lounge, id) {

        for (const room of lounge.rooms) {
            if (room.id === id) return true;
        }

        return false;
    }



}