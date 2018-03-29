const HOST = "http://localhost:3001";

class Api {
    async getRooms() {
        const res = await fetch(`${HOST}/rooms`);
        const json = await res.json();

        return json;
    }

    async getMessages({
        roomId
    } = {}) {

        if (roomId) {
            return this.getMessagesByRoomId({ roomId });
        }

        const res = await fetch(`${HOST}/messages`);
        const json = await res.json();

        return json;
    }

    async getMessagesByRoomId({ roomId }) {
        const res = await fetch(`${HOST}/messages?roomId=${roomId}&$sort[date]]=1`);
        const json = await res.json();

        return json;
    }

    async getUsers({
        username
    } = {}) {
        if (username) {
            return this.getUserByUsername({ username });
        }

        const res = await fetch(`${HOST}/users`);
        const json = await res.json();

        return json;
    }

    async getUserByUsername({
        username
    }) {
        const res = await fetch(`${HOST}/finduser/${username}`);
        const json = await res.json();

        return json;
    }
}

export default new Api();