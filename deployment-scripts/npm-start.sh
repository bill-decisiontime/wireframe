#!/bin/bash
cd /home/ec2-user/wireframe
pm2 delete wireframe
npm run production
pm2 save
