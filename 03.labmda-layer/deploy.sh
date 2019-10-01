#!/bin/bash

cd sharp-layer && npm run-script build || exit 0;
cd ..
sam package --template-file template.yaml --output-template packaged.yaml --s3-bucket beauty-deploy-artifacts
sam deploy --template-file packaged.yaml --region ap-northeast-2 --capabilities CAPABILITY_IAM --stack-name image-resize-with-layer