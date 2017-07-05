# Bayview

Intuitive, interactive online map deployed by Bay County, Florida. After searching for a parcel, address or point of interest users can quickly learn about nearby schools, parks and other ammenities.

## Development Instructions

<!--
how much of the doc below needs to be ported for this app to be helpful to the public?

[wiki](https://github.com/ArcGIS/boilerplate-app-js/wiki) for details.
-->

### Install

1. install [git](https://git-scm.com/)
2. install [Node.js](https://nodejs.org/)
3. Install global packages with [npm](https://www.npmjs.com)

        npm install -g grunt-cli
        npm install -g bower

4. Clone and/or fork the repo and `cd` into your local folder
5. Run `npm install` for local node packages
6. Run `grunt init` to install dependencies
7. Run `grunt serve` if you would like to run the app (will open the app in a browser and start the `watch` task)

Configure your web server to include the above directory as virtual directory and browse to it (i.e. http://localhost/path/to/Bayview/).

### Checking Code for Syntax Errors

Please run [jshint](http://jshint.com/) on the application code before checking in:

```bash
grunt jshint
```

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing/blob/master/CONTRIBUTING.md).

### License

Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
