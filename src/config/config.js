export default {
    // url: 'http://localhost:5000',
    url: process.env.NODE_ENV === 'production' ? 'https://antistress-player.herokuapp.com' : 'http://localhost:4000',
    port: process.env.PORT || 4000
};