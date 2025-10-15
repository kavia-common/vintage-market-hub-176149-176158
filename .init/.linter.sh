#!/bin/bash
cd /home/kavia/workspace/code-generation/vintage-market-hub-176149-176158/ecommerce_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

