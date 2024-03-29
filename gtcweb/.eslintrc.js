module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    'no-unused-vars':'off',
  },
  "globals":{
    "WebCAQueryCertState": true,
    "twcaLib": true
  }
};
