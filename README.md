# hapi-debug-manager

```javascript
npm install hapi-debug-manager
```

This plugin is supposed to ease the process of enabling a debug output even in production. Therefore it offers different ways to determine if a request shall be logged or not. The current implementation therefore allows to append two url parameters to a request to send the corresponding session into debugMode. Additionally debugTags can be configured to spot the corresponding logs more easily. Besides enabling the debug for a request based on a session other modes are possible as well but no yet implemented. Imagine a database configured regexp to match certain url patterns to trace a bug which only happens for different users in certain circumstances. Contributions are welcome... :)

requires hapi >= 8.x.x