async function displayCommits() {
    const user = await getUser(1); // function after 'await' is turned into a 'then' (callback)
    const repos = await getRepos(user.githubUser);
    const commits = await getCommits(repos[0]);
    console.log(commits)
}

displayCommits();

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