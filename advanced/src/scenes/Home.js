import React from "react";
import {
    Link
} from "react-router-dom";

import Api from "../utils/Api";

class Scene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        if (e.key === "Enter") {
            this.onSubmit();
            return;
        }
        this.setState({
            name: e.target.value
        });
    }

    async onSubmit() {
        // console.log("ok submit");
        const user = await Api.getUsers({
            username: this.state.name
        });

        this.props.history.push(`/rooms/users/${user._id}`);
    }

    render() {
        const {
            name
        } = this.state;

        return (
            <div className="col-6 offset-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        placeholder="Username..."
                        onChange={this.onChange}
                        onKeyUp={this.onChange} />
                    <div className="input-group-append">
                        <button
                            type="button"
                            className="btn btn-outline-secondary">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scene;