import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRegistrationName } from '../src/controllers/users.js';

test('uses the submitted name when present', () => {
    assert.equal(extractRegistrationName({ name: 'Ada' }), 'Ada');
});

test('falls back to firstName when name is missing', () => {
    assert.equal(extractRegistrationName({ firstName: 'Grace' }), 'Grace');
});

test('falls back to username when neither name nor firstName is present', () => {
    assert.equal(extractRegistrationName({ username: 'grace' }), 'grace');
});

test('defaults to a safe fallback when no name field is provided', () => {
    assert.equal(extractRegistrationName({}), 'User');
});
