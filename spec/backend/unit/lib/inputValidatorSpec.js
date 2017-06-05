'use strict';

const moment = require('moment');
require('../../../support/specHelper');

var inputValidator = require('../../../../src/backend/lib/inputValidator');

describe('inputValidator', () => {
    describe('isValidName', () => {
        it('Should return true given an alpha name', () => {
            expect(inputValidator.isValidName('aaa')).toBe(true);
        });

        it('Should return true if name is a alphanumeric', () => {
            expect(inputValidator.isValidName('Flo the 1st')).toBe(true);
        });

        [
            undefined,
            '',
            null,
            'a'.repeat(256),
            'Flo the 1st<'
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(inputValidator.isValidName(testCase)).toBe(false);
            });
        });
    });

    describe('isValidEmail', () => {
        it('Should return true given a string with an \'@\' and a \'.\'', () => {
            expect(inputValidator.isValidEmail('aaa@attt.com')).toBe(true);
        });
    });

    describe('isValidPassword', () => {
        [
            'I am a long password',
            '1 w1ll b3 4gott3n',
            '12345678910'
        ].forEach((testCase) => {
            it(`Should return true given a password ${testCase}`, () => {
                expect(inputValidator.isValidPassword(testCase)).toBe(true);
            });
        });

        [
            'toolittle',
            'a'.repeat(201),
            undefined,
            null
        ].forEach((testCase) => {
            it(`Should return false given password is ${testCase}`, () => {
                expect(inputValidator.isValidPassword(testCase)).toBe(false);
            });
        });
    });

    describe('isValidPhoneNumber', () => {
        [
            '+61472817381',
            '0328171381',
            '0428171331',
            '04-2817-133-1',
            '04 2817 1331',
            '+1555-555-5555',
            '+1(555)555-5555',
            '+65 2345 7908',
            '+18-1111-1111111'
        ].forEach((testCase) => {
            it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
                expect(inputValidator.isValidPhone(testCase)).toBe(true);
            });
        });

        [
            '',
            '-;',
            ' 0 0 1;',
            null,
            'words?'
        ].forEach((testCase) => {
            it(`Should return false if phone is ${testCase}`, () => {
                expect(inputValidator.isValidPhone(testCase)).toBe(false);
            });
        });
    });

    describe('isValidDateOfBirth', () => {
        it('Should return true given a string with a dateOfBirth', () => {
            expect(inputValidator.isValidDate('22/12/1900')).toBe(true);
        });

        let testCases = [
            null,
            '',
            '21 Dec 2015',
            moment().add(7, 'days'),
            '222/12/1900'
        ];

        testCases.forEach((input) => {
            it(`Should return false given a ${input} dateOfBirth`, () => {
                expect(inputValidator.isValidDate(input)).toBe(false);
            });
        });
    });

    describe('isValidYear', () => {
      [
          '2000',
          '2016',
          '1999'
      ].forEach((testCase) => {
          it(`Should return true given a string with a birth year in range ${testCase}`, () => {
              expect(inputValidator.isValidYear(testCase)).toBe(true);
          });
      });

      [
          '',
          '1899',
          null,
          '2037',
          'words?'
      ].forEach((testCase) => {
          it(`Should return false given a non year string or out of range ${testCase}`, () => {
              expect(inputValidator.isValidYear(testCase)).toBe(false);
          });
      });
    });

    describe('isValidOptionalName', () => {
        let validTestCases = [
            null,
            '',
            undefined,
            'A valid name'
        ];

        validTestCases.forEach((input) => {
            it(`should return true if given a ${input} value`, () => {
                expect(inputValidator.isValidOptionalName(input)).toBe(true);
            });
        });

        let testCases = [
            'a'.repeat(256),
            'Flo the 1st<'
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(inputValidator.isValidOptionalName(input)).toBe(false);
            });
        });
    });

    describe('isValidText', () => {

        let validTestCases = [
            'A valid text block',
            'Flo the 1st<',
            'a'.repeat(255)
        ];

        validTestCases.forEach((input) => {
            it(`should return true if given a ${input} value`, () => {
                expect(inputValidator.isValidText(input)).toBe(true);
            });
        });

        let testCases = [
            null,
            '',
            undefined,
            'a'.repeat(256)
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(inputValidator.isValidText(input)).toBe(false);
            });
        });
    });

    describe('isValidOptionalTextBlock', () => {

        let validTestCases = [
            null,
            '',
            undefined,
            'A valid text block',
            'Flo the 1st<',
            'a'.repeat(99999)
        ];

        validTestCases.forEach((input) => {
            it(`should return true if given a ${input} value`, () => {
                expect(inputValidator.isValidOptionalTextBlock(input)).toBe(true);
            });
        });

        let testCases = [
            'a'.repeat(100000)
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(inputValidator.isValidOptionalTextBlock(input)).toBe(false);
            });
        });
    });

    describe('isValidTextBlock', () => {
      it('Should be valid if it is a big string', () => {
        expect(inputValidator.isValidTextBlock('a'.repeat(99999))).toBe(true);
      });

      [
          '',
          'a'.repeat(100000),
          null,
          undefined
      ].forEach((testCase) => {
          it(`Should return false if the block is ${testCase}`, () => {
              expect(inputValidator.isValidTextBlock(testCase)).toBe(false);
          });
      });

    });


    describe('isValidUUID', () => {

        it('should return true for V4 uuids', () => {
            expect(inputValidator.isValidUUID('5d773d92-47fb-4ad5-90c0-72c1b6e4af3a')).toBe(true);
        });

        it('should return false for non V4 uuids', () => {
            expect(inputValidator.isValidUUID('4df38c00-e65a-11e5-a8bf-ed9212c0336b')).toBe(false);
        });


        let testCases = [
            'a'.repeat(20),
            null,
            undefined,
            1
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(inputValidator.isValidUUID(input)).toBe(false);
            });
        });
    });
});
