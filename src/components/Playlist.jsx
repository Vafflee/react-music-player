import React from 'react';

module.exports = class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.name = props.name;
        this.state = props.isActive;
        this.songs = props.songs;
    }

    componentDidUpdate() {
        this.songs = this.props.playlist
    }

    render() {
        return( <>{this.songs}</> );
    }
}