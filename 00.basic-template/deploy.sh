#!/bin/bash
sam build
sam package --output-template packaged.yaml --s3-bucket beauty-deploy-artifacts
sam deploy --stack-name basic-sam-function --template-file packaged.yaml --region ap-northeast-2 --capabilities CAPABILITY_IAM
