// orval.config.ts
const { defineConfig } = require('orval');

module.exports = defineConfig({
  api: {
    input: 'http://127.0.0.1:3000/docs/json',
    output: {
      target: './src/api/generated/',
      client: 'axios',
      mode: 'tags-split',
      clean: true,
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
        operationName: (operation: Record<string, unknown>, route: string, verb: string): string => {
          // Remove '/api/v1' from the route to create cleaner operation names
          const cleanedRoute = route.replace('/api/v1', '');
          // Replace route parameters like ${id} with 'ById' for better readability
          const routeWithParams = cleanedRoute.replace(/\$\{(\w+)\}/g, (match, param) => {
            return param.charAt(0).toUpperCase() + param.slice(1);
          });
          // Convert route to camelCase and remove leading slash
          const routeParts = routeWithParams.split('/').filter(part => part !== '');
          const operationName = routeParts.map((part, index) => 
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
          ).join('');
          
          // Convert hyphens to camelCase (e.g., sign-up -> signUp)
          const camelCaseName = operationName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
          
          return verb.toLowerCase() + camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
        },
      },
    },
  },
});