import _ from '../src/underscore.js';

// defaults2
test('defaults2 > replacing data on complex objects', () => {
    var defaults = {
        name: 'unknown',
        contact: {
            phone: '9999999999',
            skype: 'xxxxx',
        },
        address: {
            1: {
                street: 'number 1',
            },
        },
    };
    var o = {
        name: 'underscore',
        contact: {
            email: 'team@underscore.org',
            phone: '11912345678',
            phones: [
                {
                    ddd: 11,
                    number: 33333333,
                },
            ],
        },
        address: {
            0: {
                street: 'number 2',
            },
        },
    };

    var r = _.defaults2(o, defaults);
    expect(
        r.name === 'underscore' &&
        r.contact.email === 'team@underscore.org' &&
        r.contact.phone === '11912345678' &&
        r.contact.skype === 'xxxxx' &&
        r.address[0].street === 'number 2' &&
        r.address[1].street === 'number 1' &&
        _.isArray(r.contact.phones),
    ).toBe(true);
});

test('defaults2 > replacing sub string with default sub object', () => {
    var defaults = {
        contact: {
            email: 'team@underscore.org',
            phone: '11912345678',
        },
    };
    var o = {
        contact: 'team@underscore.org',
    };

    var r = _.defaults2(o, defaults);
    expect(r.contact === 'team@underscore.org').toBe(true);
});

test('defaults2 > replacing sub object with default string', () => {
    var defaults = {
        contact: 'team@underscore.org',
    };
    var o = {
        contact: {
            email: 'team@underscore.org',
            phone: '11912345678',
        },
    };

    var r = _.defaults2(o, defaults);
    expect(
        r.contact.email === 'team@underscore.org' &&
        r.contact.phone === '11912345678',
    ).toBe(true);
});

test('defaults2 > testing different kind of objects in substitution [] vs {}', () => {
    var defaults = {
        perfis: {
            0: { perfil: 'A' },
            4: { perfil: 'R' },
        },
    };
    var o = {
        perfis: [{ perfil: 'P' }, { perfil: 'L' }],
    };

    var r = _.defaults2(o, defaults);

    expect(
        _.isArray(r.perfis) &&
        r.perfis.length === 2 &&
        r.perfis[0]['perfil'] === 'P' &&
        r.perfis[1]['perfil'] === 'L',
    ).toBe(true);
});

// deepValueSearch
var json = {
    name: 'underscore',
    contacts: [{ email: 'team@underscore.org' }, { email: 'admin@underscore.org' }],
};
test('deepValueSearch > "name" from : ' + JSON.stringify(json), () => {
    expect(_.deepValueSearch('name', json) === 'underscore').toBe(true);
});

test(
    'deepValueSearch > first email > "contacts[0][email]" from : ' +
    JSON.stringify(json),
    () => {
        expect(
            _.deepValueSearch('contacts[0][email]', json) === 'team@underscore.org',
        ).toBe(true);
    },
);

test(
    'deepValueSearch > list of emails > "contacts[][email]" from : ' +
    JSON.stringify(json),
    () => {
        var r = _.deepValueSearch('contacts[][email]', json);
        expect(_.isArray(r) && r.length === 2).toBe(true);
    },
);

test(
    'deepValueSearch > nonexistent list field > "nonexistent[data][email]" from : ' +
    JSON.stringify(json),
    () => {
        var r = _.deepValueSearch('nonexistent[data][email]', json);
        expect(typeof r === 'undefined').toBe(true);
    },
);

// json to html form
test(
    'jsonToHTMLForm > converting complex json to form data aspect > ' +
    JSON.stringify(json),
    () => {
        var r = _.jsonToHTMLForm(json);
        expect(
            r['name'] === 'underscore' &&
            r['contacts[1][email]'] === 'admin@underscore.org' &&
            r['contacts[0][email]'] === 'team@underscore.org',
        ).toBe(true);
    },
);

// deep key search
test(
    'deepKeySearch > search for any field like contacts[][email] such as contacts[0][email] and contacts[1][email] in ' +
    JSON.stringify(json),
    () => {
        var r = _.deepKeySearch('contacts[][email]', json);
        expect(
            r.length === 2 &&
            r[0] === 'contacts[0][email]' &&
            r[1] === 'contacts[1][email]',
        ).toBe(true);
    },
);

// is only object
test('isOnlyObject > testing against a json', () => {
    expect(_.isOnlyObject({})).toBe(true);
});
test('isOnlyObject > testing against an array', () => {
    expect(_.isOnlyObject([])).toBe(false);
});

// is json
test('isJSON > testing against a json', () => {
    expect(_.isJSON({})).toBe(true);
});
test('isJSON > testing against _', () => {
    expect(_.isJSON(_)).toBe(false);
});

// to object
test('toObject > testing convert', () => {
    var a = [4, 5],
        o = _.toObject(a);

    expect(_.isJSON(o) && _.size(o) === 2 && o['0'] === 4 && o['1'] === 5).toBe(
        true,
    );
});

// clone2
test('clone2 > deep cloning a object', () => {
    var o = { b: 0, c: { d: 0 } },
        c = _.clone2(o);
    c.b = 1;
    c.c.d = 1;

    expect(
        _.isJSON(c) && c.b === 1 && c.c.d === 1 && o.b === 0 && o.c.d === 0,
    ).toBe(true);
});

// isPlain
test('isPlainObject > deep cloning a object', () => {
    var o1 = { b: 0, c: { d: 0 } },
        o2 = { b: 0, c: 1 };

    expect(_.isPlainObject(o1) === false && _.isPlainObject(o2) === true).toBe(
        true,
    );
});

// matchAll
test('matchAll > locating every *na* or *no*', () => {
    var r = _.matchAll('bruno fernandes', /n[ao]/g);
    expect(_.size(r) === 2 && r[0]['index'] === 3 && r[1]['index'] === 9).toBe(
        true,
    );
});
test('matchAll > locating something unexistent', () => {
    var r = _.matchAll('bruno fernandes', /nao/g);
    expect(r === null).toBe(true);
});

// regex Index Of
test('regexIndexOf > locating first N that is at position 3', () => {
    expect(_.regexIndexOf('bruno fernandes', /n/g)).toBe(3);
});
test('regexIndexOf > locating first N that is at position 9 because the string was cut at position 4', () => {
    expect(_.regexIndexOf('bruno fernandes', /n/g, 4)).toBe(9);
});
test('regexIndexOf > locating first i where there is none', () => {
    expect(_.regexIndexOf('bruno fernandes', /i/g)).toBe(-1);
});

// regex Last Index Of
test('regexLastIndexOf > locating last N that is at position 11 ', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /n/g)).toBe(11);
});
test('regexLastIndexOf > locating last N that is at position 3 because the string was cut at position 7', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /n/g, 7)).toBe(3);
});
test('regexLastIndexOf > locating last i where there is none', () => {
    expect(_.regexLastIndexOf('bruno fernandes', /i/g)).toBe(-1);
});

// toDate
test('toDate > 2020-01-01 10:00', () => {
    var d = _.toDate('2020-01-01 10:00');
    expect(
        d.getDate() === 1 && d.getMonth() + 1 === 1 && d.getFullYear() === 2020,
    ).toBe(true);
});
test('toDate > 2020-10-20', () => {
    var d = _.toDate('2020-10-20');
    expect(
        d.getDate() === 20 &&
        d.getMonth() + 1 === 10 &&
        d.getFullYear() === 2020,
    ).toBe(true);
});

// parseUrl
test('parseUrl > valid url https://underscore.org/anything', () => {
    var m = _.parseUrl('https://underscore.org/anything');
    expect(
        m.port === 443 &&
        m.hostname === 'underscore.org' &&
        m.schema === 'https' &&
        m.path === '/anything',
    ).toBe(true);
});
test('parseUrl > invalid url anything', () => {
    var m = _.parseUrl('anything');
    expect(!m).toBe(true);
});
test('parseUrl > port detection http://underscore.org/anything', () => {
    var m = _.parseUrl('http://underscore.org/anything');
    expect(
        m.port === 80 &&
        m.hostname === 'underscore.org' &&
        m.schema === 'http' &&
        m.path === '/anything',
    ).toBe(true);
});
test('parseUrl > port detection ftp://underscore.org/anything', () => {
    var m = _.parseUrl('ftp://underscore.org/anything');
    expect(
        m.port === 21 &&
        m.hostname === 'underscore.org' &&
        m.schema === 'ftp' &&
        m.path === '/anything',
    ).toBe(true);
});
