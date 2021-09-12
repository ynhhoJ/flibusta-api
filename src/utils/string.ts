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
}

export default String;
