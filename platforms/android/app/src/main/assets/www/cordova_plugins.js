cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-background-fetch.BackgroundFetch",
      "file": "plugins/cordova-plugin-background-fetch/www/BackgroundFetch.js",
      "pluginId": "cordova-plugin-background-fetch",
      "clobbers": [
        "window.BackgroundFetch"
      ]
    },
    {
      "id": "cordova-background-geolocation-lt.BackgroundGeolocation",
      "file": "plugins/cordova-background-geolocation-lt/www/BackgroundGeolocation.js",
      "pluginId": "cordova-background-geolocation-lt",
      "clobbers": [
        "window.BackgroundGeolocation"
      ]
    },
    {
      "id": "cordova-background-geolocation-lt.API",
      "file": "plugins/cordova-background-geolocation-lt/www/API.js",
      "pluginId": "cordova-background-geolocation-lt"
    },
    {
      "id": "cordova-plugin-android-permissions.Permissions",
      "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
      "pluginId": "cordova-plugin-android-permissions",
      "clobbers": [
        "cordova.plugins.permissions"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-background-fetch": "5.4.1",
    "cordova-background-geolocation-lt": "2.13.1",
    "cordova-plugin-android-permissions": "1.0.0"
  };
});