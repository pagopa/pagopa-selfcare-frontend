rm -rf ./user-data/
node ./00_login.js
node ./01_iban_add.js
node ./01_iban_delete.js
#node ./02_create_station.js
node ./03_export_ibans.js
node ./04_associate_station.js
