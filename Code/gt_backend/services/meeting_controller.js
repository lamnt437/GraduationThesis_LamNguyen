const axios = require('axios');

exports.index = (req, res, next) => {
    // async, not finish immediately, next line will be execute 

    // const posts = async () => {
    //     try {
    //         return await axios.get('https:/jsonplaceholder.typicode.com/posts');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // console.log(posts);
    // res.send(posts);

    
    /* using callback */
    // axios.get('https:/jsonplaceholder.typicode.com/posts', (respose) => {
    //     res.send(response);
    // });
    axios.get('http://jsonplaceholder.typicode.com/posts')
        .then(function(response) {
            // console.log(response);
            // res.setHeader('Content-Type', 'application/json');
            // res.send(JSON.stringify(response));
            res.send(response.data);
        }).catch(function(error) {
            console.log(error);
        });

    // => axios request works for nodejs express server without csrf protection
    // normal server call server
    // back to work with request to create a new meeting using axios


    // pattern for async 
    // callback

    // promise
    // async/await
}

exports.create = (req, res, next) => {
    // send request to zoom cloud api
    // the same request used in postman
    // but how to add header to axios
    let payload = {
        'duration': 40,
        'start_time': '2021-03-19T17:00:00',
        'timezone': 'Asia/Ho_Chi_Minh',
        'topic': 'API Test',
        'type': 2,
        'password': '123456'
    };

    const AccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImtONE9PYzJGU3NlQm5FT1hZUzM1cGciLCJleHAiOjE2MTY1Nzg0OTYsImlhdCI6MTYxNTk3MzY5Nn0.qZKozy4nFV7WMzOSGy2FtBm7cjhBOIG8Vaz3wNHDUVI';
    const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';

    // setup axios instance
    // const authAxios = axios.create({
    //     baseURL: apiUrl,
    //     headers: {
    //         Authorization: `Bearer ${AccessToken}`
    //     }
    // });
    // still can't run

    // create a custom header using axios

    // how to send axios with payload?
    // how to send post request using axios
    const options = {
        headers: {
            Authorization: `Bearer ${AccessToken}`
        }
    }
    axios.post(apiUrl, payload, options)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
            res.send('Unexpected error!');
        })
}

function getUser(id, callback) {
    setTimeout(() => {
        console.log('Reading a user from a database...');
        callback({ id: id, githubUser: 'lam'})
    })
}

function getPosts(callback) {

}