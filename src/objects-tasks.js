/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns shallow copy of an object.
 */
function shallowCopy(obj) {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

/**
 * Merges array of objects into a single object. If there are overlapping keys, the values
 * should be summed.
 */
function mergeObjects(objects) {
  return objects.reduce((acc, obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });
    return acc;
  }, {});
}

/**
 * Removes a properties from an object.
 */
function removeProperties(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Compares two source objects. Returns true if the objects are equal and false otherwise.
 */
function compareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
  );
}

/**
 * Checks if the source object is empty.
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Makes the source object immutable by preventing any changes to its properties.
 */
function makeImmutable(obj) {
  return Object.freeze(obj);
}

/**
 * Returns a word from letters whose positions are provided as an object.
 */
function makeWord(lettersObject) {
  const result = [];
  Object.keys(lettersObject).forEach((letter) => {
    lettersObject[letter].forEach((pos) => {
      result[pos] = letter;
    });
  });
  return result.join('');
}

/**
 * Queue for tickets.
 */
function sellTickets(queue) {
  let cash25 = 0;
  let cash50 = 0;

  return queue.every((bill) => {
    if (bill === 25) {
      cash25 += 1;
      return true;
    }
    if (bill === 50) {
      if (cash25 < 1) return false;
      cash25 -= 1;
      cash50 += 1;
      return true;
    }
    if (bill === 100) {
      if (cash50 >= 1 && cash25 >= 1) {
        cash50 -= 1;
        cash25 -= 1;
      } else if (cash25 >= 3) {
        cash25 -= 3;
      } else {
        return false;
      }
    }
    return true;
  });
}

/**
 * Rectangle (function constructor to avoid max-classes-per-file).
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function getArea() {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object.
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation.
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}

/**
 * Sorts the specified array by country name first and city name.
 */
function sortCitiesArray(arr) {
  return [...arr].sort((a, b) => {
    if (a.country !== b.country) {
      return a.country.localeCompare(b.country);
    }
    return a.city.localeCompare(b.city);
  });
}

/**
 * Groups elements of the specified array by key.
 */
function group(array, keySelector, valueSelector) {
  const map = new Map();
  array.forEach((item) => {
    const key = keySelector(item);
    const value = valueSelector(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(value);
  });
  return map;
}

/* ============================ CSS Selector Builder ============================ */

const ORDER = {
  element: 0,
  id: 1,
  class: 2,
  attr: 3,
  pseudoClass: 4,
  pseudoElement: 5,
};

class CssSelector {
  constructor(parts = [], lastType = null) {
    this.parts = parts;
    this.lastType = lastType;
  }

  static clone(newParts, newLastType) {
    return new CssSelector(newParts, newLastType);
  }

  checkOrder(type) {
    if (this.lastType === null) return;
    const countOfType = (t) => this.parts.filter((p) => p.type === t).length;
    const uniqueTypes = ['element', 'id', 'pseudoElement'];
    if (uniqueTypes.includes(type) && countOfType(type) > 0) {
      throw new Error(
        'Element, id and pseudo-element should not occur more than one time inside the selector'
      );
    }
    if (ORDER[type] < ORDER[this.lastType]) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }
  }

  add(type, value) {
    this.checkOrder(type);
    const newParts = [...this.parts, { type, value }];
    return CssSelector.clone(newParts, type);
  }

  element(value) {
    return this.add('element', value);
  }

  id(value) {
    return this.add('id', `#${value}`);
  }

  class(value) {
    return this.add('class', `.${value}`);
  }

  attr(value) {
    return this.add('attr', `[${value}]`);
  }

  pseudoClass(value) {
    return this.add('pseudoClass', `:${value}`);
  }

  pseudoElement(value) {
    return this.add('pseudoElement', `::${value}`);
  }

  static combine(selector1, combinator, selector2) {
    const newParts = [
      ...selector1.parts,
      { type: 'combinator', value: combinator },
      ...selector2.parts,
    ];
    return new CssSelector(newParts, null);
  }

  stringify() {
    return this.parts
      .map((p) => (p.type === 'combinator' ? ` ${p.value} ` : p.value))
      .join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },
  id(value) {
    return new CssSelector().id(value);
  },
  class(value) {
    return new CssSelector().class(value);
  },
  attr(value) {
    return new CssSelector().attr(value);
  },
  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },
  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },
  combine(selector1, combinator, selector2) {
    return CssSelector.combine(selector1, combinator, selector2);
  },
};

module.exports = {
  shallowCopy,
  mergeObjects,
  removeProperties,
  compareObjects,
  isEmptyObject,
  makeImmutable,
  makeWord,
  sellTickets,
  Rectangle,
  getJSON,
  fromJSON,
  group,
  sortCitiesArray,
  cssSelectorBuilder,
};
