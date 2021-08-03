start-api:
	docker-compose -f api.docker-compose.yml build
	docker-compose -f api.docker-compose.yml up
