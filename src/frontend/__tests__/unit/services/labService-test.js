'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

    let server;
    let validData = {
        id: '1234',
        name: 'melbourne',
        notes: undefined,
        contact: undefined
    };
    let invalidData = {data: 'invalid'};
    let lab = {
        id: '1234',
        name: 'melbourne'
    };

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
    });

    afterEach(() => {
        server.restore();
    });

    describe('delete', () => {

        describe('when the id is valid', () => {
            beforeEach(() => {
                server.respondWith('DELETE', '/branches/1234/', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify('good')
                ]);
            });

            it('should send a request to delete the organiser from the lab', (done) => {

                labService.delete(lab)
                    .then((result) => {
                        expect(result).toEqual('good');
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });

        });

        describe('when the remote rejects the request', () => {
            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('DELETE', '/branches/1234/', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    labService.delete(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('DELETE', '/branches/1234/', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.delete(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('DELETE', '/branches/1234/', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.delete(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

        });
    });

    describe('update', () => {

        describe('when the branch provided is valid', () => {

            beforeEach(() => {
                server.respondWith('PUT', '/branches/1234/', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to update the branch', (done) => {

                labService.update(lab)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });
        });

        describe('when the branch returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('PUT', '/branches/1234/', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });


            it('should return an error that return data was invalid', (done) => {

                labService.update(lab)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    labService.update(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.update(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.update(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });
        });

    });

    describe('create', () => {

        describe('when the lab provided is valid', () => {

            beforeEach(() => {
                server.respondWith('POST', '/branches/', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to save a new lab for the branch', (done) => {

                labService.create(lab)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });

        });

        describe('when the lab returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('POST', '/branches/', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });

            it('should return an error that return data was invalid', (done) => {

                labService.create(lab)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/branches/', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    labService.create(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/branches/', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.create(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('POST', '/branches/', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    labService.create(lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });
        });
    });


    describe('getLabGroups', () => {

        let validGroupsPayload =
            [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Tuesday',
                    description: 'Hi'
                },
                {
                    id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                    name: 'Wednesday',
                    description: 'Hi'
                }
            ];

        describe('when the groups are retrieved in a valid format', () => {

            beforeEach(() => {
                server.respondWith('GET', '/branches/112-11-21-2/groups',
                          [200, { 'Content-Type': 'application/json' },
                           JSON.stringify({groups: validGroupsPayload})]);
            });

          it('should return a list of the labs', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then((groups) => {
                expect(groups).toEqual(validGroupsPayload);
              })
              .then(done, done.fail);
          });
        });

        describe('when the branch id is undefined', () => {
            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabGroups()
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });
        });

        describe('when the groups are retrieved in an invalid format', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups',
                        [200, { 'Content-Type': 'application/json' },
                         JSON.stringify({invalid: invalidData})]);
          });

          it('should return an error that return data was invalid', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });
          });
        });

        describe('when the remote groups are 401 unauthorised', () => {

            beforeEach(() => {
              server.respondWith('GET', '/branches/112-11-21-2/groups', [401, {}, '']);
            });

            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabGroups('112-11-21-2')
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });

        });

        describe('when the remote groups are 404 not found', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups', [404, {}, '']);
          });

          it('should return an error that the remote endpoint was not found', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT FOUND');
                done();
              });
          });

        });

        describe('when the remote returns a 500 server error', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups', [500, {}, '']);
          });

          it('should return a general server error', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });

          });

        });

    });

    describe('getLabParticipants', () => {

        let validParticipantsPayload = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            firstName: 'Jo jo',
            lastName: 'The 3rd',
            contactFirstName: 'Jo',
            contactLastName: 'The 2nd',
            primaryPhoneNumber: '101010010',
            email: 'jo@jo.com',
            dateOfBirth: '1990',
            schoolType: 'Primary',
            memberSince: '2016-03-08T22:34:23.721Z',
            pastoralNotes: 'Some pastoral notes',
            additionalInfo: 'Some additional info',
            groups: [{id: 1, name: 'Group name'}],
            branchId: '1234'
        }];

        let validResult = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            participantName: 'Jo jo',
            participantLastName: 'The 3rd',
            contactName: 'Jo',
            contactLastName: 'The 2nd',
            contactNumber: '101010010',
            contactEmail: 'jo@jo.com',
            participantBirthYear: '1990',
            schoolType: 'Primary',
            memberSince: '2016-03-08T22:34:23.721Z',
            pastoralNotes: 'Some pastoral notes',
            additionalInfo: 'Some additional info',
            groups: [{id: 1, name: 'Group name'}],
            labId: '1234'
        }];

        describe('when the participants are retrieved in a valid format', () => {

            beforeEach(() => {
                server.respondWith('GET', '/branches/112-11-21-2/members',
                          [200, { 'Content-Type': 'application/json' },
                           JSON.stringify({members: validParticipantsPayload})]);
            });

          it('should return a list of the participants for the lab', (done) => {
            labService.getLabParticipants('112-11-21-2')
              .then((participants) => {
                expect(participants).toEqual(validResult);
              })
              .then(done, done.fail);
          });
        });

        describe('when the branch id is undefined', () => {
            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabParticipants()
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });
        });

        describe('when the participants are retrieved in an invalid format', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members',
                        [200, { 'Content-Type': 'application/json' },
                         JSON.stringify({invalid: invalidData})]);
          });

          it('should return an error that return data was invalid', (done) => {
            labService.getLabParticipants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });
          });
        });


        describe('when the remote participants are 404 not found', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members', [404, {}, '']);
          });

          it('should return an error that the remote endpoint was not found', (done) => {
            labService.getLabParticipants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT FOUND');
                done();
              });
          });

        });

        describe('when the remote participants are 401 unauthorised', () => {

            beforeEach(() => {
              server.respondWith('GET', '/branches/112-11-21-2/members', [401, {}, '']);
            });

            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabParticipants('112-11-21-2')
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });

        });

        describe('when the remote returns a 500 server error', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members', [500, {}, '']);
          });

          it('should return a general server error', (done) => {
            labService.getLabParticipants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });

          });

        });

    });

  describe('getMyLabs', () => {

      let validLabsPayload =
          [
              {
                  id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                  name: 'Lab 1',
                  notes: 'note',
                  contact: 'somebody'
              },
              {
                  id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                  name: 'Lab 2',
                  notes: 'note',
                  contact: 'somebody'
              }
          ];

      describe('when the labs are retrieved in a valid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({branches: validLabsPayload})]);
        });

        it('should return a list of the labs', (done) => {
          labService.getMyLabs()
            .then((branches) => {
              expect(branches).toEqual(validLabsPayload);
            })
            .then(done, done.fail);
        });
      });

      describe('when the labs are retrieved in an invalid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({invalid: invalidData})]);
        });

        it('should return an error that return data was invalid', (done) => {
          labService.getMyLabs()
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail((error) => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });
        });
      });


      describe('when the remote labs are 404 not found', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches', [404, {}, '']);
        });

        it('should return an error that the remote endpoint was not found', (done) => {
          labService.getMyLabs()
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail((error) => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });

      });

      describe('when the remote returns a 500 server error', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches', [500, {}, '']);
        });

        it('should return a general server error', (done) => {
          labService.getMyLabs()
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail((error) => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });

        });

      });

  });

  describe('getLabList', () => {

      let validLabsPayload =
          [
              {
                  id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                  name: 'Lab 1',
                  notes: 'note',
                  contact: 'somebody'
              },
              {
                  id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                  name: 'Lab 2',
                  notes: 'note',
                  contact: 'somebody'
              }
          ];

    describe('when the labs are retrieved in a valid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({branches: validLabsPayload})]);
      });

      it('should return a list of the labs', (done) => {
        labService.getLabList()
          .then((branches) => {
            expect(branches).toEqual(validLabsPayload);
          })
          .then(done, done.fail);
      });
    });

    describe('when the labs are retrieved in an invalid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({invalid: invalidData})]);
      });

      it('should return an error that return data was invalid', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });
      });
    });


    describe('when the remote labs are 404 not found', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches', [404, {}, '']);
      });

      it('should return an error that the remote endpoint was not found', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('NOT FOUND');
            done();
          });
      });

    });

    describe('when the remote returns a 500 server error', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches', [500, {}, '']);
      });

      it('should return a general server error', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });

      });
    });
  });
});
