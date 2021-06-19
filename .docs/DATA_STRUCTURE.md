# Components

## Example Components

- Content
- Split Layout
- Navigation Bar
- Donate Buttons
- Political Disclaimer

## Component Anatomy

**Properties**
Values given to a component that change its content, appearance, etc.

**Traits**
Statically defined values that describe this component.

**Placement Constraints**
Require this component to be the child of a component that includes/excludes certain traits.

**Slots**
Components can accept child components. Child components belong to a slot, and a component can define multiple slots.

**Slot Constraints**
Slots can require or exclude components with certain traits.

**Slot Layout**
Rules that describe the slot grid.

### Example Component

```js
{
  name: 'ActBlue Donate Form',
  traits: [
    'actblue',
    'donate form',
    'fundraising',
  ],
  placementConstraints: ['grid'],
  slots: {
    buttons: {
      list: true,
      min: 1,
      max: 8,
      constraints: {
        include: ['actblue', 'donate button'],
      },
      layout: {
        fillsContainerWide: true,
        growsVertically: true,
      },
    },
  },
  properties: {
    layout: {
      label: 'Form Layout',
      type: 'select',
      dynamicOptions: ({ slot }) => {
        if (slot?.layout?.fullScreenWidth) {
          return ['1 column wide'];
        }

        return ['2 column', '3 column', '4 column'];
      },
      dynamicDefaultValue: ({ slot }) => {
        if (slot?.layout?.fullScreenWidth) {
          return '1 column wide';
        }

        return '2 column';
      },
      required: true,
    },
    color: {
      label: 'Button Text Color',
      type: 'color',
      required: true,
      inheritFromSetting: 'defaultDonateButtonColor',
      defaultThemeValue: 'colors..?',
    },
    backgroundColor: {
      label: 'Button Background Color',
      type: 'color',
      required: true,
      inheritFromSetting: 'defaultDonateButtonBackgroundColor',
      defaultThemeValue: 'colors..?',
    },
    actBlueForm: {
      label: 'ActBlue Donation Form Url',
      type: 'url',
      required: true,
      customValidation: (value) =>  'regex for https://...actlblue.com.../',
      inheritFromSetting: 'defaultActBlueDonationForm',
    },
    express: {
      label: 'Enable ActBlue Express',
      subLabel: 'This will add a small disclaimer below your donation form',
      type: 'boolean',
      defaultValue: false,
    },
    refcode: {
      label: 'Refcode',
      subLabel: 'Add a refcode to track donations coming from this donation form',
      type: 'string',
      inheritFromSetting: 'defaultActBlueRefcode',
    },
    carryTrackingSource: {
      label: 'Track Ads sourcing',
      subLabel: 'Convert a visitors ?source= utm parameter into a custom refcode to track conversions',
      type: 'boolean',
      inheritFromSetting: 'defaultActBlueCarrySource',
    },
  },
}


```

## Component Rules (Or Grid Rules/Constraints?)

## Site Settings -> Template Settings -> Page Settings

All settings are considered inherited from the layer above unless specified.

## Settings Containers

- campaign
- brand
- meta
- SEO
