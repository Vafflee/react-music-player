import config from '../config/config';
import React from 'react';
import placeholder from '../img/cover.jpg';
const jsmt = window.jsmediatags;

const SongAdmin = props => {
                
    let [state, setState] = React.useState({inputVisible: false, active: false});
    let selectRef = null;

    const plusButtonClickHandler = e => {
        e.stopPropagation();
        if (!selectRef || selectRef.value == 'none') {
            setState({inputVisible: !state.inputVisible, active: state.active});
            return;
        }
        if (!state.inputVisible) {
            setState({inputVisible: true, active: state.active});
        } else {
            setState({inputVisible: false, active: state.active});
            fetch(`${config.url}/api/playlists/${selectRef.value}/add/${props.song._id}`, {
                method: 'POST',
                headers: {
                    'x-access-token': props.token ?? null
                }
            })
            .then(res => res.json())
            .then(json => {
                props.getPlaylists();
                console.log(json);
            })
            .catch(err => console.log(err));
        }
    }

    const removeSongFromPlaylist = plid => {
        fetch(`${config.url}/api/playlists/${plid}/remove/${props.song._id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': props.token ?? null
            }
        })
        .then(res => res.json())
        .then(json => {
            props.getPlaylists();
            console.log(json);
        })
        .catch(err => console.log(err));
    }
    
    let songplaylists = [];
    if (props.playlists) {
        songplaylists = props.playlists
        .filter(playlist => playlist.songs.includes(props.song._id))
        .map(playlist => {
            return <div className="admin__element-playlist">
                {playlist.name}
                <button onClick={e => {e.stopPropagation(); removeSongFromPlaylist(playlist._id)}} className="admin__element-playlist-remove">X</button>
            </div>
        });
    }

    let playlistOptions = props.playlists ? props.playlists.map(pl => { 
        // console.log(pl);
        return (<option key={pl._id} value={pl._id}>{pl.name}</option>);
    }) : null;

    songplaylists.push(
    <div onClick={(e) => plusButtonClickHandler(e)} className='admin__add-element-playlist'>
        {state.inputVisible ? 
            <select ref={ref => selectRef = ref} className="admin__add-element-playlist-input" onClick={(e) => e.stopPropagation()}>
                <option key={0} value='none'>none</option>
                {playlistOptions}
            </select> : null}
    +</div>);

    return <div className={"admin__element " + (state.active ? "active" : "")} onClick={() => setState({inputVisible: state.inputVisible, active: !state.active})}>
        <div className="admin__song-cover">
            <img src={props.song.cover ? config.url + '/songcover/' + props.song._id : placeholder} alt={props.song.name + 'cover'} />
        </div>
        <div className="admin__song-title">{props.song.title}</div>
        <div className="admin__song-artist">{props.song.artist}</div>
        <div className="admin__song-delete"><button className='admin__delete-btn' onClick={() => props.deleteSong(props.song._id)}>X</button></div>
        <div className="admin__element-info">
            { songplaylists }
        </div>
    </div>
}

export default class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            title: null,
            artist: null,
            duration: null,
            cover: null,
            records: null,
            filter: 'all',
            playlists: null
        }
        this.fileRef = null; //file input ref
        this.titleRef = null; //title input ref
        this.artistRef = null; //artist input ref
        this.playlistRef = null; //artist input ref
        this.newPlaylistNameRef = null; //artist input ref
        this.filterRef = null; //songs filter select ref
    }

    filterChangeHandler() {
        if (!this.filterRef) return;
        console.log('Fitler changed to ' + this.filterRef.value);
        this.setState({filter: this.filterRef.value});
    }

    componentDidMount() {
        this.getRecords();
        this.getPlaylists();
    }

    async getRecords() {
        const response = await fetch(config.url + '/api/songs', {
            headers: {
                'x-access-token': this.props.token ?? null
            }
        });
        if(!response.ok) {
            console.log(`Fetch error: ${response.statusText}`);
            return;
        }
        const records = await response.json();
        this.setState({records: records});
    }

    getPlaylists() {
        fetch(config.url + '/api/playlists')
        .then(response => response.json())
        .then(json => {
            this.setState({playlists: json.playlists})
            console.log('Playlists updated');
            // console.log(json.playlists[3].songs);
        });
    }

    async uploadSong() {
        const songfile = this.fileRef.files[0];
        const coverfile = this.state.cover;
        const info = {
            title: this.state.title,
            artist: this.state.artist,
            playlist: this.state.playlist
        };
        
        let formData = new FormData();

        // add file to FormData object
        const fd = new FormData();
        fd.append('song', songfile);
        fd.append('cover', coverfile);

        // send `POST` request
        fetch(config.url + '/uploadfile/' + JSON.stringify(info), {
            method: 'POST',
            headers: {
                'x-access-token': this.props.token ?? null
            },
            body: fd
        })
        .then(res => res.json())
        .then(async json => {
            console.log('Response: '); 
            console.log(json); 
            this.getPlaylists();
            this.getRecords();
        })
        .catch(err => {console.log('Error: '); console.error(err)});
    }

    createPlaylist() {
        if (!this.newPlaylistNameRef.value) return console.log('Empty playlist name');
        console.log(this.props.token);
        console.log(this.newPlaylistNameRef.value);
        fetch(config.url + '/api/playlists/add', {
            method: 'POST',
            headers: {
                'x-access-token': this.props.token ?? null,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.newPlaylistNameRef.value
            })
        }) 
        .then(res => res.json())
        .then(json => {
            console.log(json.message)
            this.getPlaylists();
        })
        .catch(err => console.log(err.message));
    }

    coverChangeHandler() {
        const file = this.coverRef.files[0];
        this.setState({cover: file});
    }

    Buf2Url(data, format) {
        let base64string = '';
        for (let i = 0; i < data.length; i++) {
            base64string += String.fromCharCode(data[i]);
        }
        return `data:${format};base64,${window.btoa(base64string)}`;
    }

    fileChangeHandler() {
        // Clear previous info
        this.setState({
            file: null,
            title: null,
            artist: null,
            duration: null,
            cover: null
        });

        const file = this.fileRef.files[0];

        // Getting filename
        this.setState({file: file.name.replace('.mp3', '')});
        
        // Getting duration
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
            this.setState({duration: parseInt(audio.duration)});
        }, false);

        // Getting other info
        jsmt.read(file, {
            onSuccess: (res) => {
                let image = null;
                if (res.tags.picture) {
                    let data = res.tags.picture.data;
                    let format = res.tags.picture.format;
                    let string = this.Buf2Url(data, format);
                    fetch(string)
                        .then((res) => {return res.arrayBuffer();})
                        .then((buf) => {return new File([buf], file.name.replace('.mp3', '.jpg'), {type: format});})
                        .then((file) => {
                            this.setState({cover: file});
                        });
                }
                this.setState({
                    title: res.tags.title,
                    artist: res.tags.artist,
                    cover: image
                });
                this.titleRef.value = res.tags.title;
                this.artistRef.value = res.tags.artist;
            },
            onError: (err) => console.log(err)
        });
    }

    async deleteSong(id) {
        fetch(config.url + '/deletesong/' + id, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.token ?? null
            },
        })
        .then(response => response.json())
        .then(json => {console.log(json); this.getRecords()})
        .catch(err => {console.log(err); this.getRecords()});
    }

    deletePlaylist(id) {
        fetch(`${config.url}/api/playlists/remove/`, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.token ?? null,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        })
        .then(response => response.json())
        .then(json => {console.log(json); this.getPlaylists()})
        .catch(err => console.log(err));
    }

    render() {
        
        let coverurl = this.state.cover ? URL.createObjectURL(this.state.cover) : placeholder;

        let playlistOptions = this.state.playlists ? this.state.playlists.map(pl => { 
            // console.log(pl);
            return (<option key={pl._id} value={pl._id}>{pl.name}</option>);
        }) : null;
        // console.log(playlistOptions);

        let songlist = null;
        if (this.state.records) {
            songlist = this.state.records
            .filter(song => {
                if (this.state.filter === 'all') return true;
                else if (this.state.filter === 'current' && this.props.playlist) {
                    return this.props.playlist.map(psong => psong._id).includes(song._id);}
                else {
                    const playlist = this.state.playlists.filter(pl => this.state.filter == pl._id)[0].songs;
                    // console.log(playlist);
                    return playlist.includes(song._id);
                };
            })
            .map((song) => <SongAdmin 
                key={song._id} 
                song={song} 
                playlists={this.state.playlists} 
                token={this.props.token} 
                getPlaylists={() => this.getPlaylists()}
                deleteSong={(id) => this.deleteSong(id)}
            />);
        } 

        let playlists = null;
        if (this.state.playlists) {
            playlists = this.state.playlists.map(pl => 
                <div className="admin__playlist">
                    {pl.name}
                    <button className='admin__delete-btn' onClick={() => this.deletePlaylist(pl._id)}>X</button>
                </div>
            );
        }

        return(
            <div className={this.props.className + " admin"}>
                <div className="admin__add-section">
                    <div className='admin__section-title'>Upload song</div>
                    <div className="controls">
                    <input type="file" name='musicfile' ref={(ref) => this.fileRef = ref} onChange={() => this.fileChangeHandler()}/>
                    <button className="admin__add" onClick={() => this.uploadSong()}>
                        Upload song
                    </button>
                    <hr />
                    <label htmlFor="cover">Custom cover: </label>
                    <input type="file" name='cover' ref={ref => this.coverRef = ref} onChange={() => this.coverChangeHandler()}/>
                    </div>
                    <div className="admin__fileinfo">
                        <div className="admin__cover">
                            <img src={coverurl} alt="cover" />
                        </div>
                        <ul className='admin__infolist'>
                            <li>File: {this.state.file}</li>
                            <li>Title: <input type="text" ref={ref => this.titleRef = ref} onChange={() => {this.setState({title: this.titleRef.value})}} /></li>
                            <li>Artist: <input type="text" ref={ref => this.artistRef = ref} onChange={() => {this.setState({artist: this.artistRef.value})}} /></li>
                            <li>Playlist: 
                                <select name='playlist' ref={ref => this.playlistRef = ref} onChange={() => {this.setState({playlist: this.playlistRef.value})}}>
                                    <option value="none">none</option>
                                    {playlistOptions}
                                </select>
                            </li>
                            <li>Duration: {this.state.duration}</li>
                        </ul>
                    </div>
                </div>

                <div className="admin__add-section admin__add-playlist">
                    <div className='admin__section-title'>Create playlist</div>
                    Name: <input type="text" ref={ref => this.newPlaylistNameRef = ref} onChange={() => {this.setState({newPlaylistName: this.newPlaylistNameRef.value})}} />
                    <button className="admin__add" onClick={() => this.createPlaylist()}>
                        Create playlist
                    </button>
                </div>

                <div className="admin__playlists">
                    {playlists}
                </div>

                <div className="admin__songs">
                    <div className='admin__table-header'>
                            <div>Img</div>
                            <div>Title</div>
                            <div>artist</div>
                            <select name="filter" ref={ref => this.filterRef = ref} onChange={() => this.filterChangeHandler()}>
                                <option value="all">All</option>
                                <option value="current">Current</option>
                                {playlistOptions}
                            </select>
                    </div>
                    <div className='admin__table'>
                        {songlist}
                    </div>
                </div>
            </div>
        );
    }
}