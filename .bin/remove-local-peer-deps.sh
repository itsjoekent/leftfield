 #!/bin/bash

# If installing an npm package from this mono-repo that specifies peer dependencies,
# they will sometimes be accidentally installed to the `node_modules` folder of the
# package within the application using it.

rm -rf node_modules/pkg.admin-components/node_modules/styled-components
rm -rf node_modules/pkg.admin-components/node_modules/react

rm -rf node_modules/pkg.campaign-components/node_modules/styled-components
rm -rf node_modules/pkg.campaign-components/node_modules/react
