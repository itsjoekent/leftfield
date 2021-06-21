# Component Meta Data Structure

```js
/**
 * @namespace ComponentMeta
 * @property {String} documentation (optional) Markdown formatted string documenting the component options.
 * @property {String} name [required] Short name of the component
 * @property {Array<Property>} properties (optional)
 * @property {String} shortDescription (optional) Longer description of the component
 * @property {Array<Slot>} slots (optional) List of slots this component has
 * @property {Array<Trait>} traits (optional) Traits associated with this component
 * @propery
 */

/**
 * @typedef Slot
 * @type {Object}
 * @property {SlotConditional} conditional (optional) Function that decides if this slot is available
 * @property {Array<Constraint>} constraints (optional) List of constraints that apply to this component
 * @property {SlotValidation} customValidation (optional) Custom function to validate child components of this slot
 * @property {String} help (optional) Additional context on what this slot is used for
 * @property {String} id [required] Unique machine name for this slot
 * @property {String} label [required] Human readable name for this slot
 * @property {Object} layout (optional) Description of how this layout behaves
 * @property {Boolean} list [required] Mark if this slot accepts multiple child components
 * @property {Number} max (optional) Limit how many components can be added to this slot
 * @property {Number} min (optional) Require a certain amount of components to be added to this slot
 */

/**
 * @typedef Trait
 * @type {String}
 */

/**
 * @name SlotConditional
 * @function
 * @param {Object} data
 * @param {Object} data.properties Key/value container with the values given to this component instance
 * @return {Boolean}
 */

/**
 * @name SlotValidation
 * @function
 * @param {Object} data
 * @param {Object} data.properties Properties assigned to this component
 * @param {Array<React.Component>} children List of child components given to this slot
 * @return {Boolean|ValidationError}
 */

/**
 * @typedef Constraint
 * @type {Object}
 * @property {Array<Trait>} include Traits a component must have to be used in this slot
 * @property {Array<Trait>} exclude Traits a component cannot have to be used in this slot
 */

/**
 * @typedef ValidationError
 * @type {Error}
 * @property {String} message Custom error message
 * @property {String} severity "Warning" or "Fail"
```
