export const validLoginData = [
  {
    label:    'standard user',
    username:  'standard_user',
    password:  'secret_sauce',
  },
  {
    label:    'problem user',
    username:  'problem_user',
    password:  'secret_sauce',
  },
  {
    label:    'visual user',
    username:  'visual_user',
    password:  'secret_sauce',
  },
];

export const validuser = {
  "username": "standard_user",
  "password":  'secret_sauce'
};

export const invalidLoginData = [
  {
    label:    'locked out user',
    username:  'locked_user',
    password:  'secret_sauce',
    error:     'Epic sadface: Username and password do not match any user in this service',
  },
  {
    label:    'invalid credentials',
    username: 'invalid_user',
    password: 'wrong_password',
    error:     'Username and password do not match any user in this service',
  },
  {
    label:    'empty username',
    username: '',
    password: 'secret_sauce',
    error:    'Username is required',
  },
  {
    label:    'empty password',
    username:  'standard_user',
    password: '',
    error:     'Password is required',
  },
  {
    label:    'both fields empty',
    username: '',
    password: '',
    error:     'Username is required',
  },
];