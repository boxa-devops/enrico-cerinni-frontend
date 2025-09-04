/**
 * Class Name Utility
 * 
 * A utility function for conditionally joining classNames together.
 * This is a lightweight alternative to the popular 'clsx' library.
 * 
 * @param {...(string|Object|Array)} inputs - The class names to join
 * @returns {string} The joined class names
 * 
 * @example
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', { bar: true, baz: false }) // 'foo bar'
 * cn('foo', ['bar', 'baz']) // 'foo bar baz'
 * cn('foo', condition && 'bar') // 'foo bar' if condition is true, 'foo' if false
 */

export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const nestedClasses = cn(...input);
      if (nestedClasses) {
        classes.push(nestedClasses);
      }
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

export default cn;
