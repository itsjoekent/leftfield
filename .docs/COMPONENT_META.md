# Component Meta

## Glossary

`component`

`component type`

`instance`

## Data Structure

```js
/**
 * @typedef ComponentMeta
 * @property {String} documentation (optional) Markdown formatted string documenting the component options.
 * @property {String} name [required] Short name of the component
 * @property {Array<Property>} properties (optional)
 * @property {String} shortDescription (optional) Longer description of the component
 * @property {Array<Slot>} slots (optional) List of slots this component has
 * @property {ComponentTag} tag [required] Unique identifier for this component type
 * @property {Array<Trait>} traits (optional) Traits associated with this component
 */

/**
 * @typedef ComponentTag
 * @type {String}
 */

/**
 * @typedef Property
 * @type {Object}
 * @property {PropertyConditional} conditional (optional) Custom function to decide if this property is shown in the editor
 * @property {PropertyCustomValidation} customValidation (optional) Provide a custom validation function to verify user input
 * @property {PropertyDefaultCampaignThemeValue} defaultCampaignThemeValue Custom function to compute the default value based on the campaign theme
 * @property {Mixed} defaultValue (optional) Default value to assign this property, must be of ${type}
 * @property {PropertyDynamicDefaultOption} dynamicDefaultValue (optional) Custom function to compute the default value for this property
 * @property {PropertyDynamicOptions} dynamicOptions (optional) Custom function to compute a custom list of options for a list property type
 * @property {String} help (optional) Additional help text to display in the editor
 * @property {String} inheritFromSetting (optional) Set the default value of this property based on a site setting value
 * @property {String} label [required] Human readable name for this property
 * @property {Boolean} required (optional) Indicate if this property is required
 * @property {Boolean} translatable (optional) Indicate if this property should have multiple language fields
 * @property {PropertyType} type [required] Property value type
 */

/**
 * @typedef PropertyType
 * @type {String}
 */

/**
 * @name PropertyConditional
 * @function
 * @param {Object} data
 * @param {Object.<String, Mixed>} data.properties Key value container with the properties assigned to this component instance
 * @param {Object} data.slot Values assigned to the slot this component is located within (See "Slot")
 * @return {Boolean}
 */

/**
 * @name PropertyCustomValidation
 * @function
 * @param {Object} data
 * @param {String|Mixed} data.input Value entered into the property field
 * @return {Boolean|ValidationError}
 */

/**
 * @name PropertyDynamicDefaultOption
 * @function
 * @param {Object} data
 * @param {Object} data
 * @param {Object.<String, Mixed>} data.properties Key value container with the properties assigned to this component instance
 * @param {Object} data.slot Values assigned to the slot this component is located within (See "Slot")
 * @return {Mixed} Default value to assign to this property
 */

/**
 * @name PropertyDynamicOptions
 * @function
 * @param {Object} data
 * @param {Object.<String, Mixed>} data.properties Key value container with the properties assigned to this component instance
 * @param {Object} slot Values assigned to the slot this component is located within (See "Slot")
 * @return {Array<String>} Options to display for this property
 */

/**
 * @name PropertyDefaultCampaignThemeValue
 * @function
 * @param {Object} data
 * @param {CampaignTheme} data.campaignTheme Theme values assigned to the page this component lives in
 * @return {Mixed} Default value to assign to this property
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
 * @param {Object.<String, Mixed>} data.properties Key value container with the properties assigned to this component instance
 * @return {Boolean}
 */

/**
 * @name SlotValidation
 * @function
 * @param {Object} data
 * @param {Object} data.properties Properties assigned to this component
 * @param {Array<React.Component>} data.children List of child components given to this slot
 * @return {Boolean|ValidationError}
 */

/**
 * @typedef Constraint
 * @type {Object}
 * @property {Array<Trait>} include Traits a component must have to be used in this slot
 * @property {Array<Trait>} exclude Traits a component cannot have to be used in this slot
 * @property {Array<Trait>} oneOf A component must contain one of the given traits to be used in this slot
 */

/**
 * @typedef ValidationError
 * @type {Error}
 * @property {String} message Custom error message
 * @property {String} severity "Warning" or "Fail"
 */
```
