'use strict';
require('../../support/specHelper');
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
let integrationTestHelpers = require('./integrationTestHelpers.js');
let uuid = require('node-uuid');


let hasAdmin = (res) => {
    if (!(res.body.email)) {
        throw new Error('missing created admin');
    }
};

let makeSuperAdmin = (email) => {
    email = email || 'supaAdmin@thelab.org';
    return {
        email: email,
        password: 'supaP@sw0r dddd!!'
    };
};

function postSuperAdmin(someAgent, email) {
    return function() {
        return someAgent.post('/admins')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(makeSuperAdmin(email))
        .expect(200);
    };
}

let makeAdminUser = (branch) => {
    return {
        email: 'newOrgnrr@thelab.org',
        password: 'ooooooorganiser',
        branchId: branch.id
    };
};

let makeAdminUserUpdates = (admin) => {
    return {
        email: admin.email,
        password: 'nooo password',
        branchId: admin.branchId,
        id: admin.id,
        name: 'some name',
        phoneNumber: '04030403'
    };
};

let makeInvalidAdminUserUpdates = (admin) => {
    return {
        email: 'bad-email',
        password: 'nooo password',
        branchId: admin.branchId,
        id: admin.id,
        name: 'some name',
        phoneNumber: '04030403'
    };
};

let makeAdminUserUpdateWithoutPassword = (admin) => {
    return {
        email: admin.email,
        branchId: admin.branchId,
        id: admin.id,
        name: 'some name',
        phoneNumber: '04030403'
    };
};

let makeInvalidUser = (branch) => {
    let admin = makeAdminUser(branch);
    admin.email = null;
    return admin;
};

describe('AdminIntegrationTests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    describe('add', () => {
        beforeEach((done) => {
            integrationTestHelpers.createBranch().nodeify(done);
        });

        it('should return 200 and a created user when the input is valid', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .send(makeAdminUser(branch))
                    .expect(200)
                    .then(hasAdmin);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeInvalidUser(branch))
                    .expect(400);
            })
            .then(done, done.fail);
        });
    });

    describe('delete', () => {
        it('should return a 200 when the admin is successfully deleted', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/${adminUser.dataValues.id}`)
                    .expect(200);
                })
                .then(done, done.fail);
        });

        it('should return a 400 if the input data is not valid', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/whatevs`)
                    .expect(400);
                })
                .then(done, done.fail);
        });

        it('should return 500 when trying to delete a admin that does not exist', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/${uuid.v4()}`)
                    .expect(500);
                })
                .then(done, done.fail);
        });
    });

    describe('update', () => {
        it('should return 200 and an updated user when the input is valid', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((adminUser) => {
                return agent.put(`/branches/${adminUser.dataValues.branchId}/admins/${adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .send(makeAdminUserUpdates(adminUser))
                    .expect(200)
                    .then(hasAdmin);
            })
            .then(done, done.fail);
        });

        it('should allow update without the password field in the payload', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((adminUser) => {
                return agent.put(`/branches/${adminUser.dataValues.branchId}/admins/${adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeAdminUserUpdateWithoutPassword(adminUser))
                    .expect(200)
                    .then(hasAdmin);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((adminUser) => {
                return agent.put(`/branches/${adminUser.dataValues.branchId}/admins/${adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((adminUser) => {
                return agent.put(`/branches/${adminUser.dataValues.branchId}/admins/whatevs`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeInvalidAdminUserUpdates(adminUser))
                    .expect(400);
            })
            .then(done, done.fail);
        });
    });

    describe('super admins', () => {
        describe('add', () => {
            beforeEach((done) => {
                integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(done, done.fail);
            });

            it('should return a 200 when a super admin is successfully created', (done) => {
                return agent.post('/admins')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeSuperAdmin())
                    .expect(200)
                    .then((response) => {
                        expect(response.body).not.toBeNull();
                        expect(response.body.id).not.toBeNull();
                        expect(response.body.email).not.toBeNull();
                    })
                    .then(done, done.fail);
            });

            it('should return a 400 when the payload is invalid', (done) => {
                return agent.post('/admins')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({email: 'supaAdmin@thelab.org'})
                    .expect(400)
                    .then(done, done.fail);
            });

            it('should allow only super admins to add super admins', (done) => {
                let specialAgent = request.agent(app);

                integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => {
                    return specialAgent.post('/admins')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeSuperAdmin())
                    .expect(401);
                })
                .then(done, done.fail);
            });
        });

        describe('update', () => {

            let browserState = {};

            beforeEach((done) => {
                integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent))
                .then((response) => {
                    browserState.superAdmin = response.body;
                })
                .then(done, done.fail);
            });

            afterEach(() => {
                browserState = {};
            });

            it('should return a 200 when a super admin is successfully created', (done) => {
                let withUpdates = Object.assign({}, browserState.superAdmin, {name: 'My New Name'});

                return agent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(withUpdates)
                    .expect(200)
                    .then((response) => {
                        expect(response.body).not.toBeNull();
                        expect(response.body.id).not.toBeNull();
                        expect(response.body.email).toEqual(browserState.superAdmin.email);
                        expect(response.body.name).toEqual('My New Name');
                    })
                    .then(done, done.fail);
            });

            it('should return a 400 when the payload is invalid', (done) => {
                return agent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({email: 'supaAdmin@thelab.org'})
                    .expect(400)
                    .then(done, done.fail);
            });

            it('should allow only super admins to update super admins', (done) => {
                let specialAgent = request.agent(app);

                integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => {
                    return specialAgent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeSuperAdmin())
                    .expect(401);
                })
                .then(done, done.fail);
            });
        });

        describe('list', () => {
            it('should return a 200 when a super admins list is retrieved', (done) => {
                integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent, 'bal@asd.co'))
                .then(postSuperAdmin(agent))
                .then(() => {
                    return agent.get('/admins')
                    .expect(200)
                    .then((response) => {
                        let theOneCreatedToAuthenticateTheRequest = 1;
                        expect(response.body).not.toBeNull();
                        expect(response.body.admins).not.toBeNull();
                        expect(response.body.admins.length).toEqual(2 + theOneCreatedToAuthenticateTheRequest);
                    });
                })
                .then(done, done.fail);
            });

            it('should allow only super admins to get the admins list', (done) => {
                let specialAgent = request.agent(app);

                integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => {
                    return specialAgent.get('/admins')
                    .expect(401);
                })
                .then(done, done.fail);
            });
        });

        describe('delete', () => {

            let browserState = {};

            beforeEach((done) => {
                integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent))
                .then((response) => {
                    browserState.superAdmin = response.body;
                })
                .then(done, done.fail);
            });

            afterEach(() => {
                browserState = {};
            });

            it('should return a 200 when a super admin is successfully created', (done) => {
                return agent.delete(`/admins/${browserState.superAdmin.id}`)
                    .expect(200)
                    .then(done, done.fail);
            });

            it('should return a 400 when the payload is invalid', (done) => {
                return agent.delete(`/admins/whatevs`)
                    .expect(400)
                    .then(done, done.fail);
            });

            it('should allow only super admins to update super admins', (done) => {
                let specialAgent = request.agent(app);

                integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => {
                    return specialAgent.delete(`/admins/someId`)
                    .expect(401);
                })
                .then(done, done.fail);
            });
        });
    });
});
