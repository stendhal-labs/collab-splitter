cd graph-node/docker

ganache-cli -h 0.0.0.0 --deterministic --db ./ganache-db &
 docker-compose up
