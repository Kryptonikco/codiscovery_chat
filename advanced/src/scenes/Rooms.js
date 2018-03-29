import React from "react";
import {
    Link
} from "react-router-dom";

import Api from "../utils/Api";

class Scene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: props.match.params.userId,
            name: "",
            rooms: []
        };
    }

    async componentDidMount() {
        const rooms = await Api.getRooms();
        
        this.setState({
            rooms
        });
    }

    render() {
        const {
            userId,
            rooms
        } = this.state;

        if (rooms.length === 0) {
            return null;
        }

        return (
            <ul className="list-group">
                {rooms.map((r, index) =>
                    <li
                        key={index}
                        className="list-group-item">
                        <Link to={`/rooms/${r._id}/users/${userId}`}>{r.name}</Link>
                    </li>
                )}
            </ul>
        );
    }
}

export default Scene;