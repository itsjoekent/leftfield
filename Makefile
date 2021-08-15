start-api:
	docker-compose -f api.docker-compose.yml build
	docker-compose -f api.docker-compose.yml up

upload-production-baseball:
	$(eval CONTAINER_ID=$(shell docker ps -aqf "name=code_workers_1"))
	docker exec -t -i $(CONTAINER_ID) npm run upload:baseball:presentation
