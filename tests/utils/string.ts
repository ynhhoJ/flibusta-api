import 'mocha';
import { expect, should } from 'chai';

import String from '@utils/string';

should();

describe('String', () => {
  describe('getNumbersFromString()', () => {
    it('should get numbers from string correctly', () => {
      let getNumbersFromStringResult = String.getNumbersFromString('as312dasd');

      expect(getNumbersFromStringResult).to.be.equal('312');

      getNumbersFromStringResult = String.getNumbersFromString('1000312312');

      expect(getNumbersFromStringResult).to.be.equal('1000312312');

      getNumbersFromStringResult = String.getNumbersFromString('999_123');

      expect(getNumbersFromStringResult).to.be.equal('999123');

      getNumbersFromStringResult = String.getNumbersFromString('-1');

      expect(getNumbersFromStringResult).to.be.equal('1');

      getNumbersFromStringResult = String.getNumbersFromString('');

      expect(getNumbersFromStringResult).to.be.equal('');

      getNumbersFromStringResult = String.getNumbersFromString('{}');

      expect(getNumbersFromStringResult).to.be.equal('');

      getNumbersFromStringResult = String.getNumbersFromString('undefined');

      expect(getNumbersFromStringResult).to.be.equal('');

      getNumbersFromStringResult = String.getNumbersFromString('/[0-9]/g');

      expect(getNumbersFromStringResult).to.be.equal('09');
    });
  });

  describe('containsComma()', () => {
    it('should return true value', () => {
      let containsCommaResult = String.containsComma('aaa,bbb');

      expect(containsCommaResult).to.be.equal(true);

      containsCommaResult = String.containsComma('aa,aa,bbb');

      expect(containsCommaResult).to.be.equal(true);

      containsCommaResult = String.containsComma('1,2,3,4');

      expect(containsCommaResult).to.be.equal(true);

      containsCommaResult = String.containsComma(',,,,');

      expect(containsCommaResult).to.be.equal(true);

      containsCommaResult = String.containsComma('{asds,--_-}');

      expect(containsCommaResult).to.be.equal(true);
    });

    it('should return false value', () => {
      let containsCommaResult = String.containsComma('aaabbb');

      expect(containsCommaResult).to.be.equal(false);

      containsCommaResult = String.containsComma('aaaabbb');

      expect(containsCommaResult).to.be.equal(false);

      containsCommaResult = String.containsComma('1234');

      expect(containsCommaResult).to.be.equal(false);

      containsCommaResult = String.containsComma('');

      expect(containsCommaResult).to.be.equal(false);

      containsCommaResult = String.containsComma('{asds_-_-}');

      expect(containsCommaResult).to.be.equal(false);
    });
  });

  describe('getStringMatches()', () => {
    it('should return an array with matched string', () => {
      const regexRule = /\d+ книг/g;

      let matchStringResult = String.getStringMatches('123 книг', regexRule);

      expect(matchStringResult).to.be.eql(['123 книг']);

      matchStringResult = String.getStringMatches('121-3 книг', regexRule);

      expect(matchStringResult).to.be.eql(['3 книг']);
    });

    it('should return null', () => {
      const regexRule = /\d+ книг/g;

      let matchStringResult = String.getStringMatches('[] книг', regexRule);

      // eslint-disable-next-line unicorn/no-null
      expect(matchStringResult).to.be.equal(null);

      matchStringResult = String.getStringMatches('aa книг', regexRule);

      // eslint-disable-next-line unicorn/no-null
      expect(matchStringResult).to.be.equal(null);

      matchStringResult = String.getStringMatches('{} книг', regexRule);

      // eslint-disable-next-line unicorn/no-null
      expect(matchStringResult).to.be.equal(null);

      matchStringResult = String.getStringMatches('1-2-3_4_5% книг', regexRule);

      // eslint-disable-next-line unicorn/no-null
      expect(matchStringResult).to.be.equal(null);
    });
  });

  describe('concatenateString()', () => {
    it('should return concatenated string from array of strings', () => {
      let concatenateStringResult = String.concatenateString(['a', 'b']);

      expect(concatenateStringResult).to.be.equal('ab');

      concatenateStringResult = String.concatenateString(['a']);

      expect(concatenateStringResult).to.be.equal('a');

      concatenateStringResult = String.concatenateString(['a', ' b', 'c']);

      expect(concatenateStringResult).to.be.equal('a bc');

      concatenateStringResult = String.concatenateString(['a', ' z', '']);

      expect(concatenateStringResult).to.be.equal('a z');
    });
  });
});
