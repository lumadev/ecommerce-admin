import { describe, expect, it } from 'vitest';
import { isValidEmail, isValidPostalCode } from './validation';

describe('isValidEmail', () => {
  it.each([
    'person@example.com',
    'first.last+tag@shop.example.com',
    'PERSON@EXAMPLE.COM',
    ' person@example.com ',
    `person@${'a'.repeat(63)}.com`,
  ])('accepts valid email format: %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    '',
    'person',
    'person@example',
    'person@@example.com',
    'person name@example.com',
    '<person>@example.com',
    'person,admin@example.com',
    '.person@example.com',
    'person.@example.com',
    'first..last@example.com',
    'person@example..com',
    'person@-example.com',
    'person@example-.com',
  ])('rejects invalid email format: %s', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it('rejects domain labels longer than 63 characters', () => {
    const longLabel = 'a'.repeat(64);

    expect(isValidEmail(`person@${longLabel}.com`)).toBe(false);
  });
});

describe('isValidPostalCode', () => {
  it.each([
    '12345678',
    '12345-678',
    ' 12345-678 ',
  ])('accepts valid Brazilian postal code format: %s', (postalCode) => {
    expect(isValidPostalCode(postalCode)).toBe(true);
  });

  it.each([
    '',
    '1234567',
    '123456789',
    '1234-5678',
    '12345--678',
    '12345 678',
    '1234A-678',
    '-12345678',
  ])('rejects invalid Brazilian postal code format: %s', (postalCode) => {
    expect(isValidPostalCode(postalCode)).toBe(false);
  });
});