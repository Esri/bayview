# Bayview

Intuitive, interactive online map deployed by Bay County, Florida. After searching for a parcel, address or point of interest users can quickly learn about nearby schools, parks and other ammenities.

[View it live](http://gis.baycountyfl.gov/bayview/)

## Development Instructions

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

Please run [jshint](http://jshint.com/) on the application code before committing your changes:

```bash
grunt jshint
```

### Supported Browsers

IE >= 9

## Resources

* [ArcGIS for JavaScript API Resource Center](https://developers.arcgis.com/javascript/3/)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing/blob/master/CONTRIBUTING.md).

### License

Copyright &copy; 2017 Esri

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
