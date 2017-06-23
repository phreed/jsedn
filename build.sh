coffee -o lib -c src
component install
component build --standalone tsedn
cp build/build.js ./tsedn.js

