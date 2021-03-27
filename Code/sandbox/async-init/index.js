console.log('Begin')
// getUser(1, function(user) {
//     getRepo(user.githubUser, function(repolist) {
//         getCommits(repo, (repo) => {
//             console.log("Reading commits...")
//         })
//     })
// })

getUser(1)
    .then(user => getRepos(user.githubUser))
    .then(repos => getCommits(repos[0]))
    .then(commits => displayCommits(commits))

console.log('After')

function displayCommits(commits) {
    console.log(commits)
}

function getUser(id) {
    return new Promise((resolve, reject) => {
        // kick off some async work
        setTimeout(() => {
            console.log("Reading from database...");
            resolve({id: id, githubUser: "Lam Nguyen"});
        }, 2000);
    })
}

function getRepos(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading user's repos");
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    })
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Reading commits from repo.. ");
            resolve(['commit1', 'commit2', 'commit3']);
        }, 2000);
    })
}
// -> nonblocking
// which function is nonblocking?

// callback
// promise
// async/await

// callback hell