start-api:
	docker-compose -f api.docker-compose.yml build
	docker-compose -f api.docker-compose.yml up

upload-production-baseball:
	$(eval CONTAINER_ID=$(shell docker ps -aqf "name=code_task_manufacture_1"))
	docker exec -t -i $(CONTAINER_ID) npm run upload:baseball:presentation

nuke:
	docker-compose -f api.docker-compose.yml down --remove-orphans
