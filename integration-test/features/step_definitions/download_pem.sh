# stackoverflow -> https://stackoverflow.com/questions/65097173/azure-key-vault-download-certificate-with-private-key


# Define the passphrase for the PKCS#12 file.
passphrase=""

pkcs12_file="client_certificate.pfx"
certificate_name="pagopa-d-weu-selfcare-jwt-signing-cert"
KeyVaultName="pagopa-d-selfcare-kv"

# Retrieve the client certificate from the Key Vault
certificate_pfx_base64=$(az keyvault secret show --name ${certificate_name} --vault-name ${KeyVaultName} --query value --output tsv)

echo "$certificate_pfx_base64" | base64 --decode > client_certificate.pfx

# Extract private key and certificates
openssl pkcs12 -in "$pkcs12_file" -passin "pass:$passphrase" -nocerts -nodes -out key.pem
openssl pkcs12 -in "$pkcs12_file" -passin "pass:$passphrase" -nokeys -out cert.pem

# Print the private key
echo "Private Key:"
cat key.pem

# Print the certificates
echo "Certificates:"
cat cert.pem

# Retrieve the public key certificate from the Key Vault
az keyvault certificate download --vault-name ${KeyVaultName} --name ${certificate_name}  --encoding PEM -f public.pem

# display the public certificate
cat public.pem
