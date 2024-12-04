const BASE_URL = `http://localhost:${process.env.PORT}/api/users`;

const USERS = [
    {
        name: "John Doe",
        username: "John",
        password: "1234",
        phone_number: "1234567",
        gender: "m",
        date_of_birth: new Date(),
        membership_status: "member",
        address: "123 Fake St.",
        profile_picture: "profile/pic/url"
    }
];


async function seedUser(user) {
    const url = BASE_URL + "/signup";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    
    if (res.ok) {
        const json = await res.json();
        console.log(json);
    } else {
        console.error(res);
        const json = await res.json();
        console.error(json);
    }
}


USERS.forEach(user => seedUser(user));
