# boilerplate-app-js

## Development Instructions

See [wiki](https://github.com/ArcGIS/boilerplate-app-js/wiki) for details.

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

Configure your web server to include the above directory as virtual directory and browse to it (i.e. http://localhost/path/to/boilerplate-app-js/).

Note: Some networks disallow using the `git://` protocol. To work around this situation, follow the steps listed [here](https://coderwall.com/p/sitezg/force-git-to-clone-with-https-instead-of-git-urls).

### Checking Code for Syntax Errors

Please run [jshint](http://jshint.com/) on the application code before checking in:

```bash
grunt jshint
```

<!--
NOTE: If the git:// protocol is blocked, for example by a company firewall, bower will throw an error similar to this one: `bower ECMDERR Failed to execute "git ls-remote --tags --heads git://github.com/dojo/dojo.git", exit code of #128`. If that happens, issue the following command to tell git to use the https:// protocol instead: `git config --global url."https://".insteadOf git://`

notes:
http://stackoverflow.com/questions/15669091/bower-install-using-only-https
`git config --global url."https://".insteadOf git://`
-->
