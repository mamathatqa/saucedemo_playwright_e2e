export type CheckoutInfo = {
  firstName: string;
  lastName:  string;
  zip:       string;
};

export const validCheckout: CheckoutInfo = {
  firstName: 'John',
  lastName:  'Doe',
  zip:       '10001',
};

export const invalidCheckoutData = [
  {
    label:     'blank first name',
    firstName: '',
    lastName:  'Doe',
    zip:       '10001',
    error:     'Error: First Name is required',
  },
  {
    label:     'blank last name',
    firstName: 'John',
    lastName:  '',
    zip:       '10001',
    error:     'Error: Last Name is required',
  },
  {
    label:     'blank zip code',
    firstName: 'John',
    lastName:  'Doe',
    zip:       '',
    error:     'Error: Postal Code is required',
  },
];