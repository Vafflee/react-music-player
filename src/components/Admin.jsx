import config from '../config/config';
import React from 'react';
import placeholder from '../img/cover.jpg';
const jsmt = window.jsmediatags;

export default class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            title: null,
            artist: null,
            duration: null,
            cover: null,
            records: null
        }
        this.fileRef = null; //file input ref
        this.titleRef = null; //title input ref
        this.artistRef = null; //artist input ref
    }

    componentDidMount() {
        this.getRecords();
    }

    async getRecords() {
        const response = await fetch(config.url + '/record', {
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

    async uploadSong() {
        const songfile = this.fileRef.files[0];
        const coverfile = this.state.cover;
        const info = {
            title: this.state.title,
            artist: this.state.artist
        };
        
        let formData = new FormData();

        // add file to FormData object
        const fd = new FormData();
        fd.append('song', songfile);
        fd.append('cover', coverfile);
        // fd.append('info', JSON.stringify(info));
        fd.append('info', 'sometext');

        // send `POST` request
        fetch(config.url + '/uploadfile/' + JSON.stringify(info), {
            method: 'POST',
            headers: {
                'x-access-token': this.props.token ?? null
            },
            body: fd
        })
        .then(res => res.json())
        .then(json => {console.log('Response: '); console.log(json); this.getRecords()})
        .catch(err => {console.log('Error: '); console.error(err)});
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

    render() {
        
        let coverurl = this.state.cover ? URL.createObjectURL(this.state.cover) : placeholder;


        let songlist = null;
        if (this.state.records) {
            songlist = this.state.records.map((song) => 
                <tr key={song._id} className="admin__element">
                    <td className="admin__song-cover">
                        <img src={song.cover ? config.url + '/songcover/' + song.cover : placeholder} alt={song.name + 'cover'} />
                    </td>
                    <td className="admin__song-title">{song.title}</td>
                    <td className="admin__song-artist">{song.artist}</td>
                    <td className="admin__song-delete"><button className='admin__delete-btn' onClick={() => this.deleteSong(song._id)}>X</button></td>
                </tr>
            );
        } 

        return(
            <div className={this.props.className + " admin"}>
                <div className="admin__add-section">
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
                                <li>Duration: {this.state.duration}</li>
                            </ul>
                    </div>
                </div>
                <table className="admin__songs">
                    <thead className='admin__table-header'>
                        <tr>
                            <th>Img</th>
                            <th>Title</th>
                            <th>artist</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {songlist}
                    </tbody>
                </table>
            </div>
        );
    }
}