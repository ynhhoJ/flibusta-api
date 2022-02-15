//
import { Nullable } from '../../types/generals';

class String {
  public static getNumbersFromString(string: string): string {
    return string.replace(/\D/g, '');
  }

  public static isComma(string: string): boolean {
    return /,/.test(string);
  }

  public static getStringMatches(string: string, regexRule: RegExp): Nullable<Array<string>> {
    return string.match(regexRule);
  }

  public static concatenateString(arrayWithString: Array<string>): string {
    return arrayWithString.join('');
  }
}

export default String;
