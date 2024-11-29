describe('User API End-to-End Test', () => {
    const baseUrl = 'https://gorest.co.in/public/v2/users';
    let userRequestUrl;
    const token = 'a8a3b8f20f41e52d1c9d5741d4da11f68e02dd915bae05666a0985dd8e1005b6';
    const user = {
        name: 'Test User',
        gender: 'male',
        email: `testuser_${Date.now()}@example.com`,
        status: 'active',
    };

    const updatedUser ={
        name: 'Updated User',
        email: `updateduser_${Date.now()}@example.com`,
        status: 'active',
    };
    let userId;


    beforeEach(function () {
        this.requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    });

    function checkUserDataValidity(responseUser, userToCheck, checkEmail = false, checkGender = false) {
        expect(responseUser.name).to.eq(userToCheck.name);
        expect(responseUser.status).to.eq(userToCheck.status);

        if (checkEmail) {
            expect(responseUser.email).to.eq(userToCheck.email);
        }

        if (checkGender) {
            expect(responseUser.gender).to.eq(userToCheck.gender);
        }
    }


    it('should create a new user', function () {
        cy.request({
            method: 'POST',
            url: baseUrl,
            ...this.requestOptions,
            body: user,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            userId = response.body.id;
            userRequestUrl = `${baseUrl}/${userId}`;
            checkUserDataValidity(response.body, user, true, true);
        });
    });


    it('should fetch the created user by ID', function () {
        cy.request({
            method: 'GET',
            url: userRequestUrl,
            ...this.requestOptions,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(userId);
            checkUserDataValidity(response.body, user, false, true);
        });
    });


    it('should update the user info', function () {
        cy.request({
            method: 'PATCH',
            url: userRequestUrl,
            ...this.requestOptions,
            body: updatedUser,
        }).then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.id).to.eq(userId);
            checkUserDataValidity(response.body, updatedUser, true);
        });

        cy.request({
            method: 'GET',
            url: userRequestUrl,
            ...this.requestOptions,
        }).then((response) => {
            expect(response.status).to.eq(200);
            checkUserDataValidity(response.body, updatedUser, true);
        });
    });


    it('should delete the user', function () {
        cy.request({
            method: 'DELETE',
            url: userRequestUrl,
            ...this.requestOptions,
        }).then((response) => {
            expect(response.status).to.eq(204);
        });

        cy.request({
            method: 'GET',
            url: userRequestUrl,
            ...this.requestOptions,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });
});
