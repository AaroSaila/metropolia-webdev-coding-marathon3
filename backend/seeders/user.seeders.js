const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/user`;

async function seedUser(user) {
    console.log(`${BASE_URL}/`);
    try {
        const url = `${BASE_URL}/`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        console.log(res);
    } catch (error) {
        console.error(error);
    }
}


await seedUser({
    name: "John Doe",
    username: "John",
    password: "1234",
    phone_number: "12345678",
    gender: "male",
    date_of_birth: new Date(),
    membership_status: "member",
    address: "123 Fake St.",
    profile_picture: "link/to/picture"
});
