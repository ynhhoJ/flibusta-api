class Lang {
  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
   * classified as numbers, use the `_.isFinite` method.
   *
   * Source https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L11973
   *
   * @static
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a number, else `false`.
   */
  public static isNil(value: unknown): value is null | undefined {
    // eslint-disable-next-line eqeqeq, unicorn/no-null
    return value == null;
  }
}

// eslint-disable-next-line import/prefer-default-export
export const { isNil } = Lang;
