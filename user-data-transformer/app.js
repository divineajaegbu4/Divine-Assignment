const mockFetchUsers = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Alex Architect', company: { name: 'BuildCo' } },
                { id: 2, name: 'Jane Developer', company: { name: 'CodeStream' } }
            ]);
        }, 1000);
    });
};


const processUsers = async() => {
    const users = await mockFetchUsers();

    return users.map(user => {
        const {name, company } = user;
        const {name: companyName} = company;

        return {name, companyName}

        
    })


}


console.log(await processUsers())

// async function runMockFetchUsers() {
//     const msg = await mockFetchUsers();

//     console.log(msg)
// }

// runMockFetchUsers()
