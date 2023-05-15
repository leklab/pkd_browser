# SFARI Browser

JavaScript tools for exploring genomic data.  

Forked from https://github.com/leklab/pcgc_browser  

which was forked from the original gnomAD browser  
https://github.com/broadinstitute/gnomad-browser

## Requirements

* [Node.js](https://nodejs.org)
* [yarn](https://yarnpkg.com)
* Elastic search
* redis
* mongo
* nginx

## Installation

```
# Elastic search downloaded from
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.4.0.tar.gz

# redis
sudo apt-get install redis

# mongo
sudo apt-get install mongodb

# nginx
sudo apt install nginx

# browser code
git clone https://github.com/leklab/sfari_browser.git

# Install node.js dependencies
cd sfari_browser
yarn
```


## Configuration

Yarn
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt remove cmdtest
sudo apt install yarn
```

Elastic search
```
edit /etc/sysctl.conf
to include the configuration line
vm.max_map_count=262144

then restart
sysctl -p

Example script on starting elastic search
https://github.com/leklab/sfari_browser/blob/master/misc/start_elasticsearch.sh
```

nginx
```
Example site configuration
https://github.com/leklab/sfari_browser/blob/master/misc/sfari-browser

```


## Data sets

* GTEx data set
* Constraint data
* ClinVar (GRCh38) data

## Populating data sets

```
#GTEx
python submit.py --run-locally hail_scripts/populate_gtex_table.py \
--spark-home /home/ubuntu/bin/spark-2.4.3-bin-hadoop2.7 \
--cpu-limit 4 --driver-memory 16G --executor-memory 8G

#Constraint
python submit.py --run-locally hail_scripts/populate_gnomad_constraint.py \
--spark-home /home/ubuntu/bin/spark-2.4.3-bin-hadoop2.7 \
--cpu-limit 4 --driver-memory 16G --executor-memory 8G

#Clinvar data
python submit.py --run-locally hail_scripts/populate_clinvar.py \
--spark-home /home/ubuntu/bin/spark-2.4.3-bin-hadoop2.7 \
--cpu-limit 4 --driver-memory 16G --executor-memory 8G
```

For populating gene models in mongo refer to <a href="https://github.com/leklab/exac_browser/blob/master/gnomad_browser.md">here</a>

## Server configuration
GraphQL API
```
#sfari_browser/packages/api/start.sh 

#contains location of the databases
DEFAULT_ELASTICSEARCH_URL="http://localhost:9200"
DEFAULT_MONGO_URL="mongodb://localhost:27017/exac"
DEFAULT_REDIS_HOST="localhost"
export ELASTICSEARCH_URL=${ELASTICSEARCH_URL:-$DEFAULT_ELASTICSEARCH_URL}
export GNOMAD_MONGO_URL=${MONGO_URL:-$DEFAULT_MONGO_URL}
export REDIS_HOST=${REDIS_HOST:-$DEFAULT_REDIS_HOST}
```

SFARI Browser
```
#sfari_browser/projects/gnomad/build.sh

#contains location of API server
export GNOMAD_API_URL=${GNOMAD_API_URL:-"http://18.212.207.114:8007"}

#contains google analytics tracking id
export GA_TRACKING_ID="UA-149585832-1"

#build code is in 
sfari_browser/projects/gnomad/dist/public
```

## Build and Start

GraphQL API Server
```shell
cd sfari_browser/packages/api
./build.sh
./start.sh
```

SFARI Browser
```shell
cd sfari_browser/packages/api
./build.sh
```













