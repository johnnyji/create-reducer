"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable object-shorthand */

/* Creates an object full of action type constants by providing an array of constants
 * @param {Array} constants - An array of action type constant names
 * @returns {undefined}
 */
exports.default = function (constants) {
  return constants.reduce(function (accumConstants, currConstant) {
    return Object.assign({}, accumConstants, _defineProperty({}, currConstant, currConstant));
  }, {});
};

/* eslint-enable object-shorthand */


module.exports = exports["default"];