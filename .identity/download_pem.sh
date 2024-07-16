# stackoverflow -> https://stackoverflow.com/questions/65097173/azure-key-vault-download-certificate-with-private-key

eval "$(jq -r '@sh "export $short_env=\(.env)"')"

# Define the passphrase for the PKCS#12 file.
passphrase=""

pkcs12_file="client_certificate.pfx"
certificate_name='pagopa-d-weu-selfcare-jwt-signing-cert'
KeyVaultName='pagopa-d-selfcare-kv'

# Retrieve the client certificate from the Key Vault
certificate_pfx_base64=$(az keyvault secret show --name ${certificate_name} --vault-name ${KeyVaultName} --query value --output tsv)

echo "$certificate_pfx_base64" | base64 --decode > client_certificate.pfx

# Extract private key and certificates
openssl pkcs12 -in "$pkcs12_file" -passin "pass:$passphrase" -nocerts -nodes -out key.pem

json='{"pem": '$(cat key.pem | jq -Rsa . )'}'
echo -n $json
