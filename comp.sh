cd img
node conv.js
cd ..
cd map/tile
node conv.js
cd ../..
cd message
go run parse.go
cd ..
#browserify main.js > bundle.js
